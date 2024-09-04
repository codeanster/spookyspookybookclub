import os
import requests

from dotenv import load_dotenv

load_dotenv() #grabs the environment variables from .env file

#api key used to authenticate base_url api call
api_key = os.getenv('API_KEY')

#MAIN
def main():
    #looks up books related to users query returning back all options
    book_items = find_books()

    #returns back a dictionary of wanted attributes related to response.json() such as title author...
    book_list = parse_json(book_items)
    
    for book in book_list:
        print(book,'\n')

#PURPOSE: Creates url to call api request returning a json object
#PARAMS: NONE
def find_books():
    #list of items
    book_items = []

    #create base url to make request call to google books API
    query = input('Book?: ')
    base_url = f'https://www.googleapis.com/books/v1/volumes?q={query}&key={api_key}'

    response = requests.get(base_url)

    if response.status_code== 200:
        print('success')
        book_data = response.json()
        if 'items' in book_data:
            relevant_books = book_data['items']
            book_items.extend(relevant_books)
        else:
            print('No books found in API response')   
        return book_items
    else:
        print('fail')
        return -1
    
#PURPOSE: With the books returned from find_books it parses the json file, creating a dictionary with the wanted attriubutes returning that list of dictionaries
#PARAMS: all items returned from the json response
def parse_json(book_items):
    book_list = []

    #parses each individual item, storing into book list to be returned
    for book in book_items:
        #grabs the volumeInfo portion from the json response to be parsed below

        grabbed_book = book.get('volumeInfo')
        #creates a dictionary with wanted attributes
        parsed_book = {
            'Title' : grabbed_book['title'],
            'Authors': grabbed_book['authors'],
            'Published Date': grabbed_book['publishedDate'],
            'Description': grabbed_book['description'],
            'Category': grabbed_book['categories']
        }
        book_list.append(parsed_book)
    
    return book_list

#MAIN
if __name__ == '__main__':
    main()