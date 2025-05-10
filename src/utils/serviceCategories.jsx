import React, { useState, useEffect } from 'react';

export default function TopServicesChart({ appointments }) {
  const [serviceCategories, setServiceCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Process the appointments data that's passed as a prop
    processAppointmentData(appointments);
  }, [appointments]);

  const processAppointmentData = (appointments) => {
    if (!appointments || !Array.isArray(appointments)) {
      setIsLoading(false);
      return;
    }

    try {
      // Dictionary to store service category counts and revenue
      const serviceCategoriesMap = {};

      // Loop through all appointments
      appointments.forEach(appointment => {
        // Check if salon_services exists and is an array
        if (appointment.salon_services && Array.isArray(appointment.salon_services)) {
          // Loop through each service in the appointment
          appointment.salon_services.forEach(service => {
            const categoryName = service.category_name;
            
            // Skip if no category name
            if (!categoryName) return;
            
            // Initialize category in map if it doesn't exist
            if (!serviceCategoriesMap[categoryName]) {
              serviceCategoriesMap[categoryName] = {
                count: 0,
                totalRevenue: 0
              };
            }
            
            // Increment count and add to total revenue
            serviceCategoriesMap[categoryName].count += 1;
            serviceCategoriesMap[categoryName].totalRevenue += parseFloat(service.amount || 0);
          });
        }
      });

      // Convert map to array and sort by count (descending)
      const sortedCategories = Object.keys(serviceCategoriesMap)
        .map(category => ({
          name: category,
          count: serviceCategoriesMap[category].count,
          totalRevenue: serviceCategoriesMap[category].totalRevenue
        }))
        .sort((a, b) => b.count - a.count);

      // Get top 5 categories
      const top5Categories = sortedCategories.slice(0, 5);
      
      setServiceCategories(top5Categories);
    } catch (err) {
      setError("Error processing appointment data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading service data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40 text-red-500">
        Error: {error}
      </div>
    );
  }

  // Calculate the maximum count for proper scaling
  const maxCount = serviceCategories.length > 0 ? 
    Math.max(...serviceCategories.map(s => s.count)) : 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-lg font-medium text-gray-800">Top 5 Most Requested Services</h3>
      
      {serviceCategories.length > 0 ? (
        <div className="space-y-4">
          {serviceCategories.map((service, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{service.name}</span>
                <span className="text-sm font-medium text-gray-700">{service.count} bookings</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${index === 0 ? 'bg-[#F25435]' : 'bg-indigo-600'}`}
                  style={{width: `${(service.count / maxCount) * 100}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-500">
          No service data available
        </div>
      )}
    </div>
  );
}