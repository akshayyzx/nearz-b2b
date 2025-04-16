import React, { useEffect, useState } from "react";
import axios from "axios";

const SalonServices = () => {
  const [salonServices, setSalonServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

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

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Salon Services</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading salon services...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Salon Services</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Salon Services</h1>
      
      {/* Services Accordion */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {salonServices && salonServices.length > 0 ? (
          <div>
            {getServiceCategories(salonServices).map((category) => (
              <div key={category} className="border-b last:border-b-0">
                <button
                  className="w-full p-4 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                  onClick={() => toggleCategory(category)}
                >
                  <span className="font-medium">{category}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
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
                  <div className="px-4 pb-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm text-gray-600">
                          <th className="text-left py-2">Service</th>
                          <th className="text-left py-2">Gender</th>
                          <th className="text-right py-2">Duration</th>
                          <th className="text-right py-2">Regular</th>
                          <th className="text-right py-2">Discount</th>
                          <th className="text-right py-2">Final</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getServicesByCategory(salonServices, category).map((service) => (
                          <tr key={service.id} className="border-b last:border-b-0">
                            <td className="py-3">
                              <div className="font-medium">{service.name}</div>
                              {service.custom_name && service.custom_name !== service.name && (
                                <div className="text-xs text-gray-500">{service.custom_name}</div>
                              )}
                            </td>
                            <td className="py-3">{service.gender}</td>
                            <td className="text-right py-3">{service.duration_in_minutes} min</td>
                            <td className="text-right py-3">₹{service.price}</td>
                            <td className="text-right py-3 text-green-600">{service.discount}%</td>
                            <td className="text-right py-3 font-medium">₹{service.discounted_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-gray-500">No services available for this salon.</p>
        )}
      </div>
    </div>
  );
};

export default SalonServices;