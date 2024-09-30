import React, { useState, useEffect, useMemo } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';

const GlitchText = ({ text }) => {
  const [glitchedText, setGlitchedText] = useState(text);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchedStr = text.split('').map(char => {
        if (Math.random() < 0.3) {
          return String.fromCharCode(Math.floor(Math.random() * 95) + 33);
        }
        return char;
      }).join('');
      setGlitchedText(glitchedStr);
      setTimeout(() => setGlitchedText(text), 150); // Longer glitch duration
    }, 1000);

    return () => clearInterval(glitchInterval);
  }, [text]);

  return <span>{glitchedText}</span>;
};

const Modal = ({ isOpen, onClose, onConfirm }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showImage, setShowImage] = useState(false); // State for image fade-in
  const [isDesktop, setIsDesktop] = useState(false); // Track if we're on desktop

  const messages = useMemo(() => [
    "Welcome to the margins of reality...",
    "Here, the line between fiction and truth blurs.",
    "Are you prepared to question your perceptions?",
    "In these pages, madness and insight are two sides of the same coin.",
    "Join us. The stories are waiting... and so are we.",
  ], []);

  useEffect(() => {
    if (isOpen) {
      const messageTimer = setTimeout(() => setShowMessage(true), 1000);
      const imageTimer = setTimeout(() => setShowImage(true), 7000); // Image fade-in after 7 seconds
      return () => {
        clearTimeout(messageTimer);
        clearTimeout(imageTimer);
      };
    }
  }, [isOpen]);

  // Track window size for desktop or mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 700); // Check if the screen width is >= 768px
    };
    
    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize); // Add resize listener
    return () => window.removeEventListener('resize', handleResize); // Clean up
  }, []);

  useEffect(() => {
    if (showMessage && currentMessage < messages.length - 1) {
      const timer = setTimeout(() => setCurrentMessage(currentMessage + 1), 2000); // Faster message change
      return () => clearTimeout(timer);
    }
  }, [showMessage, currentMessage, messages.length]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black flex justify-center items-center z-50"
        style={
          isDesktop
            ? {
                backgroundSize: 'cover', // Background size for larger screens
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url('https://s3.us-west-1.amazonaws.com/spookyspookybookclub.com/milk-small.jpg')`, // Image as background for larger screens
                opacity: showImage ? 1 : 0, // Control the opacity with the state
                transition: 'opacity 30s ease-in', // Slow fade-in on larger screens
              }
            : {} // No background image on mobile
        }
      >
        <div className="text-center relative z-10"> {/* Keep content above the background */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
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
              transition={{ duration: 0.5 }}
              className="text-xl text-gray-300 italic"
            >
              <GlitchText text={messages[currentMessage]} />
            </motion.p>
          )}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 10, duration: 1 }}
            className="mt-8 px-6 py-3 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            <GlitchText text="Venture deeper..." />
          </motion.button>
        </div>

        {/* Show the image below button ONLY on mobile */}
        {!isDesktop && (
          <motion.img
            src="https://s3.us-west-1.amazonaws.com/spookyspookybookclub.com/milk-small.jpg" // S3-hosted image
            alt="Creepy Eyes"
            className="mobile-image absolute w-1/2 h-auto bottom-10 left-1/4 z-10" // Only show on mobile
            initial={{ opacity: 0 }}
            animate={showImage ? { opacity: 1 } : {}}
            transition={{ duration: 40 }} // Fade-in duration
          />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;