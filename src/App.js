import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from "./components/ui/button"; // Your custom Button component
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import CurrentBook from './components/ui/CurrentBook'; // Adjust the path as needed
import GlitchText from './components/GlitchText';
import axios from 'axios';
import BackToTop from './components/ui/BackToTop'; // Adjust the path if necessary
import Calendar from './components/Calendar'; // Adjust the path if necessary

export default function SpookySpookyBookClubLandingPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 900);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const joinSectionRef = useRef(null); // Ref for the "Join Us" section

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToJoinSection = () => {
    if (joinSectionRef.current) {
      joinSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const imgStyle = isMobile
    ? { objectPosition: 'center center', transform: 'translateY(0)' }
    : { objectPosition: '0 -400px' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null);
    try {
      const response = await axios.post('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/subscribe', {
        name,
        email
      });
      setSubmissionStatus('success');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setSubmissionStatus('error');
    }
  };

  return (
    <>
      {/* SEO-Optimized Head using react-helmet */}
      <Helmet>
        <title>Spooky Spooky Book Club | Olympia's Premier Horror Literature Circle</title>
        <meta name="description" content="Join Olympia's Spooky Spooky Book Club for chilling discussions on horror literature. Monthly meetings, diverse readings, and a welcoming community await. Dare to delve deeper?" />
        <meta name="keywords" content="horror book club, Olympia book club, spooky book discussions, horror literature, join book club Olympia" />
        <link rel="canonical" href="https://www.spookyspookybookclub.com" />
        {/* Add the Chatbot script */}
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

      <div className="min-h-screen" style={{ backgroundColor: '#1b1d24', color: 'white' }}>
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

        <main className="max-w-4xl mx-auto px-4">
          {/* Welcome Section */}
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-pink-500">Enter freely and of your own will.</h2>
            <p className="text-lg mb-4">
              Welcome to the Spooky Spooky Book Club! Olympia's horror book club for those who love the dark and mysterious. 
              Our monthly meetings feature open discussions and guided exploration of diverse horror works, 
              from classic gothic to modern cosmic horror, free bookmarks, and free food! We foster a welcoming, judgment-free space 
              for all levels of horror fans to delve into the fragility of our own minds, together.
            </p>
            <Button
              onClick={scrollToJoinSection}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Join Our Coven
            </Button>
          </section>

          {/* Club Info Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gray-800 border-pink-500 border">
              <CardHeader>
                <CardTitle className="text-pink-500">About Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Join us for spine-chilling discussions, eerie explorations, and a community 
                  of fellow horror enthusiasts. From cosmic horror to psychological thrillers, 
                  we embrace all that lurks in the dark corners of literature.
                </p>
              </CardContent>
            </Card>

            {/* Use your new CurrentBook component here */}
            <CurrentBook />

            <Card className="bg-gray-800 border-pink-500 border">
              <CardHeader>
                <CardTitle className="text-pink-500">Meeting Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>TBA somewhere in Downtown Olympia</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-pink-500 border">
              <CardHeader>
                <CardTitle className="text-pink-500">Reading List Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Pet Sematary</li>
                  <li>Grey Noise</li>
                  <li>Uzumaki</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Calendar Section */}
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-pink-500">Upcoming Events</h2>
            <Calendar />
          </section>

          {/* Join Us Form */}
          <section ref={joinSectionRef} className="mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-pink-500 text-center">Join Us</h2>
            <Card className="bg-gray-800 border-pink-500 border">
              <CardHeader>
                <CardTitle className="text-pink-500">Ready to Face Your Fears?</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      className="bg-gray-700" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="bg-gray-700" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                    Submit
                  </Button>
                </form>
                {submissionStatus === 'success' && (
                  <p className="mt-4 text-green-500">Successfully subscribed to the mailing list!</p>
                )}
                {submissionStatus === 'error' && (
                  <p className="mt-4 text-red-500">An error occurred. Please try again.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Add a note above the ChatBot */}
        <div className="fixed bottom-16 right-4 z-50 flex items-center space-x-2">
        <p className="text-white font-bold mb-2 hidden md:block">Click here to chat!</p>

      </div>

        {/* Include the BackToTop button */}
        <BackToTop />

        {/* Footer Section */}
        <footer className="mt-12 text-center text-sm pb-8">
          <p>&copy; 2023 Spooky Spooky Book Club. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
