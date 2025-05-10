import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Clock, BarChart, BarChart3, Calendar as CalendarIcon } from 'lucide-react';

const CustomDateRangeComponent = ({ onDateRangeChange, initialStartDate = null, initialEndDate = null }) => {
  const [startDate, setStartDate] = useState(initialStartDate ? new Date(initialStartDate) : null);
  const [endDate, setEndDate] = useState(initialEndDate ? new Date(initialEndDate) : null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('custom'); // 'daily', 'weekly', 'monthly', 'yearly', 'custom'

  // Update local state if props change (e.g., when filter is cleared externally)
  useEffect(() => {
    setStartDate(initialStartDate ? new Date(initialStartDate) : null);
    setEndDate(initialEndDate ? new Date(initialEndDate) : null);
  }, [initialStartDate, initialEndDate]);

  // Handle date changes
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setActiveFilter('custom');
    // If end date is before the new start date, adjust it
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setActiveFilter('custom');
  };

  // Apply the filter when both dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  }, [startDate, endDate]);

  // Handle predefined periods
  const handlePredefinedPeriod = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setStartDate(start);
    setEndDate(end);
    setActiveFilter('custom');
    onDateRangeChange(start, end);
  };

  // Clear the filter
  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setActiveFilter('custom');
    onDateRangeChange(null, null);
  };

  // Handle daily filter
  const handleDailyFilter = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    setStartDate(today);
    setEndDate(end);
    setActiveFilter('daily');
    onDateRangeChange(today, end);
  };

  // Handle weekly filter
  const handleWeeklyFilter = () => {
    const today = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    // Find the first day of the current week (Sunday)
    const start = new Date(today);
    const day = start.getDay(); // 0 for Sunday, 1 for Monday, etc.
    start.setDate(start.getDate() - day); // Go back to the first day of the week
    start.setHours(0, 0, 0, 0);
    
    setStartDate(start);
    setEndDate(end);
    setActiveFilter('weekly');
    onDateRangeChange(start, end);
  };

  // Handle monthly filter
  const handleMonthlyFilter = () => {
    const today = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    // Find the first day of the current month
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    
    setStartDate(start);
    setEndDate(end);
    setActiveFilter('monthly');
    onDateRangeChange(start, end);
  };

  // Handle yearly filter
  const handleYearlyFilter = () => {
    const today = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    // Find the first day of the current year
    const start = new Date(today.getFullYear(), 0, 1);
    start.setHours(0, 0, 0, 0);
    
    setStartDate(start);
    setEndDate(end);
    setActiveFilter('yearly');
    onDateRangeChange(start, end);
  };

  return (
    <div className="relative">
      {/* Filter Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          onClick={handleDailyFilter}
          className={`flex items-center px-4 py-2 text-sm font-medium ${activeFilter === 'daily' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <Clock size={16} className="mr-1" />
          Daily
        </button>
        <button
          onClick={handleWeeklyFilter}
          className={`flex items-center px-4 py-2 text-sm font-medium ${activeFilter === 'weekly' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <BarChart size={16} className="mr-1" />
          Weekly
        </button>
        <button
          onClick={handleMonthlyFilter}
          className={`flex items-center px-4 py-2 text-sm font-medium ${activeFilter === 'monthly' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <BarChart3 size={16} className="mr-1" />
          Monthly
        </button>
        <button
          onClick={handleYearlyFilter}
          className={`flex items-center px-4 py-2 text-sm font-medium ${activeFilter === 'yearly' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <CalendarIcon size={16} className="mr-1" />
          Yearly
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Start Date Picker */}
        <div className="relative">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            placeholderText="Start Date"
            dateFormat="dd/MM/yyyy"
            className="bg-white border border-gray-300 px-3 py-2 rounded-md text-sm w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <Calendar size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
        
        <span className="text-gray-500">to</span>
        
        {/* End Date Picker */}
        <div className="relative">
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            placeholderText="End Date"
            dateFormat="dd/MM/yyyy"
            className="bg-white border border-gray-300 px-3 py-2 rounded-md text-sm w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <Calendar size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        </div>
        
        {/* Quick Select Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm transition-colors"
          >
            Quick Select
          </button>
          
          {isOpen && (
            <div className="absolute mt-1 right-0 z-10 w-48 bg-white rounded-md shadow-lg border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    handlePredefinedPeriod(7);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => {
                    handlePredefinedPeriod(30);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => {
                    handlePredefinedPeriod(90);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Last 90 days
                </button>
                <button
                  onClick={() => {
                    handleClearFilter();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reset Filter Button */}
        {(startDate || endDate) && (
          <button
            onClick={handleClearFilter}
            className="text-sm text-red-600 hover:text-red-700 ml-2"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomDateRangeComponent;