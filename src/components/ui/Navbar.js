import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [glitchText, setGlitchText] = useState('Spooky Spooky Book Club');

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance of glitch
        setGlitchText(prevText => 
          prevText.split('').map(char => 
            Math.random() < 0.3 ? String.fromCharCode(Math.floor(Math.random() * 26) + 97) : char
          ).join('')
        );
        setTimeout(() => setGlitchText('Spooky Spooky Book Club'), 100);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []); // Empty dependency array

  return (
    <nav className="bg-black text-white p-4 shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-pink-500 transition-colors duration-300">
          {glitchText}
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;