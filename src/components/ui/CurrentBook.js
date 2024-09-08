import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "./card"; // Adjust the path as needed

export default function CurrentBook() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await axios.get('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/getBook', {
          params: { title: 'Ghost Eaters' }, // Enter book title here for book of the month
        });
        setBook(response.data);
      } catch (err) {
        setError('Error fetching book information');
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
    <Card className="flex flex-col justify-between relative mb-12 text-center p-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full card border border-pink-500">
      {/* Cosmic horror overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
        <div className="absolute inset-0 animate-subtle-stars"></div>
        <div className="absolute inset-0 animate-ethereal-tendrils"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow">
        <CardHeader>
          <CardTitle className="text-pink-500">{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {book.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-600 text-white flex items-center justify-center mb-4 rounded-lg">
              No Image Available
            </div>
          )}
          <p className="text-white">
            <strong>Author:</strong> {book.author_name}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
