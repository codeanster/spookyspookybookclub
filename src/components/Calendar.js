// Calendar.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calendar.css';
import { saveAs } from 'file-saver';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Helper function to convert military time to civilian time
  const convertToCivilianTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const isPM = hourNum >= 12;
    const civilianHour = hourNum % 12 || 12;
    const period = isPM ? 'PM' : 'AM';
    return `${civilianHour}:${minute} ${period}`;
  };

  // Helper function to format date to YYYYMMDDTHHmmssZ
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  // Fetch events from the API when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          'https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/getUpcomingEvents'
        );
        const fetchedEvents = response.data.map((event) => {
          let startDateTime = null;
          let endDateTime = null;

          if (event.event_date && event.event_time) {
            // Correct UTC date parsing to avoid timezone issues
            const [year, month, day] = event.event_date.split('-').map(Number);
            const [hour, minute] = event.event_time.split(':').map(Number);
            startDateTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
            if (!isNaN(startDateTime)) {
              // Adds 2 hours without timezone shifting
              endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
              if (isNaN(endDateTime)) {
                console.error('Invalid endDateTime for event:', event);
                endDateTime = null;
              }
            } else {
              console.error('Invalid startDateTime for event:', event);
            }
          } else {
            console.error('Missing event_date or event_time for event:', event);
          }

          return {
            date: startDateTime,
            title: event.title || 'No Title',
            description: event.description || 'No Description',
            time: event.event_time ? convertToCivilianTime(event.event_time) : 'No Time',
            location: event.location || 'No Location',
            startDateTime,
            endDateTime,
          };
        });

        const validEvents = fetchedEvents.filter(
          (event) => event.startDateTime && event.endDateTime
        );
        setEvents(validEvents);
        console.log('Fetched Valid Events:', validEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="empty-day" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      if (isNaN(date)) {
        console.error('Invalid date in calendar:', date);
        continue; // Skip invalid dates
      }

      const formattedDate = date.toISOString().split('T')[0];
      const eventForDay = events.find((event) => {
        if (!event.date || isNaN(event.date)) return false;
        return event.date.toISOString().split('T')[0] === formattedDate;
      });

      calendarDays.push(
        <div
          key={day}
          className={`calendar-day ${eventForDay ? 'event-day' : ''}`}
          style={{ position: 'relative' }}
          onClick={() => eventForDay && setSelectedEvent(eventForDay)}
        >
          {day}
          {eventForDay && <div className="event-dot" />}
        </div>
      );
    }

    return calendarDays;
  };

  // Function to generate Google Calendar link
  const generateGoogleCalendarLink = (event) => {
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    const text = encodeURIComponent(event.title);
    const dates = `${formatDate(event.startDateTime)}/${formatDate(event.endDateTime)}`;
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    const url = `${baseUrl}&text=${text}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
    return url;
  };

  // Function to generate iCal content
  const generateICal = (event) => {
    const dtStart = formatDate(event.startDateTime);
    const dtEnd = formatDate(event.endDateTime);
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Your Product//EN
BEGIN:VEVENT
UID:${event.startDateTime.getTime()}@yourdomain.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR
    `.trim();
    return icsContent;
  };

  // Function to handle iCal download
  const downloadICal = (event) => {
    const icsContent = generateICal(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    saveAs(blob, `${event.title}.ics`);
  };

  const closeModal = () => setSelectedEvent(null);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>Previous</button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long' })}{' '}
          {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className="weekday-labels">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="weekday-label">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">{renderCalendarDays()}</div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedEvent.title}</h3>
            <p>
              <strong>Time:</strong> {selectedEvent.time}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>{selectedEvent.description}</p>

            {/* Add to Calendar Buttons */}
            <div className="add-to-calendar">
              <a
                href={generateGoogleCalendarLink(selectedEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="calendar-button google-calendar"
                aria-label={`Add ${selectedEvent.title} to Google Calendar`}
              >
                Add to Google Calendar
              </a>
              <button
                onClick={() => downloadICal(selectedEvent)}
                className="calendar-button ical-calendar"
                aria-label={`Add ${selectedEvent.title} to iCal or Outlook`}
              >
                Add to iCal/Outlook
              </button>
            </div>

            <button onClick={closeModal} className="close-modal-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
