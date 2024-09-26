import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-pink-500">Spooky Spooky Book Club</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-pink-500">Home</Link>
          <Link to="/quiz" className="hover:text-pink-500">Quiz</Link>

          {/* <Link to="/welcome" className="hover:text-pink-500">Welcome</Link> */}
          {/* <Link to="/bookshelf" className="hover:text-pink-500">Bookshelf</Link> Add Bookshelf link */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
