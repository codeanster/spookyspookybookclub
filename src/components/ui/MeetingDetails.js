import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card'; // Adjust the path if needed

const MeetingDetails = () => {
  return (
    <Card className="flex flex-col justify-between relative mb-12 text-center p-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full border border-pink-500">
      {/* Cosmic horror overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
        <div className="absolute inset-0 animate-subtle-stars"></div>
        <div className="absolute inset-0 animate-ethereal-tendrils"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-6 text-pink-500">
            Meeting Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg mb-6 text-gray-300 leading-relaxed max-w-3xl mx-auto">
            <p>
              We meet on the <strong>2nd Saturday of every month at 4 PM</strong> at
              <em> Pawsific Northwest Cat Cafe</em>, where we dive into discussions about what’s currently on our shelves.
            </p>
            <p>
              Afterwards, we pay the ultimate cat tax—socializing with the cafe’s adorable, adoptable kittens. 🐾
            </p>
            <p>
              <strong>Come for the creepy, stay for the kittens.</strong> Who knows? You might just find the purrfect horror companion. 🕷️🐱
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MeetingDetails;
