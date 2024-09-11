import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CurrentBook from './components/ui/CurrentBook';
import BackToTop from './components/ui/BackToTop';
import Calendar from './components/Calendar';
import JoinUsSection from './components/ui/JoinUsSection';
import ClubInfoSection from './components/ui/ClubInfoSection';
import WelcomeSection from './components/ui/WelcomeSection';
import HeaderSection from './components/ui/HeaderSection';
import MeetingDetails from './components/ui/MeetingDetails';
import ReadingListPreview from './components/ui/ReadingListPreview';
import Modal from './components/ui/Modal';
import axios from 'axios';

function MainPage({ showModal }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [isModalOpen, setIsModalOpen] = useState(showModal);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const joinSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsModalOpen(showModal);

    if (showModal) {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': navigator.userAgent,
      };
      axios.post('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/welcome', {}, { headers })
        .then(response => console.log('API call successful:', response.data))
        .catch(error => console.error('Error making API call:', error));
    }
  }, [showModal]);

  const scrollToJoinSection = () => {
    if (joinSectionRef.current) {
      joinSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null);
    try {
      await axios.post('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/subscribe', { name, email });
      setSubmissionStatus('success');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setSubmissionStatus('error');
    }
  };

  const imgStyle = isMobile
    ? { objectPosition: 'center center', transform: 'translateY(0)' }
    : { objectPosition: '0 -400px' };

  return (
    <div className="min-h-screen">
      {/* Skeleton Header Section */}
      <HeaderSection imgStyle={imgStyle} />
      
      {/* Navbar Component moved below the header */}

      {/* Main Content with offset for fixed navbar */}
      <div className="mt-8"> {/* Adjust margin-top as needed */}
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

          {/* <Bookshelf /> */}
        </main>

        <BackToTop />

        <footer className="relative z-10 mt-12 text-center text-sm pb-8">
          <p>&copy; 2024 Spooky Spooky Book Club. All rights reserved.</p>
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
              {['◯','◭','△','▽','◬','⛦','⛥'][Math.floor(Math.random() * 7)]}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Component */}
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm} />}
    </div>
  );
}

export default MainPage;
