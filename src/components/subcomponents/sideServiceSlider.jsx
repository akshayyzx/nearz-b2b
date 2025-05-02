// Sidebar.jsx
import React, { useState } from 'react';
import moment from 'moment';
import FetchSalonService from './FetchSalonServices';
import { confirmAppointment } from '../subcomponents/FetchAppointmentSlots';

const Sidebar = ({
  isOpen,
  onClose,
  selectedSlot,
  addEvent,
  updateEvent,
  deleteEvent,
  loadEvents,
}) => {
  const handleAddServiceEvent = (title, start, end, metadata) => {
    addEvent(title, start, end, metadata);
    loadEvents();
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-170 bg-white shadow-xl transition-all duration-300 z-50 
      border-l border-gray-200 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
      overflow-y-auto rounded-l-lg`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-[#F25435] to-[#DD4F2E]">
        <h2 className="text-lg font-semibold text-white">
          {selectedSlot?.isEvent ? 'Edit Appointment' : 'Add Appointment'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[#F25435]/20 text-white"
        >
          ✕
        </button>
      </div>

      {selectedSlot && (
        <div className="p-4">
          {selectedSlot.isEvent ? (
            <EventDetails
              event={selectedSlot}
              updateEvent={updateEvent}
              deleteEvent={deleteEvent}
              loadEvents={loadEvents}
              onClose={onClose}
            />
          ) : (
            <FetchSalonService
              addEvent={handleAddServiceEvent}
              selectedSlot={selectedSlot}
              onClose={onClose}
              loadEvents={loadEvents}
            />
          )}
        </div>
      )}
    </div>
  );
};

const EventDetails = ({ event, updateEvent, deleteEvent, loadEvents, onClose }) => {
  // Always start in editing mode if we want to edit by default
  const [isEditing, setIsEditing] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState({
    success: null,
    message: ""
  });
  
  // New state for editing time
  const [startDate, setStartDate] = useState(moment(event.start).format('YYYY-MM-DD'));
  const [startTime, setStartTime] = useState(moment(event.start).format('HH:mm'));
  const [endTime, setEndTime] = useState(moment(event.end).format('HH:mm'));
  const [serviceName, setServiceName] = useState(
    event.metadata?.serviceName || event.metadata?.salon_services?.[0]?.service_name || ''
  );

  // Check if appointment is already confirmed
  const isAppointmentConfirmed = event.metadata?.status === "Confirmed";

  const handleUpdate = () => {
    // Create new start and end dates based on the edited values
    const newStart = moment(`${startDate} ${startTime}`).toDate();
    const newEnd = moment(`${startDate} ${endTime}`).toDate();
    
    // Update the metadata with the new service name
    const updatedMetadata = {
      ...event.metadata,
      serviceName: serviceName,
      // Also update any fields that should reflect the service name
      salon_services: event.metadata?.salon_services ? 
        event.metadata.salon_services.map(service => ({
          ...service,
          service_name: serviceName,
          custom_name: serviceName
        })) : 
        event.metadata?.salon_services
    };
    
    // Call the update function with all the new values
    updateEvent(event.id, title, newStart, newEnd, updatedMetadata);
    
    // We can keep editing mode on to allow for multiple edits
    // or switch to view mode with setIsEditing(false);
    
    // Show confirmation that changes were saved
    setConfirmationStatus({
      success: true,
      message: "Appointment details updated successfully!"
    });
    
    // Clear success message after a few seconds
    setTimeout(() => {
      setConfirmationStatus({
        success: null,
        message: ""
      });
    }, 3000);
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    onClose(); // Close the sidebar after deletion
  };

  const handleConfirmAppointment = async () => {
    if (!event.metadata || !event.metadata.id) {
      setConfirmationStatus({
        success: false,
        message: "Appointment ID not found. Cannot confirm appointment."
      });
      return;
    }

    try {
      setIsConfirming(true);
      setConfirmationStatus({
        success: null,
        message: "Confirming appointment..."
      });

      const appointmentId = event.metadata.id;
      console.log("Attempting to confirm appointment ID:", appointmentId);
      
      const result = await confirmAppointment(appointmentId);
      console.log("API response:", result);
      
      // Update local appointment metadata with the updated data
      const updatedMetadata = { 
        ...event.metadata, 
        status: "Confirmed",
        ...result.data // Merge in any new data from the API response
      };
      
      // Store the updated appointment in localStorage for persistence
      const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      const updatedAppointments = storedAppointments.map(app => {
        if (app.id === event.id) {
          return { ...app, metadata: updatedMetadata };
        }
        return app;
      });
      
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      // Update the event with new metadata
      updateEvent(event.id, event.title, null, null, updatedMetadata);
      
      // Show success message
      setConfirmationStatus({
        success: true,
        message: "Appointment confirmed successfully!"
      });
      
      // Refresh the events
      loadEvents();
    } catch (error) {
      console.error("Error in handleConfirmAppointment:", error);
      setConfirmationStatus({
        success: false,
        message: error.message || "Failed to confirm appointment. Please try again."
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const isServiceAppointment = event.metadata && (event.metadata.serviceId || event.metadata.salon_services);
  
  return (
    <div className="text-gray-800">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Appointment Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-[#F25435]/50 focus:border-[#F25435]"
        />
        
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Name
        </label>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-[#F25435]/50 focus:border-[#F25435]"
        />
        
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-[#F25435]/50 focus:border-[#F25435]"
        />
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F25435]/50 focus:border-[#F25435]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#F25435]/50 focus:border-[#F25435]"
            />
          </div>
        </div>
        
        <button
          onClick={handleUpdate}
          className="bg-[#F25435] hover:bg-[#DD4F2E] text-white px-4 py-2 rounded w-full mb-3"
        >
          Save Changes
        </button>
      </div>

      {/* Confirmation Status Message */}
      {confirmationStatus.message && (
        <div className={`my-3 p-3 rounded-lg ${
            confirmationStatus.success === true 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : confirmationStatus.success === false 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
          <p className="text-sm">{confirmationStatus.message}</p>
        </div>
      )}

{isServiceAppointment && (
        <div className="mt-3 p-4 bg-gradient-to-r from-[#023E8A]/5 to-[#023E8A]/10 rounded-lg border border-[#023E8A]/20">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-[#023E8A] mb-2">Appointment Details</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm"><span className="font-medium">Customer:</span> {event.metadata.customerName}</p>
            <p className="text-sm"><span className="font-medium">Service:</span> {serviceName}</p>
            <p className="text-sm"><span className="font-medium">Category:</span> {event.metadata.category}</p>
            <p className="text-sm"><span className="font-medium">Price:</span> ₹{event.metadata.price || event.metadata.amount}</p>
            <p className="text-sm"><span className="font-medium">Duration:</span> {event.metadata.duration} min</p>
            {event.metadata.gender && (
              <p className="text-sm"><span className="font-medium">Gender:</span> {event.metadata.gender}</p>
            )}
            {isAppointmentConfirmed && (
              <p className="text-sm font-medium text-green-600">Status: Confirmed</p>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => setShowPopup(true)}
              className="bg-[#023E8A] hover:bg-[#023E8A]/80 text-white px-4 py-2 rounded w-full transition"
            >
              View Full Details
            </button>
            
            {/* Confirm button with disabled state when already confirmed */}
            <button
              onClick={async () => {
                await handleConfirmAppointment();
                // Show success notification
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 font-medium py-3 px-6 rounded-lg shadow-lg z-50 border border-green-200';
                notification.textContent = 'Appointment confirmed successfully!';
                document.body.appendChild(notification);
                onClose();
                // Remove notification after 3 seconds
                setTimeout(() => {
                  notification.remove();
                  // Close sidebar after notification disappears
                }, 3000);
              }}
              disabled={isConfirming || isAppointmentConfirmed}
              className={`${
                isConfirming 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : isAppointmentConfirmed
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 py-2 rounded w-full transition flex justify-center items-center`}
            >
              {isConfirming ? (
                <span>Confirming...</span>
              ) : isAppointmentConfirmed ? (
                <span>Already Confirmed</span>
              ) : (
                <span>Confirm Appointment</span>
              )}
            </button>
          </div>

          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-[90vw] max-w-3xl relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Full Appointment Details</h3>
                </div>
                
                <div className="space-y-2">
                  <p><strong>Appointment ID:</strong> {event.metadata.id}</p>
                  <p><strong>Date:</strong> {event.metadata.date || startDate}</p>
                  <p><strong>Time:</strong> {event.metadata.start_time || startTime} - {event.metadata.end_time || endTime}</p>
                  <p><strong>Amount:</strong> ₹{event.metadata.amount || event.metadata.price}</p>
                  {event.metadata.comment && (
                    <p><strong>Comment:</strong> {event.metadata.comment}</p>
                  )}
                  <p><strong>Duration:</strong> {event.metadata.duration} mins</p>
                  {isAppointmentConfirmed && (
                    <p className="font-medium text-green-600">Status: Confirmed</p>
                  )}

                  {event.metadata.salon && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-[#023E8A] mb-1">Salon Info</h4>
                      <p><strong>Name:</strong> {event.metadata.salon.name}</p>
                      <p><strong>Address:</strong> {event.metadata.salon.full_address}</p>
                      <p><strong>Type:</strong> {event.metadata.salon.salon_type}</p>
                      <p><strong>Seats:</strong> {event.metadata.salon.seats}</p>
                      <p><strong>Contact No:</strong> {event.metadata.salon.user?.mobile}</p>
                    </div>
                  )}

                  {event.metadata.salon_services?.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-[#023E8A] mb-1">Service Info</h4>
                      {event.metadata.salon_services.map(service => (
                        <div key={service.id} className="mb-2">
                          <p><strong>Name:</strong> {service.service_name}</p>
                          <p><strong>Custom Name:</strong> {service.custom_name}</p>
                          <p><strong>Category:</strong> {service.category_name}</p>
                          <p><strong>Amount:</strong> ₹{service.amount}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Updated confirm button in popup with disabled state when already confirmed */}
                <div className="mt-4">
                  <button
                    onClick={async () => {
                      await handleConfirmAppointment();
                      // Close popup
                      setShowPopup(false);
                      
                      // Show success notification
                      const notification = document.createElement('div');
                      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 font-medium py-3 px-6 rounded-lg shadow-lg z-50 border border-green-200';
                      notification.textContent = 'Appointment confirmed successfully!';
                      document.body.appendChild(notification);
                      
                      // Remove notification after 3 seconds
                      setTimeout(() => {
                        notification.remove();
                        // Close sidebar after notification disappears
                        onClose();
                      }, 3000);
                    }}
                    disabled={isConfirming || isAppointmentConfirmed}
                    className={`${
                      isConfirming 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : isAppointmentConfirmed
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                    } text-white px-4 py-2 rounded w-full transition`}
                  >
                    {isConfirming ? 'Confirming...' : isAppointmentConfirmed ? 'Already Confirmed' : 'Confirm Appointment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleDelete}
          className="bg-[#F25435] hover:bg-[#DD4F2E] text-white px-4 py-2 rounded w-full"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Sidebar