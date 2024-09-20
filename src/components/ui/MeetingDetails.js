import React from 'react';

const MeetingDetails = () => {
  return (
    <section className="flex flex-col justify-between relative mb-12 text-center p-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full card border-pink-500">
      {/* Cosmic horror overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
        <div className="absolute inset-0 animate-subtle-stars"></div>
        <div className="absolute inset-0 animate-ethereal-tendrils"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow">
        <h2 className="text-3xl font-bold mb-6 text-pink-500">
          Meeting Details
        </h2>
        <div className="text-lg mb-6 text-gray-300 leading-relaxed max-w-3xl mx-auto">
          <p>We meet on the 2nd Saturday of every month at 4pm at Pawsific Northwest Cat Cafe where we talk about what we're currently reading. 
            Then afterwards we go sozialize with the kittens and pay the cat tax </p>
        </div>
      </div>
    </section>
  );
};

export default MeetingDetails;
