import React, { useState, useCallback, useEffect, useRef } from 'react'; 
import { Calendar, momentLocalizer } from 'react-big-calendar'; 
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'; 
import moment from 'moment'; 
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'; 
import CustomToolbar from './CustomToolbar'; 
import eventsData from '../../utils/eventData'; 
import AppointmentPopup from './appointmentPopUp'; 
import EventDetails from "./appointmentEventDetails"; 
import '../styles/calendar.css';

const localizer = momentLocalizer(moment); 
const DnDCalendar = withDragAndDrop(Calendar);

const statusColorMap = { 
  booked: '#4ade80', 
  cancelled: '#f87171', 
  pending: '#facc15', 
  completed: '#60a5fa', 
  noshow: '#9AA6B2'
};

const MyCalendar = () => { 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [currentView, setCurrentView] = useState('month'); 
  const [eventList, setEventList] = useState([]); 
  const [showPopup, setShowPopup] = useState(false); 
  const [showEventDetails, setShowEventDetails] = useState(false); 
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); 
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const calendarRef = useRef(null);

  useEffect(() => {
    // Reset UI state
    setShowPopup(false);
    setShowEventDetails(false);
    
    if (!eventsData || !Array.isArray(eventsData)) {
      console.error("eventsData is not an array or is undefined");
      return;
    }
  
    try {
      const formattedEvents = eventsData.map(event => {
        // Safely access properties
        if (!event.date || !event.start_time || !event.end_time) {
          console.warn(`Event ${event.id} has missing date or time data`, event);
          return null;
        }
        
        const start = moment(`${event.date} ${event.start_time}`, 'YYYY-MM-DD hh:mm a').toDate();
        const end = moment(`${event.date} ${event.end_time}`, 'YYYY-MM-DD hh:mm a').toDate();
        
        if (!moment(start).isValid() || !moment(end).isValid()) {
          console.warn(`Event ${event.id} has invalid date format`, event);
          return null;
        }
  
        return {
          id: event.id,
          title: `${event.user?.username || 'Unknown'} - ${
            Array.isArray(event.salon_services) 
              ? event.salon_services.map(service => service.service_name).join(', ')
              : 'No services'
          }`,
          start,
          end,
          amount: event.amount,
          status: (event.status || '').toLowerCase(),
          user: event.user?.username || 'Unknown',
          isDraggable: true,
          comment: event.comment,
          originalData: event
        };
      }).filter(Boolean); // Remove null entries
      
      setEventList(formattedEvents);
    } catch (error) {
      console.error("Error formatting events:", error);
      setEventList([]);
    }
  }, []);
   
  const handleNavigate = useCallback((newDate) => { 
    setCurrentDate(newDate); 
  }, []); 

  const handleViewChange = useCallback((newView) => { 
    setCurrentView(newView); 
    setShowPopup(false); 
    setShowEventDetails(false); 
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

  const handleEventClick = useCallback((event, e) => { 
    let x, y; 
    if (e) { 
      x = e.clientX; 
      y = e.clientY; 
    } else if (calendarRef.current) { 
      const rect = calendarRef.current.getBoundingClientRect(); 
      x = rect.left + 100; 
      y = rect.top + 100; 
    } else { 
      x = window.innerWidth / 2; 
      y = window.innerHeight / 3; 
    }

    setPopupPosition({ x, y }); 
    setSelectedEvent(event); 
    setShowEventDetails(true); // Show EventDetails when an event is clicked
    setShowPopup(false); // Hide AppointmentPopup
  }, []); 

  const handleCalendarClick = useCallback((e) => {
    // Ensure we're not clicking on an event
    if (e.target.closest('.rbc-event')) {
      return;
    }
    
    // Guard against synthetic events or events without coordinates
    if (!e || typeof e.clientX !== 'number' || typeof e.clientY !== 'number') {
      return;
    }
    
    // Guard against 0,0 triggers which might be browser artifacts
    if (e.clientX === 0 && e.clientY === 0) {
      return;
    }
  
    setPopupPosition({ x: e.clientX, y: e.clientY });
    setShowPopup(true);
    setSelectedEvent(null);
    setShowEventDetails(false);
  }, []);
  
  const handleSelectSlot = useCallback((slotInfo) => {
    if (slotInfo.action !== "select") return;
    
    // Access the original browser event
    const e = slotInfo.box || window.event;
    
    // Guard against events without coordinates
    if (!e || typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;
    
    // Guard against 0,0 triggers
    if (e.clientX === 0 && e.clientY === 0) return;
    
    setPopupPosition({ x: e.clientX, y: e.clientY });
    setShowPopup(true);
    setSelectedEvent(null);
    setShowEventDetails(false);
  }, []);

  const handleStatusChange = useCallback((newStatus) => { 
    if (!selectedEvent) return;

    const updatedEvent = { 
      ...selectedEvent, 
      status: newStatus,
      originalData: {
        ...selectedEvent.originalData,
        status: newStatus
      }
    };

    setEventList(prevEvents =>
      prevEvents.map(event =>
        event.id === selectedEvent.id ? updatedEvent : event
      )
    );
    
    setSelectedEvent(updatedEvent); 
  }, [selectedEvent]);

  const handleAddService = useCallback((service) => { 
    if (!selectedEvent) return;

    // Create a deep copy to avoid mutation issues
    const updatedOriginalData = { 
      ...selectedEvent.originalData,
      salon_services: [
        ...(Array.isArray(selectedEvent.originalData.salon_services) 
          ? selectedEvent.originalData.salon_services 
          : []),
        service
      ]
    };

    // Update both the display title and the original data
    const serviceNames = updatedOriginalData.salon_services
      .map(s => s.service_name)
      .join(', ');
      
    const updatedEvent = { 
      ...selectedEvent,
      title: `${selectedEvent.user} - ${serviceNames}`,
      originalData: updatedOriginalData
    };

    setEventList(prevEvents =>
      prevEvents.map(event =>
        event.id === selectedEvent.id ? updatedEvent : event
      )
    );
    
    setSelectedEvent(updatedEvent); 
    setShowPopup(false); 
  }, [selectedEvent]);

  const eventStyleGetter = useCallback((event) => { 
    const status = event.status || '';
    const backgroundColor = statusColorMap[status] || '#e5e7eb'; 
    
    return { 
      style: { 
        backgroundColor, 
        borderRadius: '5px', 
        color: 'black', 
        border: 'none', 
        padding: '4px 8px', 
      } 
    }; 
  }, []); 

  const handleClosePopup = useCallback(() => { 
    setShowPopup(false); 
    setShowEventDetails(false); 
    setSelectedEvent(null); 
  }, []); 

  return ( 
    <div 
      ref={calendarRef} 
      style={{ height: '650px', margin: '20px', position: 'relative' }} 
      onClick={handleCalendarClick}
    > 
      <div className="flex gap-4 mb-4"> 
        {Object.entries(statusColorMap).map(([status, color]) => ( 
          <div key={status} className="flex items-center gap-2"> 
            <span className="w-4 h-4 rounded" style={{ backgroundColor: color }}></span> 
            <span className="text-sm text-gray-700 capitalize">{status}</span> 
          </div> 
        ))} 
      </div> 
      
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
        components={{ toolbar: CustomToolbar }} 
        draggableAccessor={(event) => !!event.isDraggable} 
        resizable 
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventClick} 
        eventPropGetter={eventStyleGetter} 
      />

      {showEventDetails && selectedEvent && ( 
        <EventDetails 
          position={popupPosition} 
          onClose={handleClosePopup} 
          event={selectedEvent} 
          onStatusChange={handleStatusChange} 
        /> 
      )}

      {showPopup && selectedEvent === null && ( 
        <AppointmentPopup 
          position={popupPosition} 
          onClose={handleClosePopup} 
          onAddService={handleAddService} 
        /> 
      )}
    </div> 
  ); 
}; 

export default MyCalendar;