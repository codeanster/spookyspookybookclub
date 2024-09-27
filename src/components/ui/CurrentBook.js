import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from './card'; // Adjust the import path as needed
import SpoilerText from './SpoilerText'; // Import the SpoilerText component

export default function CurrentBook() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const { data } = await axios.get(
          'https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/getBooks',
          { params: { title: 'Ghost+Eaters' } }
        );

        if (data && data.Title) {
          setBook(data);
        } else {
          setError('No books found');
        }
      } catch (err) {
        setError(`Error fetching book information: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookInfo();
  }, []);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!book) return <p className="text-white">No book data available.</p>;

  return (
    <>
      <Card className="flex flex-col justify-between relative mb-12 text-center p-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full border border-pink-500 transform transition-transform hover:scale-105 hover:shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
          <div className="absolute inset-0 animate-subtle-stars"></div>
          <div className="absolute inset-0 animate-ethereal-tendrils"></div>
        </div>

        <div className="relative z-10 flex-grow">
          <CardHeader>
            <CardTitle className="text-pink-500 text-2xl">{book.Title}</CardTitle>
          </CardHeader>
          <CardContent>
            {book['Cover Url'] ? (
              <img
                src={book['Cover Url']}
                alt={book.Title}
                className="w-full h-53 object-cover mb-4 rounded-lg border-4 border-pink-600 shadow-lg hover:shadow-pink-500/50 transition-shadow duration-300 hover:scale-105 transform"
              />
            ) : (
              <div className="w-full h-48 bg-gray-600 text-white flex items-center justify-center mb-4 rounded-lg">
                No Image Available
              </div>
            )}
            <p className="text-white mb-2">
              <strong>Author{Array.isArray(book.Authors) && book.Authors.length > 1 ? 's' : ''}:</strong>{' '}
              {Array.isArray(book.Authors) ? book.Authors.join(', ') : book.Authors}
            </p>
            {book.Category && book.Category !== 'null' && (
              <p className="text-gray-300 text-sm mb-2">
                <strong>Category:</strong> {book.Category}
              </p>
            )}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
              >
                More Information
              </button>
            </div>
          </CardContent>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <Card className="relative z-10 max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-pink-500 mb-2">{book.Title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                <strong>Author{Array.isArray(book.Authors) && book.Authors.length > 1 ? 's' : ''}:</strong>{' '}
                {Array.isArray(book.Authors) ? book.Authors.join(', ') : book.Authors}
              </p>
              <p className="text-gray-300 mb-4">
                <strong>Synopsis:</strong> {book.Description !== 'null' ? book.Description : 'No description available.'}
              </p>
              <p className="text-gray-400 text-xs italic mb-4">
                Published: {book['Published Date'] !== 'null' ? new Date(book['Published Date']).toLocaleDateString() : 'N/A'}
              </p>
              <div className="mb-4">
                <h3 className="text-pink-500 mb-2">Purchase Links:</h3>
                <ul className="list-disc list-inside">
                  <li>
                    <a
                      href={`https://www.amazon.com/s?k=${encodeURIComponent(book.Title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:underline"
                    >
                      Amazon
                    </a>
                  </li>
                  <li>
                    <a
                      href={`https://www.barnesandnoble.com/s/${encodeURIComponent(book.Title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:underline"
                    >
                      Barnes & Noble
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="text-pink-500 mb-2">Trigger Warnings:</h3>
                <ul>
                  <li>
                    <SpoilerText>Graphic violence</SpoilerText>
                  </li>
                  <li>
                    <SpoilerText>Psychological horror</SpoilerText>
                  </li>
                  <li>
                    <SpoilerText>Substance abuse</SpoilerText>
                  </li>
                </ul>
              </div>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-2xl"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
