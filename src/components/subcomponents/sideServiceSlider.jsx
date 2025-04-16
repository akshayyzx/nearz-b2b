// Sidebar.jsx
import React, { useState } from 'react';
import moment from 'moment';
import FetchSalonService from './FetchSalonServices';

const Sidebar = ({ isOpen, onClose, selectedSlot, addEvent, updateEvent, deleteEvent }) => {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'service'
  
  // Enhanced addEvent handler to pass to FetchSalonService
  const handleAddServiceEvent = (title, start, end, metadata) => {
    addEvent(title, start, end, metadata);
  };
  
  return (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transition-all z-10 border-l border-gray-200 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">
          {selectedSlot?.isEvent ? 'Edit Event' : 'Add Event'}
        </h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
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
            <>
              {/* Tabs for switching between manual event and service appointment */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'manual' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('manual')}
                >
                  Manual Event
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'service' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('service')}
                >
                  Salon Service
                </button>
              </div>
              
              {activeTab === 'manual' ? (
                <SidebarForm 
                  selectedSlot={selectedSlot} 
                  addEvent={addEvent} 
                  onClose={onClose}
                />
              ) : (
                <FetchSalonService 
                  addEvent={handleAddServiceEvent} 
                  selectedSlot={selectedSlot} 
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const SidebarForm = ({ selectedSlot, addEvent, onClose }) => {
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const start = selectedSlot.start;
    const end = selectedSlot.end || new Date(start.getTime() + 60 * 60 * 1000); // Default to 1 hour
    addEvent(title, start, end);
    setTitle(''); // Reset form after submission
    onClose(); // Close sidebar after adding event
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter event title"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Time
        </label>
        <p className="text-sm text-gray-600">
          {moment(selectedSlot.start).format('MMMM D, YYYY h:mm a')}
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Time
        </label>
        <p className="text-sm text-gray-600">
          {moment(selectedSlot.end || new Date(selectedSlot.start.getTime() + 60 * 60 * 1000)).format('MMMM D, YYYY h:mm a')}
        </p>
      </div>
     
      <button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Add Event
      </button>
    </form>
  );
};

const EventDetails = ({ event, updateEvent, deleteEvent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  
  const handleUpdate = () => {
    updateEvent(event.id, title);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    deleteEvent(event.id);
  };
  
  // Check if this is a service appointment
  const isServiceAppointment = event.metadata && event.metadata.serviceId;
  
  return (
    <div>
      {isEditing ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <div className="flex gap-2">
            <button 
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded flex-1"
            >
              Save
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-medium text-gray-700">{event.title}</p>
          <p className="text-sm text-gray-600">
            {moment(event.start).format('MMMM D, YYYY h:mm a')} - {moment(event.end).format('h:mm a')}
          </p>
          
          {/* Display service-specific information if available */}
          {isServiceAppointment && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Appointment Details</h3>
              
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Customer:</span> {event.metadata.customerName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Service:</span> {event.metadata.serviceName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Category:</span> {event.metadata.category}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Price:</span> ₹{event.metadata.price}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Duration:</span> {event.metadata.duration} min
                </p>
                <p className="text-sm">
                  <span className="font-medium">Gender:</span> {event.metadata.gender}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
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