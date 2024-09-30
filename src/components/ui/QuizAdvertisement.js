// ./components/ui/QuizAdvertisement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';

const QuizAdvertisement = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    navigate('/quiz'); // Update this path based on your routing
  };

  return (
    <section className="relative mb-12 text-center p-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Cosmic horror overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
        <div className="absolute inset-0 animate-subtle-stars"></div>
        <div className="absolute inset-0 animate-ethereal-tendrils"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-4xl font-bold mb-6 text-pink-500 animate-pulse">
          Discover Your Next Frightful Read...
        </h2>
        <p className="text-lg mb-6 text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Take our personalized quiz to uncover horror books tailored to your favorite tropes and themes.
          Answer a few questions and get three chilling recommendations that will haunt your reading list.
        </p>
        <Button
          onClick={handleClick}
          aria-label="Take the quiz to get personalized book recommendations"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-pink-500/50 hover:shadow-lg"
        >
          Take the Quiz
        </Button>
      </div>

      {/* Floating eldritch symbols */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-pink-500/20 animate-float"
            style={{
              fontSize: `${Math.random() * 14 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {['◯', '◭', '△', '▽', '◬', '⬟', '⬢', '⯃', '⯂'][Math.floor(Math.random() * 9)]}
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuizAdvertisement;
