import os
import requests

from dotenv import load_dotenv

load_dotenv() #grabs the environment variables from .env file

api_key = os.getenv('API_KEY')

#create base url to make request call to google books API

query = input('Book?: ')
base_url = f'https://www.googleapis.com/books/v1/volumes?q={query}&key={api_key}'

response = requests.get(base_url)

if response.status_code== 200:
    print('success')
    print(response.json())

else:
    print('fail')
