// SpoilerText.js
import React, { useState } from 'react';

export default function SpoilerText({ children }) {
  const [revealed, setRevealed] = useState(false);

  const hiddenStyle = {
    backgroundColor: '#333',
    color: '#333',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: '4px',
    transition: 'color 0.3s ease',
  };

  const revealedStyle = {
    color: '#f1f1f1',
    cursor: 'default',
  };

  return (
    <span
      style={revealed ? revealedStyle : hiddenStyle}
      onClick={() => setRevealed(true)}
      onMouseEnter={() => setRevealed(true)}
    >
      {children}
    </span>
  );
}
