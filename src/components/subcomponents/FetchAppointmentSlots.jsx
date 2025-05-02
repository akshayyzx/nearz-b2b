// src/services/salonApiService.js
import axios from "axios";
import moment from "moment";

const API_BASE_URL = "https://shielded-scrubland-64985.herokuapp.com";

// JWT Token parser helper function
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

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }
  return token;
};

// Extract salon ID from token
const getSalonId = () => {
  const token = getAuthToken();
  const payload = parseJwt(token);
  const id = payload?.salon_id;
  
  if (!id) {
    throw new Error("No salon ID found in your account. Please contact support.");
  }
  
  return id;
};

// Fetch salon data and services
export const fetchSalonData = async () => {
  const token = getAuthToken();
  const salonId = getSalonId();
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/salons/${salonId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const data = response.data;
    return {
      salonId,
      services: data?.data?.salon?.salon_services || []
    };
  } catch (error) {
    console.error("Error fetching salon data:", error);
    throw new Error("Failed to load salon services. Please try again later.");
  }
};

// Fetch time slots for a specific date
export const fetchTimeSlots = async (salonId, date) => {
  try {
    const token = getAuthToken();
    const formattedDate = moment(date).format("DD/MM/YYYY");
    
    const response = await axios.get(
      `${API_BASE_URL}/salons/${salonId}/availability?date=${formattedDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data?.data?.slots?.[1] || [];
  } catch (err) {
    console.error("Error fetching time slots:", err);
    throw new Error("Failed to load time slots. Please try again.");
  }
};

// Check availability for services with total duration
export const checkAvailability = async (salonId, date, totalDuration) => {
  try {
    const token = getAuthToken();
    const formattedDate = moment(date).format("DD/MM/YYYY");
    
    const response = await axios.get(
      `${API_BASE_URL}/salons/${salonId}/availability_for_business?date=${formattedDate}&duration=${totalDuration}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error checking availability:", error);
    throw new Error("Failed to check availability for the selected time slot.");
  }
};

// Create an appointment with selected services
export const createAppointment = async (salonId, appointmentData) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(
      `${API_BASE_URL}/appointments`,
      appointmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to confirm appointments. Please try again."
    );
  }
};

// Make a complete booking with availability check and appointment creation
export const makeAppointment = async (
  salonId,
  date,
  totalDuration,
  selectedSlot,
  pendingAppointments,
  userData
) => {
  const appointmentDate = moment(date).format("DD/MM/YYYY");
  const startTime = moment(date).format("HH:mm:ss");
  const lastAppointment = pendingAppointments[pendingAppointments.length - 1];
  const endTime = moment(lastAppointment.end).format("HH:mm:ss");

  const appointmentData = {
    appointment: {
      salon_id: salonId,
      slot_id: selectedSlot.slotId,
      referral_id: null,
      comment: `Booked via Salon Booking App - ${userData?.username || "Guest"}`,
      date: appointmentDate,
      start_time: startTime,
      end_time: endTime,

      // ✅ Send contact info for billing
      on_behalf_of_mobile_no: userData.mobile,
      on_behalf_of_username: userData.username,

      appointment_services_attributes: pendingAppointments.map((appt) => ({
        salon_service_id: appt.metadata.serviceId,
      })),
    },
  };

  return await createAppointment(salonId, appointmentData); // Keep token here
};


  export const fetchAppointments = async (username, mobile) => {
  try {
    const token = getAuthToken();
    const salonId = getSalonId();
    // console.log(getSalonId())
    if (!salonId) throw new Error("Salon ID is missing.");
    
    // Create URL with query parameters
    let url = `${API_BASE_URL}/salons/${salonId}/appointments`;
    
    // Add query parameters if provided
    const queryParams = new URLSearchParams();
    if (username) queryParams.append('username', username);
    if (mobile) queryParams.append('mobile', mobile);
    
    // Append query parameters to URL if any exist
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response?.data?.data?.appointments)
    
    return response?.data?.data?.appointments || [];
  } catch (error) {
    console.error("Fetch Appointments Error:", error?.response || error);
    throw new Error("Unable to fetch appointments. Please try again.");
  }
};

  // Add this to salonApiService.js

  export const generateBill = async (appointmentId, userData = null) => {
  const token = getAuthToken();
 
  try {
    // Basic request config with authorization
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    
    // Remove the conditional that adds the on_behalf_of parameters
    // This allows the default behavior which sends to WhatsApp
   
    await axios.get(
      `${API_BASE_URL}/appointments/${appointmentId}/send_bill`,
      requestConfig
    );
   
    return { success: true };
  } catch (error) {
    console.error("Error generating bill:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to generate bill.",
    };
  }
};
  
export const confirmAppointment = async (appointmentId) => {
  try {
    const token = getAuthToken();
    
    const response = await axios.put(
      `${API_BASE_URL}/appointments/${appointmentId}/confirm`,
      {},  // Empty body as we're just sending a PUT request
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error confirming appointment:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to confirm appointment. Please try again."
    );
  }
};
  
export default {
  fetchSalonData,
  fetchTimeSlots,
  checkAvailability,
  createAppointment,
  makeAppointment,
  fetchAppointments,
  generateBill,
  confirmAppointment,  // Add the new function to the export
};