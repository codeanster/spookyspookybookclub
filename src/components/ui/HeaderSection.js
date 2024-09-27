import React, { useState } from 'react';
import Navbar from './Navbar';
import GlitchText from '../GlitchText';

const HeaderSection = ({ imgStyle }) => {
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  const handleMouseEnter = () => setGlitchIntensity(prev => Math.min(prev + 1, 3));
  const handleMouseLeave = () => setGlitchIntensity(0);

  return (
    <header className="relative text-center py-16 mb-12 overflow-hidden">
      {/* Black Overlay in Header */}
      <div className="absolute inset-0" style={{ backgroundColor: '#1b1d24', opacity: '0.9', zIndex: 0 }}></div>
      
      {/* Background Image */}
      <img 
        src="https://s3.us-west-1.amazonaws.com/spookyspookybookclub.com/ssbc.png" 
        alt="Spooky Spooky Book Club Logo" 
        className="absolute inset-0 w-full h-full object-cover z-0 responsive-image"
        style={{ 
          ...imgStyle,
          transition: 'transform 0.8s ease-out'
        }}
      />
      
      {/* Header Content */}
      <div 
        className="relative z-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <h1 className="text-6xl font-bold mb-4 text-pink-500">Spooky Spooky Book Club</h1>

        <GlitchText text="Get Out" intensity={glitchIntensity} />
      </div>

      {/* Navbar Positioned Below Header Content */}
      <div className="relative z-20 mt-4">
        <Navbar />
      </div>
    </header>
  );
};

export default HeaderSection;