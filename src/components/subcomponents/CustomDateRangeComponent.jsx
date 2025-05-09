import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';

const CustomDateRangeComponent = ({ onDateRangeChange }) => {
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customDateActive, setCustomDateActive] = useState(false);
  const [viewType, setViewType] = useState('monthly');
  const [customData, setCustomData] = useState(null);

  // Today's date to set max date for datepicker
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (customDateActive && startDate && endDate) {
      // Generate custom data when custom date is active
      const newCustomData = generateCustomData(startDate, endDate);
      setCustomData(newCustomData);
      
      // Call the parent callback with the new date range
      onDateRangeChange && onDateRangeChange(startDate, endDate, newCustomData);
    }
  }, [customDateActive, startDate, endDate]);

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Reset custom date selection
  const resetCustomDate = () => {
    setStartDate('');
    setEndDate('');
    setCustomDateActive(false);
    setCustomData(null);
    setIsCustomDateOpen(false);
    setViewType('monthly');
    onDateRangeChange && onDateRangeChange(null, null, null);
  };

  // Apply custom date filter
  const applyCustomDateFilter = () => {
    if (startDate && endDate) {
      setCustomDateActive(true);
      setIsCustomDateOpen(false);
      // No need to generate data here as useEffect will handle it
    }
  };

  // Handle view type change
  const handleViewTypeChange = (value) => {
    if (value === "") return; // Handle placeholder selection
    
    if (value === "custom") {
      setIsCustomDateOpen(true);
    } else {
      setViewType(value);
      setCustomDateActive(false);
      setCustomData(null);
      onDateRangeChange && onDateRangeChange(null, null, null);
    }
  };

  // Generate synthetic data based on date range - this is an example function
  // You should replace this with your actual data generation or fetching logic
  const generateCustomData = (start, end) => {
    const startDateTime = new Date(start).getTime();
    const endDateTime = new Date(end).getTime();
    const daysDiff = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate date labels
    const labels = [];
    const currentDate = new Date(start);
    for (let i = 0; i < daysDiff; i++) {
      labels.push(currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // This is a placeholder function that returns mock data
    // Replace with your actual data generation or fetching logic
    return {
      labels: labels,
      daysDiff: daysDiff,
      startDate: start,
      endDate: end
      // Add more data properties as needed
    };
  };

  return (
    <div className="w-full">
      {/* Time Period Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative inline-block">
          <select
            value={customDateActive ? "custom" : viewType}
            onChange={(e) => handleViewTypeChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm min-w-40"
          >
            {/* <option value="" disabled>ViewType</option> */}
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom Date Range</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Date Range Display (when custom date is active) */}
      {customDateActive && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-6 inline-flex items-center">
          <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
          <span className="text-sm font-medium text-indigo-700">
            {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
          </span>
          <button 
            onClick={resetCustomDate}
            className="ml-2 text-indigo-600 hover:text-indigo-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Custom Date Range Picker Dialog */}
      {isCustomDateOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative border-2 border-indigo-600">
            {/* Close button */}
            <button
              onClick={() => setIsCustomDateOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Date Range</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  max={endDate || today}
                  value={startDate || ''}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  min={startDate}
                  max={today}
                  value={endDate || ''}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsCustomDateOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCustomDateFilter}
                  disabled={!startDate || !endDate}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-150 ${
                    !startDate || !endDate
                      ? 'bg-indigo-300 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateRangeComponent;