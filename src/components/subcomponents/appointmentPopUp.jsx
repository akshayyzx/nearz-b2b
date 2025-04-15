import React, { useState } from 'react';
import ServiceSidebar from './SideServiceSlider'; 

const AppointmentPopup = ({ position, onClose, timeSlot, onSelectService }) => {
  const [showServiceSidebar, setShowServiceSidebar] = useState(false);

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  const handleAddAppointmentClick = () => {
    console.log("Add appointment clicked");
    setShowServiceSidebar(true);
  };

  return (
    <>
      {/* Appointment Popup */}
      <div 
        className="appointment-popup absolute bg-white border border-gray-200 rounded-lg shadow-md z-50 w-64"
        style={{
          top: position.y,
          left: position.x,
        }}
        onClick={handlePopupClick}
      >
        {/* Header with time and close button */}
        <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-200 font-semibold flex justify-between items-center">
          <span>{formatTime(timeSlot)}</span>
          <button 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close popup"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <div className="py-2">
          <div 
            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
            onClick={handleAddAppointmentClick}
          >
            <div className="mr-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>Add appointment</div>
          </div>
        </div>
      </div>

      {/* Conditionally render ServiceSidebar */}
      {showServiceSidebar && (
        <ServiceSidebar
          isOpen={true}
          onClose={onClose}
          timeSlot={timeSlot}
          onSelectService={onSelectService} // 🔥 now correctly passed
        />
      )}
    </>
  );
};

export default AppointmentPopup;
