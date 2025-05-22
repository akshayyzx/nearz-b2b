import React, { useState, useEffect } from "react";
import moment from "moment";
import salonApiService from "./FetchAppointmentSlots";


const SalonBookingApp = ({onClose,loadEvents}) => {
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
  const [userName, setUserName] = useState("");
  const [discountAmount, setDiscountAmount] = useState(""); // Changed from percentage to amount
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  
  // Validation error states
  const [timeSlotError, setTimeSlotError] = useState("");
  const [userDetailsError, setUserDetailsError] = useState("");
  const [discountError, setDiscountError] = useState(""); // Added discount error state
  
  // Booking success state
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Initial data fetch - salon ID and services
  useEffect(() => {
    const loadSalonData = async () => {
      setLoading(true);
      try {
        const { salonId, services } = await salonApiService.fetchSalonData();
        setSalonId(salonId);
        setSalonServices(services);
        setFilteredServices(services);
        
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
    if (!salonId) return;
    
    const loadTimeSlots = async () => {
      setLoadingSlots(true);
      try {
        const slots = await salonApiService.fetchTimeSlots(salonId, selectedDate);
        setTimeSlots(slots);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSlots(false);
      }
    };
    
    loadTimeSlots();
  }, [selectedDate, salonId]);

  // Calculate total duration when pending appointments change
  useEffect(() => {
    const duration = pendingAppointments.reduce((total, appointment) => 
      total + appointment.metadata.duration, 0);
    setTotalDuration(duration);
  }, [pendingAppointments]);

  // Clear validation errors when respective fields change
  useEffect(() => {
    if (selectedSlot) setTimeSlotError("");
  }, [selectedSlot]);

  useEffect(() => {
    // Clear user details error as soon as the user starts typing
    if (userName || phoneNumber) setUserDetailsError("");
  }, [userName, phoneNumber]);

  // Filter services based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredServices(salonServices);
    } else {
      const filtered = salonServices.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
      
      // Expand all categories when searching
      if (filtered.length > 0) {
        const categories = getServiceCategories(filtered);
        if (categories.length > 0) {
          setExpandedCategory(categories[0]);
        }
      }
    }
  }, [searchTerm, salonServices]);

  // Extract unique service categories
  const getServiceCategories = (services) => {
    const categories = new Set();
    services.forEach(service => categories.add(service.category));
    return Array.from(categories);
  };

  // Get services filtered by category
  const getServicesByCategory = (category) => {
    return filteredServices.filter(service => service.category === category);
  };

  // Toggle category expansion in services accordion
  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
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
      slotId: slot.id
    });
    setPendingAppointments([]);
    setTimeSlotError(""); // Clear any time slot error
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Add service to pending appointments
  const handleAddService = (service) => {
    if (!selectedSlot) {
      setTimeSlotError("Please select a time slot first");
      return;
    }
    
    // Calculate start and end times
    let startTime;
    const lastIndex = pendingAppointments.length - 1;
    
    if (lastIndex >= 0) {
      startTime = new Date(pendingAppointments[lastIndex].end);
    } else {
      startTime = new Date(selectedSlot.start);
    }
    
    const endTime = new Date(startTime.getTime() + service.duration_in_minutes * 60 * 1000);
    
    const newAppointment = {
      id: Date.now(),
      title: service.name,
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
    const index = pendingAppointments.findIndex(appt => appt.id === id);
    if (index === -1) return;
    
    const newAppointments = [...pendingAppointments];
    newAppointments.splice(index, 1);
    
    // Recalculate times for subsequent appointments if needed
    if (index < newAppointments.length) {
      let currentStart = index === 0 
        ? new Date(selectedSlot.start) 
        : new Date(newAppointments[index-1].end);
      
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

  // Validate and confirm all appointments
  const validateAndConfirm = async () => {
    // Clear previous errors
    setTimeSlotError("");
    setUserDetailsError("");
    setDiscountError("");
    
    let isValid = true;
    
    // Check for user details
    if (!userName) {
      setUserDetailsError("Please enter your name.");
      isValid = false;
    } else if (phoneNumber.length !== 10) {
      setUserDetailsError("Please enter a valid 10-digit phone number.");
      isValid = false;
    }
    
    // Validate discount amount if entered
    if (discountAmount) {
      const subtotal = calculateTotalAmount().subtotal;
      const discount = parseFloat(discountAmount);
      
      if (isNaN(discount)) {
        setDiscountError("Please enter a valid discount amount");
        isValid = false;
      } else if (discount < 0) {
        setDiscountError("Discount cannot be negative");
        isValid = false;
      } else if (discount > subtotal) {
        setDiscountError("Discount cannot be greater than total amount");
        isValid = false;
      }
    }
    
    return isValid;
  };

  // Calculate the total amount
  const calculateTotalAmount = () => {
    const subtotal = pendingAppointments.reduce((total, appointment) => 
      total + appointment.metadata.price, 0);
    
    // Calculate discount as direct amount instead of percentage
    const discount = discountAmount ? parseFloat(discountAmount) : 0;
    
    return {
      subtotal,
      discountAmount: discount,
      total: Math.max(0, subtotal - discount) // Ensure total is not negative
    };
  };

  // Calculate discount percentage for API (since API expects percentage)
  const calculateDiscountPercentage = () => {
    const { subtotal, discountAmount } = calculateTotalAmount();
    if (subtotal === 0 || discountAmount === 0) return 0;
    
    return (discountAmount / subtotal) * 100;
  };

  // Confirm all appointments
  const handleConfirmAllAppointments = async () => {
    const isValid = await validateAndConfirm();
    if (!isValid) return;
    
    const formattedPhone = phoneNumber.startsWith("+91")
      ? phoneNumber
      : `+91${phoneNumber}`;
    
    const userData = {
      username: userName.trim(),
      mobile: formattedPhone,
      discount: calculateDiscountPercentage() // Convert absolute amount to percentage for API
    };
    
    try {
      const response = await salonApiService.makeAppointment(
        salonId,
        selectedSlot.start,
        totalDuration,
        selectedSlot,
        pendingAppointments,
        userData
      );
      
      setBookingData(response);
      setBookingSuccess(true);
      setPendingAppointments([]);
      
      // Load new appointments in the background
      loadEvents();
      
      // Auto-close the booking success message after 5 seconds
      setTimeout(() => {
        setBookingSuccess(false);
        onClose();
      },0);
      
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Generate calendar date cells for date picker
  const generateCalendarDays = () => {
    const today = moment();
    const startOfMonth = moment(selectedDate).startOf('month');
    const endOfMonth = moment(selectedDate).endOf('month');
    const startDay = moment(startOfMonth).startOf('week');
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
    setSelectedDate(moment(selectedDate).add(direction, 'month').format("YYYY-MM-DD"));
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  // Handle discount input change
  const handleDiscountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setDiscountAmount(value);
    if (discountError) setDiscountError("");
  };

  // Booking success overlay
  const BookingSuccessOverlay = () => {
    if (!bookingData) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 transform transition-all animate-fade-scale-in">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Booking Confirmed!</h3>
          <p className="text-center text-gray-600 mb-6">Your appointment has been successfully booked.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="mb-3">
              <p className="text-sm text-gray-500">Appointment Details</p>
              <p className="font-medium">{moment(bookingData.date).format("MMMM D, YYYY")}</p>
              <p className="text-sm">{bookingData.start_time} - {bookingData.end_time}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-3 mb-3">
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="font-medium text-sm">{bookingData.ulid}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Amount</span>
                <span className="font-medium">₹{bookingData.full_amount}</span>
              </div>
              {bookingData.discount > 0 && (
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Discount</span>
                  <span className="font-medium text-green-600">-₹{bookingData.full_amount - bookingData.amount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>₹{bookingData.amount}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setBookingSuccess(false);
              onClose();
            }}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
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
      {bookingSuccess && <BookingSuccessOverlay />}
      
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Salon Appointment Booking</h1>
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Customer's Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (userDetailsError) setUserDetailsError("");
                }}
                className={`px-3 py-2 border rounded w-full ${userDetailsError ? 'border-red-500' : ''}`}
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="10-digit Phone"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, ""));
                  if (userDetailsError) setUserDetailsError("");
                }}
                maxLength={10}
                className={`px-3 py-2 border rounded w-full ${userDetailsError ? 'border-red-500' : ''}`}
              />
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="text"
                  placeholder="Discount Amount"
                  value={discountAmount}
                  onChange={handleDiscountChange}
                  className={`px-3 py-2 pl-8 border rounded w-full ${discountError ? 'border-red-500' : ''}`}
                />
              </div>
              {discountError && (
                <p className="text-red-500 text-xs mt-1">{discountError}</p>
              )}
            </div>
          </div>
          {userDetailsError && (
            <p className="text-red-500 text-xs mt-2">{userDetailsError}</p>
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

        {/* Time Range Slider Component */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-[600px]">
          <h2 className="text-lg font-medium mb-5">Select Time Range</h2>
          
          {loadingSlots ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-600">Loading available times...</span>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
              No time slots available for {moment(selectedDate).format("MMMM D, YYYY")}.
            </div>
          ) : (
            <>
              {/* Horizontal Scrollable Time Slots - Widened */}
              <div className="flex overflow-x-auto space-x-3 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent w-[550px]">
                {timeSlots.map((slot, index) => {
                  const isSelected = selectedSlot?.formattedTime === slot.from;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className={`min-w-[90px] px-3 py-2 border text-sm rounded-md text-gray-800 font-medium
                        ${isSelected ? 'bg-green-50 border-green-500 text-green-600 font-semibold shadow-sm' : 'border-gray-300'}
                        ${timeSlotError ? 'border-red-300' : ''}
                        transition-colors duration-150`}
                    >
                      {slot.from}
                    </button>
                  );
                })}
              </div>
              
              {/* Time slot error message */}
              {timeSlotError && (
                <p className="text-red-500 text-xs mt-1">{timeSlotError}</p>
              )}
              
              {/* Progress line (below slots) */}
              <div className="relative h-2 bg-gray-200 rounded-full mx-2 my-4">
                <div 
                  className="absolute top-0 left-0 h-2 bg-gray-500 rounded-full" 
                  style={{ width: `${((timeSlots.findIndex(slot => slot.from === selectedSlot?.formattedTime) + 1) / timeSlots.length) * 100}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Calendar and Time Slots */}
          <div>
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
          </div>
          
          {/* Right Column: Services Selection */}
          <div>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-4">Select Services</h2>
              
              {/* Pending Appointments Section */}
              {pendingAppointments.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">
                      Selected Services ({pendingAppointments.length}) – Total Duration: {totalDuration} min
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
                  
                  {/* Price Summary */}
                  {pendingAppointments.length > 0 && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 mb-4">
                      <h4 className="text-sm font-medium mb-2">Price Summary</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Subtotal</span>
                        <span>{formatCurrency(calculateTotalAmount().subtotal)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm mb-1">
                          <span>Discount</span>
                          <span className="text-green-600">-{formatCurrency(calculateTotalAmount().discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-sm border-t border-gray-200 pt-1 mt-1">
                        <span>Total</span>
                        <span>{formatCurrency(calculateTotalAmount().total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}     
              {/* Search Bar for Services */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Services Accordion */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredServices.length > 0 ? (
                  <div>
                    {getServiceCategories(filteredServices).map((category) => (
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
                              {getServicesByCategory(category).map((service) => (
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
                                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
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
                  <div className="p-4 text-center text-gray-500">
                    No services found matching "{searchTerm}"
                  </div>
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