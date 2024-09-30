import json
import os
import requests
import psycopg2
import logging
from psycopg2.extras import RealDictCursor

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # Set up CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,GET'
    }

    # Handle preflight request
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('Preflight request successful')
        }

    # Handle GET request for book information
    if event['httpMethod'] == 'GET':
        # Retrieve API key from environment variables
        api_key = os.getenv('API_KEY')
        if not api_key:
            logger.error("API key not found in environment variables.")
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps('API key not found in environment variables')
            }
        
        # Extract the book query from the query parameters
        query = event['queryStringParameters'].get('title', '').strip()
        if not query:
            logger.warning("Book title is required.")
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps('Book title is required')
            }

        try:
            # Step 1: Fetch data from Google Books API
            logger.info(f"Fetching book data from Google Books API for title: {query}")
            base_url = f'https://www.googleapis.com/books/v1/volumes?q=intitle:{requests.utils.quote(query)}&key={api_key}&maxResults=1'
            response = requests.get(base_url)
            if response.status_code != 200:
                logger.error(f"Failed to fetch data from Google Books API: {response.status_code}")
                return {
                    'statusCode': response.status_code,
                    'headers': headers,
                    'body': json.dumps('Failed to fetch data from Google Books API')
                }

            book_data = response.json()
            if 'items' not in book_data or len(book_data['items']) == 0:
                logger.warning("No books found in Google Books API response.")
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps('No books found')
                }

            # Parse Google Books data
            google_book = book_data['items'][0]
            parsed_google_book = parse_google_books_json(google_book)

            # Step 2: Fetch or Insert Author and Book into Database
            db_additional_data = fetch_or_insert_book(parsed_google_book)

            # Merge data
            merged_book = {**parsed_google_book, **db_additional_data}

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(merged_book)
            }

        except Exception as e:
            logger.error(f"Error fetching book information: {e}")
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps('Error fetching book information')
            }

    # If the HTTP method is not GET or OPTIONS
    logger.warning("HTTP method not allowed.")
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps('Method not allowed')
    }

def parse_google_books_json(book_item):
    volume_info = book_item.get('volumeInfo', {})
    return {
        'Title': volume_info.get('title', 'N/A'),
        'Authors': volume_info.get('authors', ['Unknown']),
        'Published Date': volume_info.get('publishedDate', 'N/A'),
        'Description': volume_info.get('description', 'No description available.'),
        'Category': volume_info.get('categories', ['Uncategorized']),
        'Cover Url': volume_info.get('imageLinks', {}).get('thumbnail', ''),
        'ISBN': extract_isbn(volume_info.get('industryIdentifiers', []))
    }

def extract_isbn(industry_identifiers):
    for identifier in industry_identifiers:
        if identifier.get('type') in ['ISBN_10', 'ISBN_13']:
            return identifier.get('identifier')
    return 'N/A'

def fetch_or_insert_book(parsed_google_book):
    # Database connection details from environment variables
    db_host = os.environ.get('DB_HOST')
    db_name = os.environ.get('DB_NAME')
    db_user = os.environ.get('DB_USER')
    db_password = os.environ.get('DB_PASSWORD')

    if not all([db_host, db_name, db_user, db_password]):
        logger.error("Database configuration is incomplete.")
        return {
            'Author Name': 'Unknown',
            'Genre': 'Uncategorized'
        }

    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_password
        )
        cur = conn.cursor(cursor_factory=RealDictCursor)
        conn.autocommit = False
        logger.info("Connected to the database.")

        # Step 2.1: Check if Author Exists
        author_name = parsed_google_book['Authors'][0]
        logger.info(f"Checking if author '{author_name}' exists in the database.")
        cur.execute("""
            SELECT author_id FROM authors WHERE LOWER(name) = LOWER(%s)
        """, (author_name,))
        author = cur.fetchone()

        if author:
            author_id = author['author_id']
            logger.info(f"Author '{author_name}' exists with ID {author_id}.")
        else:
            # Insert new author
            cur.execute("""
                INSERT INTO authors (name) VALUES (%s) RETURNING author_id
            """, (author_name,))
            author_id = cur.fetchone()['author_id']
            logger.info(f"Inserted new author '{author_name}' with ID {author_id}.")

        # Step 2.2: Check if Book Exists
        book_title = parsed_google_book['Title']
        logger.info(f"Checking if book '{book_title}' exists in the database.")
        cur.execute("""
            SELECT book_id FROM books WHERE LOWER(title) = LOWER(%s)
        """, (book_title,))
        book = cur.fetchone()

        if book:
            book_id = book['book_id']
            logger.info(f"Book '{book_title}' already exists with ID {book_id}.")
        else:
            # Insert new book
            cur.execute("""
                INSERT INTO books (title, author_id, isbn, publication_date, description, cover_image_url)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING book_id
            """, (
                book_title,
                author_id,
                parsed_google_book['ISBN'],
                parsed_google_book['Published Date'],
                parsed_google_book['Description'],
                parsed_google_book['Cover Url']
            ))
            book_id = cur.fetchone()['book_id']
            logger.info(f"Inserted new book '{book_title}' with ID {book_id}.")

        # Commit the transaction
        conn.commit()
        logger.info("Transaction committed successfully.")

        # Fetch additional data to return
        additional_data = {
            'Author Name': author_name,
            'Genre': ', '.join(parsed_google_book['Category']) if parsed_google_book['Category'] else 'Uncategorized'
        }

        return additional_data

    except Exception as e:
        # Rollback in case of error
        if 'conn' in locals():
            conn.rollback()
        logger.error(f"Database error: {e}")
        return {
            'Author Name': 'Unknown',
            'Genre': 'Uncategorized'
    for book in book_items:
        grabbed_book = book.get('volumeInfo', {})
        
        # Creates a dictionary with desired attributes, using 'get' with default values
        parsed_book = {
            'Title': grabbed_book.get('title', 'null'),
            'Authors': grabbed_book.get('authors', 'null'),
            'Published Date': grabbed_book.get('publishedDate', 'null'),
            'Description': grabbed_book.get('description', 'null'),
            'Category': grabbed_book.get('categories', 'null'),
            'Cover Url': grabbed_book.get('cover_url',)
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
        logger.info("Database connection closed.")
