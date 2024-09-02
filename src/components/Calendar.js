import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calendar.css';

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

    // Fetch events from the API when the component mounts
    useEffect(() => {
        axios.get('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/getUpcomingEvents')
            .then(response => {
                const fetchedEvents = response.data.map(event => ({
                    date: new Date(`${event.event_date}T00:00:00`), // Parse date correctly
                    title: event.title,
                    description: event.description,
                    time: convertToCivilianTime(event.event_time),
                    location: event.location
                }));
                setEvents(fetchedEvents);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
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
            const eventForDay = events.find(event => event.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]);
            
            calendarDays.push(
                <div 
                    key={day} 
                    className={`calendar-day ${eventForDay ? 'event-day' : ''}`} 
                    style={{ position: 'relative' }}
                    onClick={() => eventForDay && setSelectedEvent(eventForDay)}
                >
                    {day}
                    {eventForDay && (
                        <div className="event-dot" />
                    )}
                </div>
            );
        }
    
        return calendarDays;
    };

    const closeModal = () => setSelectedEvent(null);

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>Previous</button>
                <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
                <button onClick={handleNextMonth}>Next</button>
            </div>
            <div className="weekday-labels">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <div key={index} className="weekday-label">{day}</div>
                ))}
            </div>
            <div className="calendar-grid">
                {renderCalendarDays()}
            </div>
            
            {selectedEvent && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedEvent.title}</h3>
                        <p><strong>Time:</strong> {selectedEvent.time}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p>{selectedEvent.description}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
