import json
import os
from openai import OpenAI

# Common headers for CORS; adjust 'Access-Control-Allow-Origin' as needed
CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',  # '*' allows all, change for specific domains in production
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
    'Access-Control-Allow-Credentials': 'true'  # Include if needed, set to 'false' if not needed
}

def build_prompt(responses):
    return f"""
Based on the following horror genre preferences:

- **Sub-genres:** {', '.join(responses.get('subGenres', []))}
- **Preferred Tropes:** {', '.join(responses.get('preferredTropes', []))}
- **Themes:** {', '.join(responses.get('preferredThemes', []))}
- **Protagonist Types:** {', '.join(responses.get('protagonistTypes', []))}
- **Antagonist Types:** {', '.join(responses.get('antagonistTypes', []))}
- **Settings:** {', '.join(responses.get('preferredSettings', []))}
- **Atmosphere:** {', '.join(responses.get('atmosphere', []))}
- **Emotional Impact:** {', '.join(responses.get('emotionalImpact', []))}
- **Narrative Styles:** {', '.join(responses.get('narrativeStyles', []))}
- **Plot Complexity:** {responses.get('plotComplexity', '')}
- **Cultural Interests:** {', '.join(responses.get('culturalInterests', []))}
- **Content Warnings to Avoid:** {', '.join(responses.get('contentWarnings', []))}

Please recommend three horror books that match these preferences. Provide a brief description of each book without including any disallowed content.
"""

def lambda_handler(event, context):
    # Handle CORS preflight request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,  # 200 OK for OPTIONS
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'CORS preflight success'})
        }

    # Parse the quiz responses from the event
    try:
        body = json.loads(event['body'])
        quizResponses = body['quizResponses']
    except Exception as e:
        print(f"Error parsing input: {e}")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid input'}),
            'headers': CORS_HEADERS
        }

    # Build the prompt based on user input
    prompt = build_prompt(quizResponses)

    # Initialize OpenAI client with API key
    client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

    # Define the JSON schema for the expected response
    response_format = {
        "type": "json_schema",
        "json_schema": {
            "name": "book_recommendations",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "recommendations": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {"type": "string"},
                                "author": {"type": "string"},
                                "description": {"type": "string"}
                            },
                            "required": ["title", "author", "description"],
                            "additionalProperties": False
                        }
                    }
                },
                "required": ["recommendations"],
                "additionalProperties": False
            },
            "strict": True
        }
    }

    # Call the OpenAI API
    try:
        response = client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {
                    "role": "system",
                    "content": "You are taking in input from users and using it to recommend horror stories to read. When picking horror stories, carefully consider all elements and return 3 books with the description of each without specifying any disallowed content."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format=response_format
        )

        # Extract the assistant's reply
        recommendations = response.choices[0].message.content

        # Return the recommendations
        return {
            'statusCode': 200,
            'body': json.dumps({'recommendations': recommendations}),
            'headers': CORS_HEADERS
        }
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'}),
            'headers': CORS_HEADERS
        }
