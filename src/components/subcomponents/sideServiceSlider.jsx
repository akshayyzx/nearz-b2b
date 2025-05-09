// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import FetchSalonService from './FetchSalonServices';
import { confirmAppointment, generateBill } from '../subcomponents/FetchAppointmentSlots';

const Sidebar = ({
  isOpen,
  onClose,
  selectedSlot,
  addEvent,
  updateEvent,
  deleteEvent,
  loadEvents,
}) => {
  // Add debugging for selectedSlot and track previous slot for comparison
  const [currentSlot, setCurrentSlot] = useState(null);
  const navigate = useNavigate();
  // Use effect to update currentSlot whenever selectedSlot changes
  useEffect(() => {
    if (selectedSlot) {
      console.log("Sidebar received selectedSlot:", selectedSlot);
      // Update the current slot to match the selected slot
      setCurrentSlot(selectedSlot);
    }
  }, [selectedSlot]); // Dependency array ensures this runs when selectedSlot changes

  // Reset current slot when sidebar is closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentSlot(null);
    }
  }, [isOpen]);

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
          {currentSlot?.isEvent ? 'Edit Appointment' : 'Add Appointment'}
        </h2>
        <button
          onClick={() => {
            // Reset currentSlot when closing
            setCurrentSlot(null);
            onClose();
          }}
          className="p-2 rounded-full hover:bg-[#F25435]/20 text-white"
        >
          ✕
        </button>
      </div>

      {/* Improved rendering logic with fallback message */}
      <div className="p-4">
        {!currentSlot && (
          <div className="p-4 text-gray-500 text-center">
            No appointment slot selected. Please select a time slot or appointment.
          </div>
        )}
        
        {currentSlot && currentSlot.isEvent && (
          <EventDetails
            event={currentSlot}
            updateEvent={updateEvent}
            deleteEvent={deleteEvent}
            loadEvents={loadEvents}
            onClose={() => {
              setCurrentSlot(null);
              onClose();
            }}
            navigate={navigate}
          />
        )}
        
        {currentSlot && !currentSlot.isEvent && (
          <FetchSalonService
            addEvent={handleAddServiceEvent}
            selectedSlot={currentSlot}
            onClose={() => {
              setCurrentSlot(null);
              onClose();
            }}
            loadEvents={loadEvents}
          />
        )}
      </div>
    </div>
  );
};

// EventDetails component with modified customer name extraction logic
const EventDetails = ({ event, updateEvent, deleteEvent, loadEvents, onClose, navigate }) => {
  // Always start in editing mode if we want to edit by default
  const [isEditing, setIsEditing] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState({
    success: null,
    message: ""
  });
  
  // Initialize state values from event prop
  useEffect(() => {
    if (event) {
      console.log("EventDetails received event:", event);
      setTitle(event.title || 'Untitled Appointment');
      
      // Safely access metadata
      const metadata = event.metadata || {};
      setServiceName(
        metadata.serviceName || 
        (metadata.salon_services && metadata.salon_services[0]?.service_name) || 
        'Unknown Service'
      );
      
      // Reset state for editing time with safe defaults from the event
      const startDateTime = event.start ? moment(event.start) : moment();
      const endDateTime = event.end ? moment(event.end) : moment().add(1, 'hour');
      
      setStartDate(startDateTime.format('YYYY-MM-DD'));
      setStartTime(startDateTime.format('HH:mm'));
      setEndTime(endDateTime.format('HH:mm'));
    }
  }, [event]); // This will re-run whenever a new event is provided
  
  // Safely handle event data with null checks
  const startDateTime = event?.start ? moment(event.start) : moment();
  const endDateTime = event?.end ? moment(event.end) : moment().add(1, 'hour');
  
  // New state for editing time with safe defaults
  const [startDate, setStartDate] = useState(startDateTime.format('YYYY-MM-DD'));
  const [startTime, setStartTime] = useState(startDateTime.format('HH:mm'));
  const [endTime, setEndTime] = useState(endDateTime.format('HH:mm'));
  
  // Safely access metadata with fallbacks
  const metadata = event?.metadata || {};

  // Extract customer name from comment if available
  const extractCustomerName = (comment) => {
    if (!comment) return null;
    
    // Check if the comment follows the pattern "Booked via Salon Booking App - [Name]"
    const bookingAppPattern = /Booked via Salon Booking App - (.+)/i;
    const match = comment.match(bookingAppPattern);
    
    // If it matches the pattern, return just the name part
    if (match && match[1]) {
      return match[1].trim();
    }
    
    // If no match, return the full comment as it might be just the name
    return comment;
  };
  
  // Get customer name from comment or fallback to username
  const customerName = metadata.comment ? 
    extractCustomerName(metadata.comment) : 
    (metadata.customerName || metadata.user?.username || 'N/A');

  // Check if appointment is already confirmed
  const isAppointmentConfirmed = metadata?.status === "Confirmed";

  // If event data is invalid, show an error message
  if (!event || !event.id) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        <h3 className="font-medium mb-2">Error Loading Appointment</h3>
        <p>The appointment data is missing or invalid. Please try selecting the appointment again.</p>
        <button 
          onClick={onClose}
          className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    );
  }

  const handleUpdate = () => {
    // Create new start and end dates based on the edited values
    const newStart = moment(`${startDate} ${startTime}`).toDate();
    const newEnd = moment(`${startDate} ${endTime}`).toDate();
    
    // Update the metadata with the new service name
    const updatedMetadata = {
      ...metadata,
      serviceName: serviceName,
      // Also update any fields that should reflect the service name
      salon_services: metadata?.salon_services ? 
        metadata.salon_services.map(service => ({
          ...service,
          service_name: serviceName,
          custom_name: serviceName
        })) : 
        metadata?.salon_services
    };
    
    // Call the update function with all the new values
    updateEvent(event.id, title, newStart, newEnd, updatedMetadata);
    
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
    if (!metadata || !metadata.id) {
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

      const appointmentId = metadata.id;
      console.log("Attempting to confirm appointment ID:", appointmentId);
      
      const result = await confirmAppointment(appointmentId);
      console.log("API response:", result);
      
      // Update local appointment metadata with the updated data
      const updatedMetadata = { 
        ...metadata, 
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
      updateEvent(event.id, event.title, event.start, event.end, updatedMetadata);
      
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

  const handleGenerateBill = async () => {
    if (!metadata || !metadata.id) {
      setConfirmationStatus({
        success: false,
        message: "Appointment ID not found. Cannot generate bill."
      });
      return;
    }
  
    try {
      setIsGeneratingBill(true);
      setConfirmationStatus({
        success: null,
        message: "Generating bill..."
      });
  
      const appointmentId = metadata.id;
      console.log("Attempting to generate bill for appointment ID:", appointmentId);
      
      const result = await generateBill(appointmentId);
      console.log("Generate bill API response:", result);
      
      if (result.success) {
        // Show success message
        setConfirmationStatus({
          success: true,
          message: "Bill generated and sent successfully!"
        });
      } else {
        throw new Error(result.message || "Failed to generate bill");
      }
    } catch (error) {
      console.error("Error in handleGenerateBill:", error);
      setConfirmationStatus({
        success: false,
        message: error.message || "Failed to generate bill. Please try again."
      });
    } finally {
      setIsGeneratingBill(false);
    }
  };

  const openInvoiceWindow = (ulid) => {
    navigate(`/bill/${ulid}`);
  };

  const isServiceAppointment = metadata && (metadata.serviceId || metadata.salon_services);
  
  return (
    <div className="text-gray-800">
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
            <button
              onClick={() => setShowPopup(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Full Details
            </button>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm"><span className="font-medium">Appointment ID:</span> {metadata.id || 'N/A'}</p>
            <p className="text-sm"><span className="font-medium">Date:</span> {metadata.date || startDate}</p>
            <p className="text-sm"><span className="font-medium">Time:</span> {metadata.start_time || startTime} - {metadata.end_time || endTime}</p>
            <p className="text-sm"><span className="font-medium">Customer:</span> {customerName}</p>
            <p className="text-sm"><span className="font-medium">Phone:</span> {metadata.user?.mobile || 'N/A'}</p>
            <p className="text-sm"><span className="font-medium">Service:</span> {serviceName || (metadata.salon_services && metadata.salon_services[0]?.service_name) || 'N/A'}</p>
            {/* <p className="text-sm"><span className="font-medium">Service ID:</span> {metadata.salon_services && metadata.salon_services[0]?.id || 'N/A'}</p> */}
            <p className="text-sm"><span className="font-medium">Category:</span> {metadata.category || (metadata.salon_services && metadata.salon_services[0]?.category_name) || 'N/A'}</p>
            <p className="text-sm"><span className="font-medium">Amount:</span> ₹{metadata.amount || metadata.price || 'N/A'}</p>
            {metadata.discount > 0 && (
              <p className="text-sm"><span className="font-medium">Discount:</span> ₹{metadata.discount}</p>
            )}
            {metadata.full_amount && metadata.amount && metadata.full_amount !== metadata.amount && (
              <p className="text-sm"><span className="font-medium">Full Amount:</span> ₹{metadata.full_amount}</p>
            )}
            <p className="text-sm"><span className="font-medium">Duration:</span> {metadata.duration || 'N/A'} min</p>
            {/* {metadata.comment && (
              <p className="text-sm"><span className="font-medium">Comment:</span> {metadata.comment}</p>
            )} */}
            <p className="text-sm"><span className="font-medium">Status:</span> <span className={isAppointmentConfirmed ? "font-medium text-green-600" : "font-medium text-orange-500"}>{metadata.status || (isAppointmentConfirmed ? "Confirmed" : "Pending")}</span></p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
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

        {/* Generate Bill button */}
<button 
  onClick={handleGenerateBill} 
  disabled={isGeneratingBill || !isAppointmentConfirmed} 
  className={`
    ${isGeneratingBill ? 'bg-gray-400' : !isAppointmentConfirmed ? 'bg-gray-300' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} 
    text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg 
    transform hover:-translate-y-0.5 transition-all duration-200 
    w-full flex justify-center items-center mt-3
    ${isGeneratingBill || !isAppointmentConfirmed ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}
  `}
>
  {isGeneratingBill ? (
    <span className="flex items-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Generating...
    </span>
  ) : !isAppointmentConfirmed ? (
    <span>Confirm Appointment First</span>
  ) : (
    <span className="flex items-center">
      Generate Bill
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </span>
  )}
</button>

{/* View Bill button */}
<button 
  onClick={() => openInvoiceWindow(metadata.ulid)} 
  disabled={!metadata.ulid} 
  className={`
    ${!metadata.ulid ? 'bg-gray-300' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'} 
    text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg
    transform hover:-translate-y-0.5 transition-all duration-200
    w-full flex justify-center items-center mt-3
    ${!metadata.ulid ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}
  `}
>
  {!metadata.ulid ? (
    <span>View Bill</span>
  ) : (
    <span className="flex items-center">
      View Bill
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </span>
  )}
</button>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-[40vw] max-w-2xl relative max-h-[90vh] overflow-y-auto m-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#023E8A]">Full Appointment Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="col-span-2 bg-blue-50 p-3 rounded-lg mb-2">
                    <p className="text-sm"><strong>Appointment ID:</strong> {metadata.id || 'N/A'}</p>
                    <p className="text-sm"><strong>Status:</strong> <span className={isAppointmentConfirmed ? "font-medium text-green-600" : "font-medium text-orange-500"}>{metadata.status || (isAppointmentConfirmed ? "Confirmed" : "Pending")}</span></p>
                  </div>
                  
                  <div>
                    <p className="text-sm"><strong>Date:</strong> {metadata.date || startDate}</p>
                    <p className="text-sm"><strong>Time:</strong> {metadata.start_time || startTime} - {metadata.end_time || endTime}</p>
                    <p className="text-sm"><strong>Duration:</strong> {metadata.duration || 'N/A'} mins</p>
                  </div>
                  
                  <div>
                    <p className="text-sm"><strong>Amount:</strong> ₹{metadata.amount || metadata.price || 'N/A'}</p>
                    {metadata.discount > 0 && (
                      <p className="text-sm"><strong>Discount:</strong> ₹{metadata.discount}</p>
                    )}
                    {metadata.full_amount && (
                      <p className="text-sm"><strong>Full Amount:</strong> ₹{metadata.full_amount}</p>
                    )}
                    {metadata.promo_code_discount > 0 && (
                      <p className="text-sm"><strong>Promo Discount:</strong> ₹{metadata.promo_code_discount}</p>
                    )}
                  </div>

                  <div className="col-span-2 border-t border-gray-200 pt-3 mt-2">
                    <h4 className="font-medium text-[#023E8A] mb-1">Customer Information</h4>
                    <p className="text-sm"><strong>Name:</strong> {customerName}</p>
                    <p className="text-sm"><strong>Phone:</strong> {metadata.user?.mobile || 'N/A'}</p>
                    {metadata.user?.alternative_mobile && metadata.user.alternative_mobile !== '+91' && (
                      <p className="text-sm"><strong>Alt. Phone:</strong> {metadata.user.alternative_mobile}</p>
                    )}
                    {metadata.user?.gender && (
                      <p className="text-sm"><strong>Gender:</strong> {metadata.user.gender}</p>
                    )}
                    {metadata.user?.referral_code && (
                      <p className="text-sm"><strong>Referral Code:</strong> {metadata.user.referral_code}</p>
                    )}
                  </div>

                  {metadata.comment && (
                    <div className="col-span-2 bg-yellow-50 p-3 rounded-lg mt-2">
                      <p className="text-sm"><strong>Comment:</strong> {metadata.comment}</p>
                    </div>
                  )}

                  {metadata.salon && (
                    <div className="col-span-2 border-t border-gray-200 pt-3 mt-2">
                      <h4 className="font-medium text-[#023E8A] mb-1">Salon Info</h4>
                      <p className="text-sm"><strong>Name:</strong> {metadata.salon.name || 'N/A'}</p>
                      <p className="text-sm"><strong>Address:</strong> {metadata.salon.full_address || 'N/A'}</p>
                      <p className="text-sm"><strong>Type:</strong> {metadata.salon.salon_type || 'N/A'}</p>
                      <p className="text-sm"><strong>Seats:</strong> {metadata.salon.seats || 'N/A'}</p>
                      <p className="text-sm"><strong>Contact No:</strong> {metadata.salon.user?.mobile || 'N/A'}</p>
                    </div>
                  )}

                  {metadata.salon_services?.length > 0 && (
                    <div className="col-span-2 border-t border-gray-200 pt-3 mt-2">
                      <h4 className="font-medium text-[#023E8A] mb-1">Service Details</h4>
                      {metadata.salon_services.map((service, index) => (
                        <div key={service.id || index} className="mb-3 p-2 bg-gray-50 rounded-lg">
                          <p className="text-sm"><strong>Service ID:</strong> {service.id || 'N/A'}</p>
                          <p className="text-sm"><strong>Name:</strong> {service.service_name || 'N/A'}</p>
                          {service.custom_name && service.custom_name !== service.service_name && (
                            <p className="text-sm"><strong>Custom Name:</strong> {service.custom_name}</p>
                          )}
                          <p className="text-sm"><strong>Category:</strong> {service.category_name || 'N/A'}</p>
                          <p className="text-sm"><strong>Amount:</strong> ₹{service.amount || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {metadata.gst_details && (metadata.gst_details.gst > 0 || metadata.gst_details.amount > 0) && (
                    <div className="col-span-2 border-t border-gray-200 pt-3 mt-2">
                      <h4 className="font-medium text-[#023E8A] mb-1">GST Details</h4>
                      <p className="text-sm"><strong>GST Rate:</strong> {metadata.gst_details.gst}%</p>
                      <p className="text-sm"><strong>GST Amount:</strong> ₹{metadata.gst_details.amount}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex flex-col gap-2">
                  {/* Confirm button in popup with disabled state when already confirmed */}
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
                  
                  {/* Generate Bill button in popup */}
                  <button
                    onClick={() => {
                      handleGenerateBill();
                      setShowPopup(false);
                    }}
                    disabled={isGeneratingBill || !isAppointmentConfirmed}
                    className={`${
                      isGeneratingBill 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : !isAppointmentConfirmed
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-4 py-2 rounded w-full transition`}
                  >
                    {isGeneratingBill ? 'Generating...' : !isAppointmentConfirmed ? 'Confirm Appointment First' : 'Generate Bill'}
                  </button>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-red-500 hover:bg-gray-300 text-white px-4 py-2 rounded w-full transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;