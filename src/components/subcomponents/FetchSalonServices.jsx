import React, { useState, useEffect } from "react";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import salonApiService from "./FetchAppointmentSlots";

const SalonBookingApp = () => {
  // Main state variables
  const [salonServices, setSalonServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [salonId, setSalonId] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);
  
  // Calendar and time slots state
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Initial data fetch - salon ID and services
  useEffect(() => {
    const loadSalonData = async () => {
      setLoading(true);
      try {
        const { salonId, services } = await salonApiService.fetchSalonData();
        setSalonId(salonId);
        setSalonServices(services);
        
        // If there are services, expand the first category by default
        const categories = getServiceCategories(services);
        if (categories.length > 0) {
          setExpandedCategory(categories[0]);
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    
    loadSalonData();
  }, []);

  // Fetch time slots whenever date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!salonId) return;
      
      setLoadingSlots(true);
      
      try {
        const slots = await salonApiService.fetchTimeSlots(salonId, selectedDate);
        setTimeSlots(slots);
        setLoadingSlots(false);
      } catch (err) {
        setError(err.message);
        setLoadingSlots(false);
      }
    };
    
    loadTimeSlots();
  }, [selectedDate, salonId]);

  // Calculate total duration when pending appointments change
  useEffect(() => {
    const duration = pendingAppointments.reduce((total, appointment) => {
      return total + appointment.metadata.duration;
    }, 0);
    setTotalDuration(duration);
  }, [pendingAppointments]);

  // Extract unique service categories
  const getServiceCategories = (services) => {
    const categories = new Set();
    services.forEach(service => categories.add(service.category));
    return Array.from(categories);
  };

  // Get services filtered by category
  const getServicesByCategory = (services, category) => {
    return services.filter(service => service.category === category);
  };

  // Toggle category expansion in services accordion
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    setSelectedDate(moment(date).format("YYYY-MM-DD"));
    setSelectedSlot(null); // Reset selected slot when date changes
    setPendingAppointments([]); // Reset pending appointments when date changes
  };

  // Handle time slot selection
  const handleSlotSelect = (slot) => {
    const slotDateTime = moment(`${selectedDate} ${slot.from}`, "YYYY-MM-DD hh:mm a").toDate();
    setSelectedSlot({
      start: slotDateTime,
      formattedTime: slot.from,
      slotId: slot.id // Store the slot ID for the API call
    });
    setPendingAppointments([]); // Reset pending appointments when time slot changes
  };

  // Add service to pending appointments
  const handleAddService = (service) => {
    if (!selectedSlot || !selectedSlot.start) {
      alert("Please select a time slot first");
      return;
    }
    
    // Calculate the end time based on the service duration
    const startTime = new Date(selectedSlot.start);
    let endTime;
    
    // If there are existing appointments, schedule this one after the last one
    if (pendingAppointments.length > 0) {
      const lastAppointment = pendingAppointments[pendingAppointments.length - 1];
      const newStartTime = new Date(lastAppointment.end);
      endTime = new Date(newStartTime.getTime() + service.duration_in_minutes * 60 * 1000);
      startTime.setTime(newStartTime.getTime());
    } else {
      endTime = new Date(startTime.getTime() + service.duration_in_minutes * 60 * 1000);
    }
    
    const newAppointment = {
      id: Date.now(), // Temporary ID
      title: `${service.name}`,
      start: startTime,
      end: endTime,
      metadata: {
        serviceId: service.id,
        serviceName: service.name,
        price: service.discounted_price,
        duration: service.duration_in_minutes,
        category: service.category,
        gender: service.gender
      }
    };
    
    setPendingAppointments([...pendingAppointments, newAppointment]);
  };

  // Remove appointment from pending list
  const handleRemovePending = (id) => {
    // Find the index of the appointment to remove
    const index = pendingAppointments.findIndex(appt => appt.id === id);
    if (index === -1) return;
    
    // Remove the appointment
    const newAppointments = [...pendingAppointments];
    newAppointments.splice(index, 1);
    
    // If we removed anything but the last appointment, we need to recalculate times
    if (index < newAppointments.length) {
      let currentStart = index === 0 
        ? new Date(selectedSlot.start) 
        : new Date(newAppointments[index-1].end);
      
      // Update start/end times for all subsequent appointments
      for (let i = index; i < newAppointments.length; i++) {
        newAppointments[i].start = new Date(currentStart);
        newAppointments[i].end = new Date(
          currentStart.getTime() + newAppointments[i].metadata.duration * 60 * 1000
        );
        currentStart = new Date(newAppointments[i].end);
      }
    }
    
    setPendingAppointments(newAppointments);
  };

  // Confirm all appointments
  const handleConfirmAllAppointments = async () => {
    try {
      await salonApiService.makeAppointment(
        salonId,
        selectedSlot.start,
        totalDuration,
        selectedSlot,
        pendingAppointments
      );
      
      // Reset the pending appointments
      setPendingAppointments([]);
      alert("Appointments booked successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Generate calendar date cells for date picker
  const generateCalendarDays = () => {
    const today = moment();
    const startOfMonth = moment(selectedDate).startOf('month');
    const endOfMonth = moment(selectedDate).endOf('month');
    
    // Get the start of the first week (might be in previous month)
    const startDay = moment(startOfMonth).startOf('week');
    // Get the end of the last week (might be in next month)
    const endDay = moment(endOfMonth).endOf('week');
    
    const days = [];
    let day = startDay;
    
    while (day <= endDay) {
      days.push({
        date: day.format("YYYY-MM-DD"),
        dayOfMonth: day.format("D"),
        isCurrentMonth: day.month() === moment(selectedDate).month(),
        isToday: day.isSame(today, 'day'),
        isSelected: day.format("YYYY-MM-DD") === selectedDate
      });
      day = day.clone().add(1, 'day');
    }
    
    return days;
  };

  // Navigate to previous/next month
  const navigateMonth = (direction) => {
    const newDate = moment(selectedDate).add(direction, 'month').format("YYYY-MM-DD");
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading salon data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Salon Appointment Booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Calendar and Time Slots */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Select Date</h2>
              
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <span className="font-medium">{moment(selectedDate).format("MMMM YYYY")}</span>
                <button 
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                    {day}
                  </div>
                ))}
                
                {generateCalendarDays().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(day.date)}
                    className={`
                      p-2 text-sm rounded-lg
                      ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                      ${day.isSelected ? 'bg-blue-500 text-white' : ''}
                      ${day.isToday && !day.isSelected ? 'border border-blue-500' : ''}
                      ${day.isCurrentMonth && !day.isSelected ? 'hover:bg-gray-100' : ''}
                    `}
                  >
                    {day.dayOfMonth}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time Slots */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Available Time Slots</h2>
              {loadingSlots ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span className="ml-2 text-sm">Loading slots...</span>
                </div>
              ) : timeSlots.length === 0 ? (
                <div className="bg-yellow-50 text-yellow-800 p-3 text-sm rounded">
                  No time slots available for {moment(selectedDate).format("MMMM D, YYYY")}.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className={`
                        p-2 text-xs border rounded text-center
                        ${selectedSlot && selectedSlot.formattedTime === slot.from
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-white hover:bg-gray-50 border-gray-200'}
                      `}
                    >
                      {slot.from}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Selected Information Summary */}
            {selectedSlot && (
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-medium mb-4">Selected Date & Time</h2>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="font-medium">{moment(selectedDate).format("MMMM D, YYYY")}</p>
                  <p className="text-sm mt-1">Time: {selectedSlot.formattedTime}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column: Services Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Select Services</h2>
              
              {/* Pending Appointments Section */}
              {pendingAppointments.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">
                      Selected Services ({pendingAppointments.length}) - Total Duration: {totalDuration} min
                    </h3>
                    <button
                      onClick={handleConfirmAllAppointments}
                      className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Confirm All
                    </button>
                  </div>
                  
                  <ul className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 mb-4">
                    {pendingAppointments.map((appointment) => (
                      <li key={appointment.id} className="p-2 flex justify-between items-center">
                        <div className="text-sm">
                          <p className="font-medium">{appointment.metadata.serviceName}</p>
                          <div className="flex text-xs text-gray-500 space-x-2">
                            <span>₹{appointment.metadata.price}</span>
                            <span>•</span>
                            <span>{appointment.metadata.duration} min</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {moment(appointment.start).format('h:mm a')} - {moment(appointment.end).format('h:mm a')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemovePending(appointment.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Services Accordion */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {salonServices && salonServices.length > 0 ? (
                  <div>
                    {getServiceCategories(salonServices).map((category) => (
                      <div key={category} className="border-b last:border-b-0">
                        <button
                          className="w-full p-2 flex justify-between items-center hover:bg-gray-50 focus:outline-none text-sm"
                          onClick={() => toggleCategory(category)}
                        >
                          <span className="font-medium">{category}</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              expandedCategory === category ? "transform rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </button>
                        
                        {expandedCategory === category && (
                          <div className="px-2 pb-2">
                            <ul className="divide-y divide-gray-100">
                              {getServicesByCategory(salonServices, category).map((service) => (
                                <li key={service.id} className="py-2">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-medium text-sm">{service.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {service.gender} · {service.duration_in_minutes} min · ₹{service.discounted_price}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleAddService(service)}
                                      disabled={!selectedSlot}
                                      className={`text-xs px-2 py-1 rounded
                                        ${!selectedSlot 
                                          ? 'bg-gray-300 cursor-not-allowed' 
                                          : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                    >
                                      Add
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="p-2 text-gray-500 text-sm">No services available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonBookingApp;