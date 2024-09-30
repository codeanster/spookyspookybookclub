import React, { useState, useEffect } from 'react';
import './GlitchText.css';

const GlitchText = ({ text }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance of glitch
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <h1 className={`glitch-text ${isGlitching ? 'glitch' : ''}`} data-text={text}>
      {text}
    </h1>
  );
};

export default GlitchText;