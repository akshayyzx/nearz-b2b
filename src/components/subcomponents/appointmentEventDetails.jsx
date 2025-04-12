import React from 'react';
import moment from 'moment';

const AppointmentPopup = ({ position, onClose, event, onStatusChange }) => {
  const statuses = ['booked', 'cancelled', 'pending', 'completed', 'noshow'];

  if (!event) return null;

  const handleStatusChange = (e) => {
    onStatusChange(e.target.value);
  };

  const formatTime = (date) => {
    return moment(date).format('hh:mm A');
  };

  const formatDate = (date) => {
    return moment(date).format('MMMM DD, YYYY');
  };

  // Calculate services from original data or from event title if needed
  const services = event.originalData?.salon_services || 
    event.title.split(' - ')[1]?.split(', ') || [];

  return (
    <div
      className="appointment-popup bg-white shadow-lg rounded-lg p-4 absolute z-50"
      style={{
        left: `${position.x}px`, 
        top: `${position.y - 80}px`, // Adjust top positioning here
        maxWidth: '350px',
        minWidth: '300px',
        border: '1px solid #e5e7eb',
        transform: 'translate(-50%, 0)', // Make sure it's centered horizontally
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex">
          <span className="text-gray-600 font-medium w-24">Client:</span>
          <span className="text-gray-800 flex-1">{event.user}</span>
        </div>

        <div className="flex">
          <span className="text-gray-600 font-medium w-24">Date:</span>
          <span className="text-gray-800 flex-1">{formatDate(event.start)}</span>
        </div>

        <div className="flex">
          <span className="text-gray-600 font-medium w-24">Time:</span>
          <span className="text-gray-800 flex-1">{formatTime(event.start)} - {formatTime(event.end)}</span>
        </div>

        <div>
          <span className="text-gray-600 font-medium block mb-1">Services:</span>
          <div className="ml-2 mt-1">
            {typeof services === 'string' ? (
              <span className="text-gray-800">{services}</span>
            ) : (
              <ul className="list-disc list-inside text-gray-800">
                {Array.isArray(services) ? (
                  services.map((service, index) => (
                    <li key={index} className="text-sm py-1">
                      {typeof service === 'object' ? service.service_name : service}
                    </li>
                  ))
                ) : (
                  <li className="text-sm">{services}</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {event.amount && (
          <div className="flex">
            <span className="text-gray-600 font-medium w-24">Amount:</span>
            <span className="text-gray-800 font-medium flex-1">${event.amount}</span>
          </div>
        )}

        {event.comment && (
          <div>
            <span className="text-gray-600 font-medium block mb-1">Comments:</span>
            <p className="text-sm mt-1 text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">{event.comment}</p>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-gray-100">
          <label className="text-gray-600 font-medium block mb-2">Status:</label>
          <select
            value={event.status || ''}
            onChange={handleStatusChange}
            className="w-full p-2 border border-gray-300 rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPopup;
    