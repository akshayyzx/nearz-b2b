
import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import Sidebar from './sideServiceSlider'; 
import FetchSalonService from './FetchSalonServices'

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [eventList, setEventList] = useState([
    {
      id: 0,
      title: 'Sample Event',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      isDraggable: true
    }
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView);
  }, []);

  const handleEventDrop = useCallback(({ event, start, end }) => {
    setEventList((prevEvents) =>
      prevEvents.map((e) =>
        e.id === event.id ? { ...e, start, end } : e
      )
    );
  }, []);

  const handleEventResize = useCallback(({ event, start, end }) => {
    setEventList((prevEvents) =>
      prevEvents.map((e) =>
        e.id === event.id ? { ...e, start, end } : e
      )
    );
  }, []);

  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedSlot(slotInfo);
    setSidebarOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedSlot({ ...event, isEvent: true });
    setSidebarOpen(true);
  }, []);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const addEvent = (title) => {
    if (selectedSlot && title) {
      const newEvent = {
        id: eventList.length,
        title,
        start: selectedSlot.start,
        end: selectedSlot.end || new Date(selectedSlot.start.getTime() + 60 * 60 * 1000),
        isDraggable: true
      };
      
      setEventList([...eventList, newEvent]);
      setSidebarOpen(false);
    }
  };

  const updateEvent = (id, title) => {
    setEventList((prevEvents) =>
      prevEvents.map((e) =>
        e.id === id ? { ...e, title } : e
      )
    );
  };

  const deleteEvent = (id) => {
    setEventList((prevEvents) => prevEvents.filter((e) => e.id !== id));
    setSidebarOpen(false);
  };

  return (
    <>
    <div className="flex h-screen">
      <div className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'pr-64' : ''}`}>
        <div style={{ height: '650px', margin: '20px' }}>
          <DnDCalendar
            localizer={localizer}
            events={eventList}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            view={currentView}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            draggableAccessor={(event) => !!event.isDraggable}
            resizable
          />
        </div>
      </div>

      {/* Include the Sidebar component */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        selectedSlot={selectedSlot}
        addEvent={addEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
      />
    </div>
      {/* <FetchSalonService/> */}
      </>
  );
};

export default MyCalendar;