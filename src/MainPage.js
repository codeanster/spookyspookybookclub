// MainPage.js

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import CurrentBook from './components/ui/CurrentBook';
import BackToTop from './components/ui/BackToTop';
import Calendar from './components/Calendar';
import JoinUsSection from './components/ui/JoinUsSection';
import WelcomeSection from './components/ui/WelcomeSection';
import HeaderSection from './components/ui/HeaderSection';
import MeetingDetails from './components/ui/MeetingDetails';
import Modal from './components/ui/Modal';
import QuizAdvertisement from './components/ui/QuizAdvertisement';
import CountdownTimer from './components/ui/CountdownTimer';

function MainPage({ showModal }) {
  // State variables
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [isModalOpen, setIsModalOpen] = useState(showModal);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [nextEventDate, setNextEventDate] = useState(null);
  const [nextEventTitle, setNextEventTitle] = useState('');
  const [nextEventLocation, setNextEventLocation] = useState('');

  const joinSectionRef = useRef(null);
  const navigate = useNavigate();

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle modal visibility and welcome API call
  useEffect(() => {
    setIsModalOpen(showModal);

    if (showModal) {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': navigator.userAgent,
      };
      axios
        .post('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/welcome', {}, { headers })
        .then((response) => console.log('API call successful:', response.data))
        .catch((error) => console.error('Error making API call:', error));
    }
  }, [showModal]);

  // Fetch upcoming events and set the next event details
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axios.get(
          'https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/getUpcomingEvents'
        );
        const fetchedEvents = response.data.map((event) => ({
          date: new Date(`${event.event_date}T${event.event_time}Z`), // Ensure UTC time
          title: event.title,
          description: event.description,
          time: convertToCivilianTime(event.event_time),
          location: event.location,
        }));
        if (fetchedEvents.length > 0) {
          const nextEvent = fetchedEvents[0];
          setNextEventDate(nextEvent.date);
          setNextEventTitle(nextEvent.title);
          setNextEventLocation(nextEvent.location);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Function to convert time to 12-hour format
  const convertToCivilianTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    let hoursInt = parseInt(hours, 10);
    const period = hoursInt >= 12 ? 'PM' : 'AM';
    hoursInt = hoursInt % 12 || 12;
    return `${hoursInt}:${minutes} ${period}`;
  };

  // Scroll to the join section when "Join Us" button is clicked
  const scrollToJoinSection = () => {
    if (joinSectionRef.current) {
      joinSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  // Handle modal confirm
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  // Handle form submission for joining the club
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null);
    try {
      await axios.post('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/subscribe', {
        name,
        email,
      });
      setSubmissionStatus('success');
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      setSubmissionStatus('error');
    }
  };

  // Style adjustments based on device type
  const imgStyle = isMobile
    ? { objectPosition: 'center center', transform: 'translateY(0)' }
    : { objectPosition: '0 -400px' };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <HeaderSection imgStyle={imgStyle} />

      <div className="flex justify-center items-center">
        <h2
          className="text-3xl font-bold text-center"
          style={{
            color: '#B22222',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            background: 'linear-gradient(#B22222, #B22222) no-repeat',
            backgroundSize: '100% 95%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 1px #B22222)',
          }}
        >
          Olympia Horror Book Club
        </h2>
      </div>

      {/* Main Content */}
      <div className="mt-8">
        <main className="relative z-10 max-w-4xl mx-auto px-4">
          {/* Welcome Section */}
          <WelcomeSection scrollToJoinSection={scrollToJoinSection} />

          {/* Quiz Advertisement */}
          <QuizAdvertisement />

          <section className="grid-container min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <MeetingDetails />
          <CurrentBook />
        </section>

          {/* Countdown Timer Section */}
          {nextEventDate && (
            <CountdownTimer
              targetDate={nextEventDate}
              eventTitle={nextEventTitle}
              eventLocation={nextEventLocation}
            />
          )}

          {/* Upcoming Events Calendar */}
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-pink-500">Upcoming Events</h2>
            <Calendar />
          </section>

          {/* Join Us Section */}
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

        {/* Back to Top Button */}
        <BackToTop />

        {/* Footer */}
        <footer className="relative z-10 mt-12 text-center text-sm pb-8">
          <p>&copy; 2024 Spooky Spooky Book Club. All rights reserved.</p>
          <a href="/quiz" className="text-pink-500 hover:underline">Take our Quiz</a>
        </footer>

        {/* Floating Eldritch Symbols */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-500/20 animate-float"
              style={{
                fontSize: `${Math.random() * 14 + 8}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 15 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {['◯', '◭', '△', '▽', '◬', '⛦', '⛥'][Math.floor(Math.random() * 7)]}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm} />
      )}
    </div>
  );
}

export default MainPage;
