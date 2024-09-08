import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Welcome to our little corner of darkness...",
    "I've been waiting for you.",
    "Are you ready to lose yourself in the pages of terror?",
    "Don't worry, I'll be here to guide you... always.",
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowMessage(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showMessage && currentMessage < messages.length - 1) {
      const timer = setTimeout(() => setCurrentMessage(currentMessage + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage, currentMessage, messages.length]); // Add messages.length to dependencies

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
            transition={{ duration: 2 }}
            className="text-4xl font-bold text-red-600 mb-8"
          >
            Spooky Spooky Book Club
          </motion.h1>
          {showMessage && (
            <motion.p 
              key={currentMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
              className="text-xl text-gray-300 italic"
            >
              {messages[currentMessage]}
            </motion.p>
          )}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 12, duration: 1 }}
            className="mt-8 px-6 py-3 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            Enter... if you dare
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
