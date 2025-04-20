import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendar, FaClock, FaTimes, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const CalendarPopup = ({ isOpen, onClose, doctorName, doctorFees, doctorId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentView, setCurrentView] = useState('calendar'); // 'calendar', 'times', 'confirmation', 'success'
  const [showConfetti, setShowConfetti] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const { id } = useParams();

  const fetchBookedSlots = async (date) => {
    if (!date) return;
    const dateStr = date.toLocaleDateString('en-CA');
    try {
      const res = await axios.get(
        `http://localhost:5000/api/appointment/doctor/${doctorId || id}/availability`,
        { params: { date: dateStr }, withCredentials: true }
      );
      setBookedSlots(res.data.bookedTimes);
    } catch (err) {
      console.error('Error fetching booked slots:', err);
      setBookedSlots([]);
    }
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isPastTimeSlot = (timeStr, date) => {
    if (!isSameDay(date, new Date())) return false;
    const [timePart, period] = timeStr.split(' ');
    const [hrs, mins] = timePart.split(':');
    let hours = parseInt(hrs, 10);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const slotTime = new Date();
    slotTime.setHours(hours, parseInt(mins, 10), 0, 0);
    return slotTime < new Date();
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', isCurrentMonth: false, date: null });
    }
    const today = new Date();
    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(year, month, i);
      days.push({ 
        day: i, 
        isCurrentMonth: true, 
        date, 
        isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
        isPast: date < new Date(today.setHours(0, 0, 0, 0))
      });
    }
    return days;
  };

  const generateTimeSlots = () => {
    const slots = [];
    let startHour = 9;
    let endHour = 17;
    if (selectedDate && selectedDate.getDay() === 3) { 
      startHour = 10;
      endHour = 18;
    }
    if (selectedDate && selectedDate.getDay() === 5) { 
      endHour = 16;
    }
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const displayMinutes = minutes === 0 ? '00' : minutes;
        slots.push(`${displayHour}:${displayMinutes} ${ampm}`);
      }
    }
    return slots;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (date) => {
    fetchBookedSlots(date);
    setSelectedDate(date);
    setCurrentView('times');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentView('confirmation');
  };

  const backToCalendar = () => {
    setCurrentView('calendar');
  };

  const backToTimes = () => {
    setCurrentView('times');
  };

  const confirmAppointment = async () => {
    const dateStr = selectedDate.toLocaleDateString('en-CA');
    try {
      const checkRes = await axios.get(
        `http://localhost:5000/api/appointment/doctor/${doctorId || id}/availability-check`,
        {
          params: { date: dateStr, time: selectedTime },
          withCredentials: true
        }
      );
      if (!checkRes.data.available) {
        alert('The selected time is no longer available. Please choose another time.');
        return;
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking availability. Please try again.');
      return;
    }

    const appointmentData = {
      user: localStorage.getItem('userId'),
      doctor: doctorId || id,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime
    };

    try {
      const response = await axios.post('http://localhost:5000/api/appointment/book', appointmentData, { withCredentials: true });
      console.log('Appointment booked:', response.data);
      showCelebration();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment. Please try again.');
    }
  };

  const showCelebration = () => {
    setShowConfetti(true);
    setCurrentView('success');
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        setShowConfetti(false);
        setSelectedDate(null);
        setSelectedTime(null);
        setCurrentView('calendar');
      }, 300);
    }, 4000);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentView('calendar');
        setSelectedDate(null);
        setSelectedTime(null);
        setShowConfetti(false);
      }, 1000);
    }
  }, [isOpen]);

  const ConfettiAnimation = () => {
    return (
      <div className="confetti-container">
        {Array(50).fill().map((_, i) => (
          <div 
            key={i} 
            className={`confetti confetti-${i % 5}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'][i % 16]
            }}
          ></div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes bottle-pop {
          0% { transform: translateY(20px) rotate(-20deg); }
          30% { transform: translateY(-10px) rotate(5deg); }
          60% { transform: translateY(-5px) rotate(-5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        @keyframes bubble-rise {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-120px) scale(0); opacity: 0; }
        }
        @keyframes success-bounce {
          0%,20%,50%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 20px;
          opacity: 0.8;
          animation: confetti-fall 3s linear forwards;
        }
        .champagne-container {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          pointer-events: none;
        }
        .bottle {
          position: relative;
          margin: 0 auto;
          z-index: 1;
          animation: bottle-pop 1s ease-out;
        }
        .bottle-body {
          width: 20px;
          height: 50px;
          background: linear-gradient(to right, #43a047, #2e7d32);
          border-radius: 5px;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .bottle-top {
          width: 10px;
          height: 15px;
          background: #ffcc80;
          border-radius: 2px;
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
        }
        .bubble {
          position: absolute;
          bottom: 60px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: bubble-rise 2s linear infinite;
        }
        .success-icon {
          animation: success-bounce 1.5s ease;
        }
      `}</style>
      
      <div
        className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {showConfetti && <ConfettiAnimation />}
        {currentView !== 'success' && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 transition duration-200"
          >
            <FaTimes className="text-gray-500" />
          </button>
        )}
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <FaCalendar className="mr-2" />
            {currentView === 'calendar' && 'Schedule Appointment'}
            {currentView === 'times' && 'Select Time'}
            {currentView === 'confirmation' && 'Confirm Appointment'}
            {currentView === 'success' && 'Appointment Confirmed!'}
          </h2>
          <p className="mt-1 opacity-90">{doctorName || 'Doctor'}</p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
          {currentView === 'calendar' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={prevMonth}
                  className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
                >
                  <FaChevronLeft className="text-gray-500" />
                </button>
                <h3 className="text-lg font-bold">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button 
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
                >
                  <FaChevronRight className="text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <div 
                    key={index}
                    onClick={() => day.isCurrentMonth && !day.isPast && handleDateSelect(day.date)}
                    className={`
                      h-12 flex items-center justify-center rounded-full cursor-pointer text-sm font-medium
                      ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                      ${day.isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${day.isToday ? 'border border-blue-500 text-blue-500' : ''}
                      ${day.isCurrentMonth && !day.isPast ? 'hover:bg-blue-50' : ''}
                    `}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </>
          )}
          
          {currentView === 'times' && (
            <>
              <button 
                onClick={backToCalendar}
                className="flex items-center text-blue-600 font-medium mb-4"
              >
                <FaChevronLeft className="mr-1" /> Back to Calendar
              </button>
              
              <h3 className="text-lg font-bold mb-4">
                {formatDate(selectedDate)}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {generateTimeSlots().map((time, index) => {
                  const isBooked = bookedSlots.includes(time);
                  const isPast = selectedDate && isSameDay(selectedDate, new Date()) && isPastTimeSlot(time, selectedDate);
                  return (
                    <button
                      key={index}
                      disabled={isBooked || isPast}
                      onClick={() => !(isBooked || isPast) && handleTimeSelect(time)}
                      className={`px-4 py-3 border border-gray-200 rounded-lg text-center transition duration-200 ${
                        isBooked || isPast
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <FaClock className={`mr-2 ${isBooked || isPast ? 'text-gray-400' : 'text-blue-500'}`} />
                        {time}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          
          {currentView === 'confirmation' && (
            <>
              <button 
                onClick={backToTimes}
                className="flex items-center text-blue-600 font-medium mb-4"
              >
                <FaChevronLeft className="mr-1" /> Back to Time Selection
              </button>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-bold mb-2">Appointment Details</h3>
                <div className="flex items-center mb-2">
                  <FaCalendar className="text-blue-600 mr-2" />
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaClock className="text-blue-600 mr-2" />
                  <span>{selectedTime}</span>
                </div>
                <div className="font-medium mt-2">
                  Consultation Fee: ${doctorFees || '150'}
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={confirmAppointment}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                >
                  <FaCheck className="mr-2" />
                  Confirm Appointment
                </button>
              </div>
            </>
          )}
          
          {currentView === 'success' && (
            <div className="text-center py-6">
              <div className="success-icon text-green-500 mx-auto mb-4">
                <FaCheck className="text-5xl mx-auto bg-green-100 p-3 rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-2">Booking Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your appointment has been confirmed for:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4 inline-block">
                <div className="font-medium mb-1">{formatDate(selectedDate)}</div>
                <div className="font-medium">{selectedTime}</div>
              </div>
              <p className="text-gray-600 mt-4">
                An email has been sent.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPopup;