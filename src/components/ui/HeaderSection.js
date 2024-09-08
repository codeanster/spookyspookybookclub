import React from 'react';
import GlitchText from '../GlitchText'; // Adjust the path if needed

const HeaderSection = ({ imgStyle }) => {
  return (
    <header className="relative text-center py-16 mb-12 overflow-hidden">
      {/* Black Overlay in Header */}
      <div className="absolute inset-0" style={{ backgroundColor: '#1b1d24', opacity: '0.9', zIndex: 0 }}></div>
      <img 
        src="https://s3.us-west-1.amazonaws.com/spookyspookybookclub.com/ssbc.png" 
        alt="Spooky Spooky Book Club Logo" 
        className="absolute inset-0 w-full h-full object-cover z-0 responsive-image"
        style={{ 
          ...imgStyle,
          transition: 'transform 0.8s ease-out'
        }}
      />
      <div className="relative z-10">
        <h1 className="text-6xl font-bold mb-4 text-pink-500">Spooky Spooky Book Club</h1>
        <h2 className="text-3xl font-bold" 
          style={{ 
            color: '#B22222', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            background: 'linear-gradient(#B22222, #B22222) no-repeat',
            backgroundSize: '100% 95%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 1px #B22222)'
          }}>
          Olympia Horror Book Club
        </h2>
        <GlitchText text="Get Out" />
      </div>
    </header>
  );
};

export default HeaderSection;
