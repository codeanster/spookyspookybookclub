import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "./card";  // Adjust the path as needed

export default function CurrentBook() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await axios.get('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/getBook', {
          params: { title: 'Ghost Eaters' } // enter book title here for book of the month
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>No book data available.</p>;

  return (
    <Card className="bg-gray-800 border-pink-500 border">
      <CardHeader>
        <CardTitle className="text-pink-500">{book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-48 object-cover mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-600 text-white flex items-center justify-center mb-4">
            No Image Available
          </div>
        )}
        <p className="text-white">
          <strong>Author:</strong> {book.author_name}
        </p>
      </CardContent>
    </Card>
  );
}
