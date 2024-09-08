import React, { useEffect, useState, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Updated import
import CurrentBook from './components/ui/CurrentBook'; 
import axios from 'axios';
import BackToTop from './components/ui/BackToTop'; 
import Calendar from './components/Calendar'; 
import JoinUsSection from './components/ui/JoinUsSection'; 
import ClubInfoSection from './components/ui/ClubInfoSection'; 
import WelcomeSection from './components/ui/WelcomeSection'; 
import HeaderSection from './components/ui/HeaderSection'; 
import MeetingDetails from './components/ui/MeetingDetails';
import ReadingListPreview from './components/ui/ReadingListPreview';

export default function SpookySpookyBookClubLandingPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 900);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const joinSectionRef = useRef(null); 

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
      await axios.post('/Prod/subscribe', {
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
    <HelmetProvider>
      {/* Wrap your entire app in HelmetProvider */}
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

      <div className="min-h-screen">
        {/* Cosmic horror overlay */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
          <div className="absolute inset-0 animate-subtle-stars"></div>
          <div className="absolute inset-0 animate-ethereal-tendrils"></div>
        </div>

        <HeaderSection imgStyle={imgStyle} />

        <main className="relative z-10 max-w-4xl mx-auto px-4">
          <WelcomeSection scrollToJoinSection={scrollToJoinSection} />

          <section className="grid-container min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <ClubInfoSection />
            <CurrentBook />
            <MeetingDetails />
            <ReadingListPreview />
          </section>

          <section className="mb-12 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-pink-500">Upcoming Events</h2>
            <Calendar />
          </section>

          <JoinUsSection 
            joinSectionRef={joinSectionRef}
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            submissionStatus={submissionStatus}
          />
        </main>

        <div className="fixed bottom-16 right-4 z-50 flex items-center space-x-2">
          <p className="text-white font-bold mb-2 hidden md:block">Click here to chat!</p>
        </div>

        <BackToTop />

        <footer className="relative z-10 mt-12 text-center text-sm pb-8">
          <p>&copy; 2023 Spooky Spooky Book Club. All rights reserved.</p>
        </footer>

        {/* Floating eldritch symbols */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute text-pink-500/20 animate-float"
              style={{
                fontSize: `${Math.random() * 14 + 8}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 15 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              {['◯','◭','△','▽','◬','⬟','⬢','⯃','⯂'][Math.floor(Math.random() * 9)]}
            </div>
          ))}
        </div>
      </div>
    </HelmetProvider>
  );
}
