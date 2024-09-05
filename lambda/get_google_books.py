import json
import os
import requests

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
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps('API key not found in environment variables')
            }
        
        # Extract the book query from the query parameters
        query = event['queryStringParameters'].get('title', '')  # Ensure the query parameter matches your request
        if not query:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps('Book title is required')
            }

        try:
            # Make a request to the Google Books API
            base_url = f'https://www.googleapis.com/books/v1/volumes?q={query}&key={api_key}&maxResults=1'
            response = requests.get(base_url)
            print(response.json())
            if response.status_code == 200:
                book_data = response.json()
                print(book_data)
                if 'items' in book_data:
                    # Parse the book data
                    book_list = parse_json(book_data['items'])
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps(book_list)
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps('No books found')
                    }
            else:
                return {
                    'statusCode': response.status_code,
                    'headers': headers,
                    'body': json.dumps('Failed to fetch data from Google Books API')
                }

        except Exception as e:
            print(e)
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps('Error fetching book information')
            }

    # If the HTTP method is not GET or OPTIONS
    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps('Method not allowed')
    }

# Function to parse JSON response from Google Books API
def parse_json(book_items):
    book_list = []

    for book in book_items:
        grabbed_book = book.get('volumeInfo', {})
        
        # Creates a dictionary with desired attributes, using 'get' with default values
        parsed_book = {
            'Title': grabbed_book.get('title', 'null'),
            'Authors': grabbed_book.get('authors', 'null'),
            'Published Date': grabbed_book.get('publishedDate', 'null'),
            'Description': grabbed_book.get('description', 'null'),
            'Category': grabbed_book.get('categories', 'null')
        }
        book_list.append(parsed_book)
    
    return book_list
