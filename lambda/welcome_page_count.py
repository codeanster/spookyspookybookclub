import os
import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

def lambda_handler(event, context):
    # CORS headers to allow requests from any origin
    headers = {
        'Access-Control-Allow-Origin': '*',  # Allow all origins
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    }

    # Handle preflight (OPTIONS) request
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': 'Preflight request successful'
        }

    # Retrieve database connection parameters from environment variables
    db_host = os.environ.get('DB_HOST')
    db_name = os.environ.get('DB_NAME')
    db_user = os.environ.get('DB_USER')
    db_password = os.environ.get('DB_PASSWORD')

    # Validate environment variables
    if not all([db_host, db_name, db_user, db_password]):
        logger.error("Database configuration is missing.")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': 'Database configuration is missing.'
        }

    # Ensure that the request is a POST request
    if event['httpMethod'] != 'POST':
        logger.error("Method not allowed. Only POST is supported.")
        return {
            'statusCode': 405,
            'headers': headers,
            'body': 'Method Not Allowed. Use POST.'
        }

    try:
        # Connect to the PostgreSQL database using a context manager
        with psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_password
        ) as conn:
            with conn.cursor() as cur:
                # SQL to update the visit count
                update_sql = """
                INSERT INTO visit_counts (url, visit_count)
                VALUES ('/welcome', 1)
                ON CONFLICT (url)
                DO UPDATE SET visit_count = visit_counts.visit_count + 1;
                """
                # Execute the SQL command
                cur.execute(update_sql)
                conn.commit()

                # Log successful update
                logger.info('Visit count updated successfully.')

        # Return success response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': 'Visit count updated successfully.'
        }

    except psycopg2.OperationalError as db_conn_error:
        # Handle database connection errors
        logger.error(f"Database connection error: {db_conn_error}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': 'Failed to connect to the database.'
        }

    except psycopg2.Error as db_error:
        # Handle other psycopg2 errors
        logger.error(f"Database error: {db_error}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': 'Error updating visit count in the database.'
        }

    except Exception as e:
        # Catch any other exceptions
        logger.error(f"Unexpected error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': f"An unexpected error occurred: {e}"
        }
