import json
import uuid

def lambda_handler(event, context):
    # Generate a unique token
    unique_token = str(uuid.uuid4())
    
    # Construct your URL with the token
    base_url = "https://www.spookyspookybookclub.com/welcome"  # Replace with your actual base URL
    url_with_token = f"{base_url}?token={unique_token}"
    
    # Return the response in JSON format
    return {
        'statusCode': 200,
        'body': json.dumps({'url': url_with_token})
    }
