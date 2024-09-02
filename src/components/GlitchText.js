import React from 'react';
import './GlitchText.css'; // We're going to create this file next

const GlitchText = ({ text }) => (
  <h1 className="glitch-text" data-text={text}>
    {text}
  </h1>
);

export default GlitchText;
