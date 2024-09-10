import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlitchText = ({ text }) => {
  const [glitchedText, setGlitchedText] = useState(text);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchedStr = text.split('').map(char => {
        if (Math.random() < 0.3) { // Increased chance of glitch
          return String.fromCharCode(Math.floor(Math.random() * 95) + 33);
        }
        return char;
      }).join('');
      setGlitchedText(glitchedStr);
      setTimeout(() => setGlitchedText(text), 150); // Longer glitch duration
    }, 1000); // More frequent glitch checks

    return () => clearInterval(glitchInterval);
  }, [text]);

  return <span>{glitchedText}</span>;
};

const Modal = ({ isOpen, onClose, onConfirm }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Welcome to the margins of reality...",
    "Here, the line between fiction and truth blurs.",
    "Are you prepared to question your perceptions?",
    "In these pages, madness and insight are two sides of the same coin.",
    "Join us. The stories are waiting... and so are we.",
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowMessage(true), 1000); // Faster initial delay
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showMessage && currentMessage < messages.length - 1) {
      const timer = setTimeout(() => setCurrentMessage(currentMessage + 1), 2000); // Faster message change
      return () => clearTimeout(timer);
    }
  }, [showMessage, currentMessage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black flex justify-center items-center z-50"
      >
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }} // Faster fade-in
            className="text-4xl font-bold text-red-600 mb-8"
          >
            <GlitchText text="Spooky Spooky Book Club" />
          </motion.h1>
          {showMessage && (
            <motion.p 
              key={currentMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }} // Faster transition
              className="text-xl text-gray-300 italic"
            >
              <GlitchText text={messages[currentMessage]} />
            </motion.p>
          )}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 10, duration: 1 }} // Adjusted delay for faster slideshow
            className="mt-8 px-6 py-3 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            <GlitchText text="Venture deeper..." />
          </motion.button>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
