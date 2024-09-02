import json
import psycopg2
import os
from datetime import datetime

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

    # Handle GET request for upcoming events
    if event['httpMethod'] == 'GET':
        # Get database connection details from environment variables
        db_host = os.environ['DB_HOST']
        db_name = os.environ['DB_NAME']
        db_user = os.environ['DB_USER']
        db_password = os.environ['DB_PASSWORD']

        try:
            # Get the current date
            today = datetime.now().date()

            # Connect to the database
            conn = psycopg2.connect(host=db_host, database=db_name, user=db_user, password=db_password)
            cur = conn.cursor()

            # Execute the query to find events that are on or after today's date
            cur.execute("""
                SELECT 
                    id, event_date, title, description, event_time, location
                FROM events
                WHERE event_date >= %s
                ORDER BY event_date, event_time
            """, (today,))
            
            # Fetch all results
            events = cur.fetchall()

            # If no events are found, return an empty list
            if not events:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([])
                }

            # Construct a response list of events
            events_list = []
            for event in events:
                events_list.append({
                    'id': event[0],
                    'event_date': str(event[1]),
                    'title': event[2],
                    'description': event[3],
                    'event_time': str(event[4]),
                    'location': event[5]
                })

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(events_list)
            }

        except Exception as e:
            print(e)
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps('Error fetching events information')
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
