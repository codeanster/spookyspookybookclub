import os
import psycopg2
import logging
import hashlib
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

def generate_session_id(user_agent):
    """
    Generate a unique session ID based on the user's user agent and current timestamp.
    This helps anonymize visits while still allowing us to distinguish between different sessions.
    """
    unique_string = user_agent + str(time.time())  # Combine user agent with current time
    return hashlib.sha256(unique_string.encode('utf-8')).hexdigest()  # Generate a hashed session ID

def generate_visitor_hash(user_agent, ip_address):
    """
    Generate a consistent hash for identifying repeat visitors.
    This uses the user-agent and the anonymized IP address to create a hash,
    but does not store the IP address itself.
    """
    anonymized_ip = '.'.join(ip_address.split('.')[:3])  # Keep only the first three octets of the IP
    unique_string = user_agent + anonymized_ip
    return hashlib.sha256(unique_string.encode('utf-8')).hexdigest()

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
    logger.info(f"Connecting to database at host: {db_host} with user: {db_user}")

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

    # Retrieve the user-agent from the request headers
    user_agent = event['headers'].get('User-Agent', 'unknown')

    # Retrieve the IP address (from a proxy or directly from the request)
    ip_address = event['headers'].get('X-Forwarded-For', 'unknown')  # Assuming you're behind a load balancer or reverse proxy

    # Generate a session ID for this visit
    session_id = generate_session_id(user_agent)

    # Generate a visitor hash without storing the IP
    visitor_hash = generate_visitor_hash(user_agent, ip_address)

    try:
        # Connect to the PostgreSQL database using a context manager
        with psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_password
        ) as conn:
            with conn.cursor() as cur:
                # SQL to insert a new visit record
                insert_sql = """
                INSERT INTO visit_log (url, browser_type, session_id, visitor_hash)
                VALUES (%s, %s, %s, %s);
                """
                # Execute the SQL command
                cur.execute(insert_sql, ('/welcome', user_agent, session_id, visitor_hash))
                conn.commit()

                # Log successful insert
                logger.info('New visit logged successfully.')

        # Return success response
        return {
            'statusCode': 200,
            'headers': headers,
            'body': 'New visit logged successfully.'
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
            'body': 'Error logging visit in the database.'
        }

    except Exception as e:
        # Catch any other exceptions
        logger.error(f"Unexpected error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': f"An unexpected error occurred: {e}"
        }
