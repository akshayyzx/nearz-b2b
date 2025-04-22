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

  // 🆕 Make loadEvents reusable
  const loadEvents = useCallback(async () => {
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
          title: serviceNames || 'Unnamed Appointment',
          start: startDateTime,
          end: endDateTime,
          isDraggable: true,
          metadata: app,
          status: app.status
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

  const handleNavigate = useCallback((newDate) => setCurrentDate(newDate), []);
  const handleViewChange = useCallback((newView) => setCurrentView(newView), []);

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

  // ✅ Updated to refetch appointments after adding one
  const addEvent = async (title, start, end, metadata) => {
    if (selectedSlot && title) {
      setSidebarOpen(false);
      await loadEvents(); // ← Refresh events after add
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
    let className = '';
    if (event.status === 'Confirmed') className = 'status-confirmed';
    else if (event.status === 'Pending') className = 'status-pending';
    else if (event.status === 'Cancelled') className = 'status-cancelled';
    return { className };
  }, []);

  const dayPropGetter = (date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        className: 'today-highlight',
        style: {
          backgroundColor: '#e6f7ff',
          borderBottom: '2px solid #1890ff',
          fontWeight: 'bold'
        }
      };
    }
    return {};
  };

  if (isLoadingEvents) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full ml-15">
      <div className="h-full w-full ">
        <div className="h-[85vh] w-[90vw]  mt-5">
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
            defaultDate={new Date()}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        selectedSlot={selectedSlot}
        addEvent={addEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
      />
    </div>
  );
};

export default MyCalendar;
