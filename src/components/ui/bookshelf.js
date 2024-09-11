import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const books = [
  { id: 1, title: "The Shining", author: "Stephen King", genre: "Psychological Horror", pattern: "radial-gradient(circle, #8B0000 0%, #420000 100%)" },
  { id: 2, title: "House of Leaves", author: "Mark Z. Danielewski", genre: "Experimental Horror", pattern: "repeating-linear-gradient(45deg, #00008B, #00008B 10px, #000066 10px, #000066 20px)" },
  { id: 3, title: "The Haunting of Hill House", author: "Shirley Jackson", genre: "Gothic Horror", pattern: "linear-gradient(135deg, #006400 25%, #004d00 25%, #004d00 50%, #006400 50%, #006400 75%, #004d00 75%, #004d00 100%)" },
  { id: 4, title: "Dracula", author: "Bram Stoker", genre: "Gothic Horror", pattern: "repeating-radial-gradient(circle, #800080, #800080 5px, #4B0082 5px, #4B0082 10px)" },
  { id: 5, title: "The Call of Cthulhu", author: "H.P. Lovecraft", genre: "Cosmic Horror", pattern: "linear-gradient(45deg, #008080 25%, transparent 25%), linear-gradient(-45deg, #008080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #008080 75%), linear-gradient(-45deg, transparent 75%, #008080 75%)" },
  { id: 6, title: "It", author: "Stephen King", genre: "Supernatural Horror", pattern: "radial-gradient(circle, #FF4500 0%, #8B0000 100%)" },
  { id: 7, title: "The Exorcist", author: "William Peter Blatty", genre: "Supernatural Horror", pattern: "repeating-linear-gradient(0deg, #2F4F4F, #2F4F4F 10px, #1C2C2C 10px, #1C2C2C 20px)" },
  { id: 8, title: "Frankenstein", author: "Mary Shelley", genre: "Gothic Horror", pattern: "linear-gradient(90deg, #4B0082, #8A2BE2)" },
];

const Book = ({ book, onClick, style }) => (
  <motion.div
    whileHover={{ scale: 1.1, rotateY: 15, zIndex: 1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{
      ...style,
      width: '60px',
      height: '200px',
      background: book.pattern,
      margin: '0 5px',
      borderRadius: '0 5px 5px 0',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      writingMode: 'vertical-rl',
      textOrientation: 'mixed',
      color: 'white',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
      boxShadow: '5px 5px 15px rgba(0,0,0,0.3), -1px -1px 1px rgba(255,255,255,0.2) inset',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    {book.title}
  </motion.div>
);

const BookDetail = ({ book, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#2c2c2c',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      zIndex: 1000,
      minWidth: '300px',
    }}
  >
    <h2 style={{ borderBottom: '2px solid #666', paddingBottom: '10px' }}>{book.title}</h2>
    <p>Author: {book.author}</p>
    <p>Genre: {book.genre}</p>
    <button onClick={onClose} style={{ backgroundColor: '#666', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
  </motion.div>
);

const Bookshelf = ({ books, onSelectBook }) => (
  <div style={{ 
    display: 'flex', 
    flexWrap: 'wrap',
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    minHeight: '250px', 
    backgroundColor: 'rgba(139, 69, 19, 0.7)', 
    padding: '20px', 
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 0 50px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {books.map((book, index) => (
      <Book 
        key={book.id} 
        book={book} 
        onClick={() => onSelectBook(book)}
        style={{
          transform: `translateZ(${index * 5}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
    ))}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '20px',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)',
      pointerEvents: 'none'
    }} />
  </div>
);

const DustParticle = ({ delay }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: '2px',
      height: '2px',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
    }}
    animate={{
      x: ['0%', '100%'],
      y: ['0%', '100%'],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      delay,
      ease: 'linear',
    }}
  />
);

const InteractiveBookshelf = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books);

  useEffect(() => {
    setFilteredBooks(
      books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div style={{ 
      background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23594d3f\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M0 0h100v100H0z\'/%3E%3Cpath fill=\'%23412f1c\' d=\'M0 0h50v50H0zM50 50h50v50H50z\'/%3E%3C/g%3E%3C/svg%3E")',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '20px',
        height: '20px',
        background: 'radial-gradient(circle, rgba(255,165,0,0.8) 0%, rgba(255,69,0,0.3) 70%, transparent 100%)',
        borderRadius: '50%',
        animation: 'flicker 2s infinite alternate',
        boxShadow: '0 0 10px rgba(255,165,0,0.8), 0 0 20px rgba(255,69,0,0.3)',
      }} />
      <style>
        {`
          @keyframes flicker {
            0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: 1; }
            20%, 24%, 55% { opacity: 0.5; }
          }
        `}
      </style>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
        marginTop: '40px',
        position: 'relative',
        height: '200px'
      }}>
        <div style={{ 
          width: '300px',
          height: '300px',
          overflow: 'hidden', 
          borderRadius: '10px',
          position: 'absolute',
          top: '-50px',
          left: '-40px'
        }}>
          <img 
            src="https://s3.us-west-1.amazonaws.com/spookyspookybookclub.com/spooky.png" 
            alt="Spooky Logo" 
            style={{ width: '125%', height: '125%', objectFit: 'cover' }}
          />
        </div>
        <h1 style={{ 
          color: '#FFD700', 
          fontFamily: 'Creepster, cursive', 
          fontSize: '2.5em', 
          marginLeft: '140px',
          marginRight: '200px',
          marginTop: '20px',
          textAlign: 'center',
          flex: 1
        }}>
          Spooky's Library
        </h1>
        <div style={{ 
          width: '180px',
          height: '180px',
          overflow: 'hidden', 
          borderRadius: '10px',
          position: 'absolute',
          top: '10px',
          right: '30px'
        }}>
          <img 
            src="https://s3.us-west-1.amazonaws.com/spookyspookybookclub.com/lovecraft.png" 
            alt="Lovecraft" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
      <input 
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: '1px solid #666',
          borderRadius: '5px',
        }}
      />
      <Bookshelf books={filteredBooks} onSelectBook={setSelectedBook} />
      <AnimatePresence>
        {selectedBook && <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />}
      </AnimatePresence>
      {[...Array(20)].map((_, i) => (
        <DustParticle key={i} delay={i * 0.5} />
      ))}
    </div>
  );
}

export default InteractiveBookshelf;
