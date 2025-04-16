import React, { useEffect, useState } from "react";
import axios from "axios";


const SalonDashboard = () => {
  const [salonDetails, setSalonDetails] = useState(null);

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
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      console.warn("No token found in localStorage.");
      return;
    }
  
    const payload = parseJwt(token);
    console.log("JWT Payload:", payload);
  
    const salonId = payload?.salon_id || payload?.salonId;
    if (!salonId) {
      console.warn("No salon_id found in token payload.");
      return;
    }
  
    axios.get(`https://polar-dawn-37707.herokuapp.com/salons/${salonId}`)
      .then((response) => {
        const data = response.data;
        const salon = data?.salon || data;
  
        setSalonDetails(salon);
  
        console.log("Services:");
        salon?.salon_services?.map((service) =>
          console.log(
            ` - ${service.name} (${service.category}) - ₹${service.price} ➜ ₹${service.discounted_price}`
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching salon data:", error);
      });
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Salon Dashboard</h1>
      {salonDetails ? (
        <pre className="bg-gray-100 p-4 rounded text-sm">
          {JSON.stringify(salonDetails, null, 2)}
        </pre>
      ) : (
        <p>Loading salon details...</p>
      )}
    </div>
  );
};

export default SalonDashboard;
