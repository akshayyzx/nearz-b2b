import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const FetchSalonService = ({ addEvent, selectedSlot }) => {
  const [salonServices, setSalonServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // Customer and appointment state
  const [customerName, setCustomerName] = useState("");
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [pendingAppointments, setPendingAppointments] = useState([]);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSalonData = async () => {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setError("No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }
      
      const payload = parseJwt(token);
      const salonId = payload?.salon_id;
      
      if (!salonId) {
        setError("No salon ID found in your account. Please contact support.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(
          `https://polar-dawn-37707.herokuapp.com/salons/${salonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const data = response.data;
        const services = data?.data?.salon?.salon_services || [];
        setSalonServices(services);
        
        // If there are services, expand the first category by default
        const categories = getServiceCategories(services);
        if (categories.length > 0) {
          setExpandedCategory(categories[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching salon data:", error);
        setError("Failed to load salon services. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchSalonData();
  }, []);

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

  // Handle category click to expand/collapse
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  // Handle customer name submission
  const handleCustomerNameSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }
    setHasEnteredName(true);
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
      title: `${customerName} - ${service.name}`,
      start: startTime,
      end: endTime,
      metadata: {
        customerName,
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
  
  // Confirm and add all pending appointments to calendar
  const handleConfirmAllAppointments = () => {
    pendingAppointments.forEach(appointment => {
      addEvent(
        appointment.title,
        appointment.start,
        appointment.end,
        appointment.metadata
      );
    });
    
    // Reset the form
    setPendingAppointments([]);
    setCustomerName("");
    setHasEnteredName(false);
  };

  // Start over with a different customer
  const handleStartOver = () => {
    setPendingAppointments([]);
    setCustomerName("");
    setHasEnteredName(false);
  };

  if (loading) {
    return (
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">Salon Services</h3>
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-sm">Loading services...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">Salon Services</h3>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 text-sm">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Step 1: Enter customer name
  if (!hasEnteredName) {
    return (
      <div className="mt-4">
        <h3 className="text-md font-medium mb-3">Customer Information</h3>
        <form onSubmit={handleCustomerNameSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter customer name"
              autoFocus
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-medium">Services for {customerName}</h3>
        <button
          onClick={handleStartOver}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          Change Customer
        </button>
      </div>
      
      {/* Pending Appointments Section */}
      {pendingAppointments.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Selected Services ({pendingAppointments.length})</h4>
            <button
              onClick={handleConfirmAllAppointments}
              className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
            >
              Confirm All
            </button>
          </div>
          
          <ul className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 mb-4">
            {pendingAppointments.map((appointment, index) => (
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
                              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
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
  );
};

export default FetchSalonService;