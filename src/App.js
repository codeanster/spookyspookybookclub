import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import MainPage from './MainPage';
import Navbar from './components/ui/Navbar'; // Import Navbar
import Bookshelf from './components/ui/bookshelf'; // Import Bookshelf

export default function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Spooky Spooky Book Club | Olympia's Premier Horror Literature Circle</title>
        <meta name="description" content="Join Olympia's Spooky Spooky Book Club for chilling discussions on horror literature. Monthly meetings, diverse readings, and a welcoming community await. Dare to delve deeper?" />
        <meta name="keywords" content="horror book club, Olympia book club, spooky book discussions, horror literature, join book club Olympia" />
        <link rel="canonical" href="https://www.spookyspookybookclub.com" />
        <script type="module">
          {`
            import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
            Chatbot.init({
              chatflowid: "5bc6bc00-6184-4154-8339-a70cf333b715",
              apiHost: "https://flowiseai-railway-production-36ff.up.railway.app",
            });
          `}
        </script>
      </Helmet>

      <Router>
        <Navbar /> {/* Add Navbar here */}
        <Routes>
          <Route path="/" element={<MainPage showModal={false} />} />
          <Route path="/welcome" element={<MainPage showModal={true} />} />
          <Route path="/bookshelf" element={<Bookshelf />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
