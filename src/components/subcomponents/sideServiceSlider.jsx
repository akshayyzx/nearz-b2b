// Sidebar.jsx
import React, { useState } from 'react';
import moment from 'moment';
import FetchSalonService from './FetchSalonServices';

const Sidebar = ({
  isOpen,
  onClose,
  selectedSlot,
  addEvent,
  updateEvent,
  deleteEvent,
  loadEvents, // ✅ Accept loadEvents from parent
}) => {
  const handleAddServiceEvent = (title, start, end, metadata) => {
    addEvent(title, start, end, metadata);
    loadEvents(); // ✅ Call parent-provided loadEvents after adding
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

const EventDetails = ({ event, updateEvent, deleteEvent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState(event.title);

  const handleUpdate = () => {
    updateEvent(event.id, title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteEvent(event.id);
  };

  const isServiceAppointment = event.metadata && event.metadata.serviceId;

  return (
    <div className="text-gray-800">
      {isEditing ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-[#F25435]/50 focus:border-[#F25435]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-[#F25435] hover:bg-[#DD4F2E] text-white px-4 py-2 rounded flex-1"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-medium text-lg text-[#023E8A] mb-1">{event.title}</p>
          <p className="text-sm text-gray-600 mb-3">
            {moment(event.start).format('MMMM D, YYYY h:mm a')} - {moment(event.end).format('h:mm a')}
          </p>

          {isServiceAppointment && (
            <div className="mt-3 p-4 bg-gradient-to-r from-[#023E8A]/5 to-[#023E8A]/10 rounded-lg border border-[#023E8A]/20">
              <h3 className="font-medium text-[#023E8A] mb-2">Appointment Details</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Customer:</span> {event.metadata.customerName}</p>
                <p className="text-sm"><span className="font-medium">Service:</span> {event.metadata.serviceName}</p>
                <p className="text-sm"><span className="font-medium">Category:</span> {event.metadata.category}</p>
                <p className="text-sm"><span className="font-medium">Price:</span> ₹{event.metadata.price}</p>
                <p className="text-sm"><span className="font-medium">Duration:</span> {event.metadata.duration} min</p>
                <p className="text-sm"><span className="font-medium">Gender:</span> {event.metadata.gender}</p>
              </div>

              <button
                onClick={() => setShowPopup(true)}
                className="mt-4 bg-[#F25435] hover:bg-[#DD4F2E] text-white px-4 py-2 rounded w-full transition"
              >
                View Full Details
              </button>

              {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-[90vw] max-w-3xl relative">
                    <button
                      onClick={() => setShowPopup(false)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    >
                      ✕
                    </button>
                    <h3 className="text-lg font-semibold mb-4">Full Appointment Details</h3>
                    <div className="space-y-2">
                      <p><strong>Date:</strong> {event.metadata.date}</p>
                      <p><strong>Time:</strong> {event.metadata.start_time} - {event.metadata.end_time}</p>
                      <p><strong>Amount:</strong> ₹{event.metadata.amount}</p>
                      <p><strong>Status:</strong> {event.metadata.status}</p>
                      <p><strong>Comment:</strong> {event.metadata.comment}</p>
                      <p><strong>Duration:</strong> {event.metadata.duration} mins</p>

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
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#023E8A] hover:bg-[#023E8A]/80 text-white px-4 py-2 rounded flex-1"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#F25435] hover:bg-[#DD4F2E] text-white px-4 py-2 rounded flex-1"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
