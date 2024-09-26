// ConsentModal.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card'; // Adjust the import path as needed

const ConsentModal = ({ onConsent }) => {
  const handleConsent = (consent) => {
    onConsent(consent);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={() => handleConsent(false)}
      ></div>

      {/* Modal Content */}
      <Card className="relative z-10 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-pink-500 mb-2">
            Take the Quiz?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-6">
            Answer some questions about what kind of tropes you like reading about, and our AI will pick some books for you. 
            You can accept or decline whether you would like these results saved.
            You can access your results either way
          </p>
          <div className="flex justify-around">
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded transition-all duration-300"
              onClick={() => handleConsent(true)}
            >
              I Accept
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-all duration-300"
              onClick={() => handleConsent(false)}
            >
              I Decline
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentModal;
