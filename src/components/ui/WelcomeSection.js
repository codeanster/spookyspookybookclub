import React, { useState, useEffect } from 'react';
import { Button } from './button';

const WelcomeSection = ({ scrollToJoinSection }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

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
          Enter freely and of your own will...
        </h2>
        <p className="text-lg mb-6 text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Welcome, brave souls, to the Spooky Spooky Book Club! Olympia's sanctuary for those who dare to explore the shadows.
          Our monthly gatherings summon discussions of terror, from gothic classics to cosmic horrors unknown.
          Join us for spine-chilling tales, haunted bookmarks, and refreshments that may or may not be cursed.
          All are welcome in our judgment-free coven, where we peer into the abyss... and it peers back.
        </p>
        <Button
          onClick={scrollToJoinSection}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-pink-500/50 hover:shadow-lg"
        >
          Join Our Coven
        </Button>
      </div>

      {/* Floating eldritch symbols */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-pink-500/20 animate-float"
            style={{
              fontSize: `${Math.random() * 14 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {['◯','◭','△','▽','◬','⬟','⬢','⯃','⯂'][Math.floor(Math.random() * 9)]}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WelcomeSection;
