// Sidebar.jsx
import React, { useState } from 'react';
import moment from 'moment';
import FetchSalonService from './FetchSalonServices'

const Sidebar = ({ isOpen, onClose, selectedSlot, addEvent, updateEvent, deleteEvent }) => {
  return (
    <div className={`fixed right-0 top-0 h-full w-64 bg-white shadow-lg p-4 transition-all z-10 border-l border-gray-200 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center mb-4">
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
        <div className="space-y-4">
          {selectedSlot.isEvent ? (
            <EventDetails 
              event={selectedSlot} 
              updateEvent={updateEvent} 
              deleteEvent={deleteEvent} 
            />
          ) : (
            <SidebarForm 
              selectedSlot={selectedSlot} 
              addEvent={addEvent} 
            />
          )}
        </div>
      )}
    </div>
  );
};

const SidebarForm = ({ selectedSlot, addEvent }) => {
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent(title);
    setTitle(''); // Reset form after submission
  };
  
  return (
    <>
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
     <FetchSalonService/>
     </>
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
          <p className="font-medium text-gray-700">Title: {event.title}</p>
          <p className="text-sm text-gray-600">
            Start: {moment(event.start).format('MMMM D, YYYY h:mm a')}
          </p>
          <p className="text-sm text-gray-600">
            End: {moment(event.end).format('MMMM D, YYYY h:mm a')}
          </p>
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