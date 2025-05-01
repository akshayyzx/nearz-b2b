import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import Sidebar from './sideServiceSlider';
import '../styles/calendar.css';
import { fetchAppointments } from './FetchAppointmentSlots.jsx';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [eventList, setEventList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const convertToDateObject = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    let [time, meridiem] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

    if (meridiem.toLowerCase() === 'pm' && hours !== 12) hours += 12;
    if (meridiem.toLowerCase() === 'am' && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
  };
const loadEvents= useCallback(async () => {
    try {
      setIsLoadingEvents(true);
      const appointments = await fetchAppointments();

      const mapped = appointments.map((app, idx) => {
        const appointmentDate = app.date;
        const startTime = app.start_time;
        const endTime = app.end_time;
        const startDateTime = convertToDateObject(appointmentDate, startTime);
        const endDateTime = convertToDateObject(appointmentDate, endTime);
        const serviceNames = app.salon_services.map(service =>
          service.custom_name || service.service_name
        ).join(', ');

        return {
          id: app.id || idx,
          title: `${app.start_time.split(' ')[0]} ${serviceNames || 'Walk-In'}`,
          start: startDateTime,
          end: endDateTime,
          isDraggable: true,
          metadata: app,
          status: app.status || 'confirmed'
        };
      });

      setEventList(mapped);
    } catch (err) {
      console.error('Unable to load appointments:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setCurrentView(newView);
  }, []);

  const handleEventDrop = useCallback(({ event, start, end }) => {
    setEventList(prev =>
      prev.map(e => (e.id === event.id ? { ...e, start, end } : e))
    );
  }, []);

  const handleEventResize = useCallback(({ event, start, end }) => {
    setEventList(prev =>
      prev.map(e => (e.id === event.id ? { ...e, start, end } : e))
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

  const closeSidebar = () => setSidebarOpen(false);

  const addEvent = async (title, start, end, metadata) => {
    if (selectedSlot && title) {
  
       loadEvents(); // Refresh events after add
    }
  };

  const updateEvent = (id, title) => {
    setEventList(prev => prev.map(e => (e.id === id ? { ...e, title } : e)));
  };

  const deleteEvent = (id) => {
    setEventList(prev => prev.filter(e => e.id !== id));
    setSidebarOpen(false);
  };

  const eventPropGetter = useCallback((event) => {
    let className = 'fresha-event';
    // Add status-specific classes for coloring
    if (event.status === 'confirmed' || event.status === 'Confirmed') 
      className += ' status-confirmed';
    else if (event.status === 'pending' || event.status === 'Pending') 
      className += ' status-pending';
    else if (event.status === 'cancelled' || event.status === 'Cancelled') 
      className += ' status-cancelled';
    return { className };
  }, []);

  const dayPropGetter = useCallback((date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return { className: 'today-highlight' };
    }
    return {};
  }, []);

  // This function will properly format the label for our toolbar
  const getFormattedLabel = () => {
    const date = currentDate;
    const formatted = moment(date).format('MMMM YYYY');
    return formatted;
  };

  // Custom toolbar with functional buttons
  const CustomToolbar = (toolbarProps) => {
    const goToToday = () => {
      const now = new Date();
      handleNavigate(now);
    };

    const goToPrev = () => {
      const newDate = moment(currentDate).subtract(1, currentView).toDate();
      handleNavigate(newDate);
    };

    const goToNext = () => {
      const newDate = moment(currentDate).add(1, currentView).toDate();
      handleNavigate(newDate);
    };

    const onViewChange = (newView) => {
      handleViewChange(newView.toLowerCase());
    };

    return (
      <div className="fresha-toolbar">
        <div className="fresha-toolbar-left">
          <button 
            className="today-btn" 
            onClick={goToToday}
          >
            Today
          </button>
          <div className="nav-buttons">
            <button onClick={goToPrev}>
              <span>‹</span>
            </button>
            <span className="toolbar-label">{getFormattedLabel()}</span>
            <button onClick={goToNext}>
              <span>›</span>
            </button>
          </div>
        </div>
        <div className="fresha-toolbar-center">
          {/* <div className="team-selector">
            <span>Scheduled team</span>
            <span className="arrow-down">▼</span>
          </div> */}
          <h1 className='font-bold text-2xl'>Appointments Calendar</h1>
          {/* <button className="filter-btn">
            <span>≡</span>
          </button> */}
        </div>
        <div className="fresha-toolbar-right">
          <button 
            className="settings-btn"
            title="Settings"
          >
            <span>⚙️</span>
          </button>
          <button 
            className="calendar-btn"
            title="Calendar"
          >
            <span>📅</span>
          </button>
          <button 
            className="refresh-btn"
            onClick={loadEvents}
            title="Refresh"
          >
            <span>↻</span>
          </button>
          <div className="view-selector">
            <select 
              value={currentView}
              onChange={(e) => handleViewChange(e.target.value)}
              className="view-select"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
              {/* <option value="agenda">Agenda</option> */}
            </select>
          </div>
          <button 
            className="add-btn"
            onClick={() => {
              // Create a new slot for today
              const now = new Date();
              const end = new Date(now);
              end.setHours(end.getHours() + 1);
              
              setSelectedSlot({
                start: now,
                end: end
              });
              setSidebarOpen(true);
            }}
          >
            Add <span className="arrow-down">▼</span>
          </button>
        </div>
      </div>
    );
  };

  if (isLoadingEvents) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="fresha-calendar-container rounded-xl mt-2">
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
        draggableAccessor={event => !!event.isDraggable}
        resizable
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        components={{
          toolbar: CustomToolbar
        }}
        views={['month', 'week', 'day']}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        selectedSlot={selectedSlot}
        addEvent={addEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
        loadEvents={loadEvents} 
      />
    </div>
  );
};

export default MyCalendar;