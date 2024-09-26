// ./components/ui/CountdownTimer.js
import React, { useState, useEffect } from 'react';

const calculateTimeLeft = (targetDate) => {
  const now = new Date();
  const difference = targetDate - now;
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      Minutes: Math.floor((difference / 1000 / 60) % 60),
      Seconds: Math.floor((difference / 1000) % 60),
    };
  } else {
    timeLeft = null; // Event has passed
  }

  return timeLeft;
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    // Update the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Cleanup the timer
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <p className="text-center text-pink-500 font-bold">The event has started!</p>;
  }

  return (
    <section className="relative mb-12 text-center p-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Cosmic horror overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-900/10 to-purple-900/20"></div>
        <div className="absolute inset-0 animate-subtle-stars"></div>
        <div className="absolute inset-0 animate-ethereal-tendrils"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-pink-500 mb-6">Next Meeting Starts In:</h3>
        <div className="flex justify-center space-x-6">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="text-4xl font-semibold">{value}</div>
              <div className="text-sm uppercase">{unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating symbols */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-500/20 animate-float"
            style={{
              fontSize: `${Math.random() * 14 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {['◯', '◭', '△', '▽', '◬', '⬟', '⬢', '⯃', '⯂'][Math.floor(Math.random() * 9)]}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CountdownTimer;
