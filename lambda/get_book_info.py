import json
import psycopg2
import os

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
        # Get database connection details from environment variables
        db_host = os.environ['DB_HOST']
        db_name = os.environ['DB_NAME']
        db_user = os.environ['DB_USER']
        db_password = os.environ['DB_PASSWORD']

        # Extract the book title from the query parameters
        title = event['queryStringParameters'].get('title', '')

        if not title:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps('Book title is required')
            }

        try:
            # Connect to the database
            conn = psycopg2.connect(host=db_host, database=db_name, user=db_user, password=db_password)
            cur = conn.cursor()

            # Execute the query to find the book by title
            cur.execute("""
                SELECT 
                    book_id, title, a.author_id, isbn, publication_date, genre_id, description, cover_image_url , a.name as author_name
                FROM books b
                JOIN authors a on a.author_id = b.author_id
                WHERE title = %s
            """, (title,))
            
            # Fetch the result
            book = cur.fetchone()

            # If no book is found, return a 404 response
            if not book:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps('Book not found')
                }

            # Construct a response dictionary
            book_info = {
                'book_id': book[0],
                'title': book[1],
                'author_id': book[2],
                'isbn': book[3],
                'publication_date': str(book[4]),
                'genre_id': book[5],
                'description': book[6],
                'cover_image_url': book[7],
                'author_name': book[8]
            }

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(book_info)
            }

        except Exception as e:
            print(e)
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps('Error fetching book information')
            }
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()

    # If the HTTP method is not GET or OPTIONS
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps('Method not allowed')
    }
