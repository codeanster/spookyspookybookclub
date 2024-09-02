import json
import psycopg2
import os

#adds email to mailing list and user list
def lambda_handler(event, context):
    # Set up CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',  # Allow all origins
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    }

    # Handle preflight request
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('Preflight request successful')
        }

    # Get database connection details from environment variables
    db_host = os.environ['DB_HOST']
    db_name = os.environ['DB_NAME']
    db_user = os.environ['DB_USER']
    db_password = os.environ['DB_PASSWORD']

    # Parse the incoming request body
    body = json.loads(event['body'])
    name = body['name']
    email = body['email']

    try:
        # Connect to the database
        conn = psycopg2.connect(host=db_host, database=db_name, user=db_user, password=db_password)
        cur = conn.cursor()

        # Insert the new user
        cur.execute(
            "INSERT INTO users (name, email) VALUES (%s, %s) RETURNING id",
            (name, email)
        )
        user_id = cur.fetchone()[0]

        # Add user to mailing list
        cur.execute(
            "INSERT INTO mailing_list (user_id) VALUES (%s)",
            (user_id,)
        )
        conn.commit()

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('Successfully added to mailing list')
        }
    except psycopg2.IntegrityError:
        # This will catch duplicate email errors
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps('Email already exists in mailing list')
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps('Error adding to mailing list')
        }
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

