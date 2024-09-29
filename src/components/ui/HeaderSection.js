import React from 'react';
import Navbar from './Navbar'; // Import Navbar
import GlitchText from '../GlitchText'; // Adjust the path if needed

const HeaderSection = ({ imgStyle }) => {
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
      <div className="relative z-10">
        <h1 
          className="text-6xl font-bold mb-4" 
          style={{ 
            fontFamily: "'Creepster', cursive", 
            color: '#ff007f', 
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', /* Adds shadow */
            backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Optional: adds dark transparent background */
            padding: '10px', 
            borderRadius: '5px' 
          }}
        >
          Spooky Spooky Book Club
        </h1>

        <GlitchText text="Get Out" />
      </div>

      {/* Navbar Positioned Below Header Content */}
      <div className="relative z-20 mt-4"> {/* Add margin to space it from the header */}
        <Navbar />
      </div>
    </header>
  );
};

export default HeaderSection;
