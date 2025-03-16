import React, { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaTimes, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';

const CalendarPopup = ({ isOpen, onClose, doctorName, doctorFees }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentView, setCurrentView] = useState('calendar'); // 'calendar', 'times', 'confirmation'

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', isCurrentMonth: false, date: null });
    }
    
    // Add days of the current month
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

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    let startHour = 9; // 9 AM
    let endHour = 17; // 5 PM
    
    // Check if it's Wednesday (adjust hours)
    if (selectedDate && selectedDate.getDay() === 3) { // Wednesday is day 3
      startHour = 10; // 10 AM
      endHour = 18; // 6 PM
    }
    
    // Check if it's Friday (adjust hours)
    if (selectedDate && selectedDate.getDay() === 5) { // Friday is day 5
      endHour = 16; // 4 PM
    }
    
    // Generate 30-minute slots
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

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Select a date
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentView('times');
  };

  // Select a time
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentView('confirmation');
  };

  // Go back to calendar view
  const backToCalendar = () => {
    setCurrentView('calendar');
  };

  // Go back to time selection
  const backToTimes = () => {
    setCurrentView('times');
  };

  // Confirm appointment
  const confirmAppointment = () => {
    // Here you would typically send the appointment data to your backend
    console.log('Confirmed appointment:', {
      doctor: doctorName,
      date: selectedDate,
      time: selectedTime,
      fees: doctorFees
    });
    
    // Close the popup and reset state
    onClose();
    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentView('calendar');
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Effect to reset view when popup opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset to calendar view when popup closes
      setTimeout(() => {
        setCurrentView('calendar');
        setSelectedDate(null);
        setSelectedTime(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition duration-200"
        >
          <FaTimes className="text-gray-500" />
        </button>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <FaCalendar className="mr-2" />
            {currentView === 'calendar' && 'Schedule Appointment'}
            {currentView === 'times' && 'Select Time'}
            {currentView === 'confirmation' && 'Confirm Appointment'}
          </h2>
          <p className="mt-1 opacity-90">{doctorName || 'Dr. Sarah Wilson'}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
          {currentView === 'calendar' && (
            <>
              {/* Month Navigation */}
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
              
              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
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
                {generateTimeSlots().map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-center hover:bg-blue-50 hover:border-blue-300 transition duration-200"
                  >
                    <div className="flex items-center justify-center">
                      <FaClock className="mr-2 text-blue-500" />
                      {time}
                    </div>
                  </button>
                ))}
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
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Appointment Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaCalendar className="text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(selectedDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaClock className="text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaCheck className="text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Consultation Fee</p>
                        <p className="font-medium">${doctorFees || 150}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Information</h3>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <textarea 
                      placeholder="Add a note (optional)" 
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <button
                onClick={confirmAppointment}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:translate-y-[-4px] active:translate-y-0 transition-all duration-500 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6"
              >
                <FaCheck className="h-5 w-5" />
                Confirm Appointment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPopup;