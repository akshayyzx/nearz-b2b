import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Search, Users, User, UserPlus, Clock, DollarSign, Activity, IndianRupee,
  Calendar, CalendarDays, CalendarRange, ChevronDown, FilterIcon
} from 'lucide-react';

import TopCategories from '../../utils/topCategories.jsx';
import ConversionFunnel from '../../utils/coversionFunnel.jsx';
import CustomDateRangeComponent from './CustomDateRangeComponent.jsx';

// Component for customer insight card
function InsightCard({ icon, title, value, change, increased }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${increased ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
            {icon}
          </div>
          <span className="ml-2 text-sm text-gray-600">{title}</span>
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
        <span className={`text-xs font-medium ${increased ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'} px-2 py-0.5 rounded`}>
          {change}% {increased ? '↑' : '↓'}
        </span>
      </div>
    </div>
  );
}



// Mock data for different time periods
const allData = {
  weekly: {
    revenueData: [
      { month: 'Mon', totalRevenue: 9500, cumulativeRevenue: 9500 },
      { month: 'Tue', totalRevenue: 8200, cumulativeRevenue: 17700 },
      { month: 'Wed', totalRevenue: 10500, cumulativeRevenue: 28200 },
      { month: 'Thu', totalRevenue: 11000, cumulativeRevenue: 39200 },
      { month: 'Fri', totalRevenue: 15000, cumulativeRevenue: 54200 },
      { month: 'Sat', totalRevenue: 21000, cumulativeRevenue: 75200 },
      { month: 'Sun', totalRevenue: 12000, cumulativeRevenue: 87200 },
    ],
    customerInsights: {
      retentionRate: { value: 72, change: 1.5, increased: true },
      churnRate: { value: 15, change: 2.8, increased: false },
      avgAppointmentsPerDay: { value: 22, change: 2.2, increased: true },
      pageViews: { value: 450, change: 7.7, increased: true },
      newCustomers: { value: 15, change: 3.9, increased: true },
      averageBill: { value: 1150, change: 2.1, increased: true },
      totalRevenue: { value: '₹ 87,200', change: 3.3, increased: true },
      totalAppointments: { value: '154', change: 2.2, increased: true }
    }
  },
  monthly: {
    revenueData: [
      { month: 'Jan', totalRevenue: 45000, cumulativeRevenue: 45000 },
      { month: 'Feb', totalRevenue: 52000, cumulativeRevenue: 97000 },
      { month: 'Mar', totalRevenue: 48000, cumulativeRevenue: 145000 },
      { month: 'Apr', totalRevenue: 61000, cumulativeRevenue: 206000 },
      { month: 'May', totalRevenue: 55000, cumulativeRevenue: 261000 },
      { month: 'Jun', totalRevenue: 67000, cumulativeRevenue: 328000 },
      { month: 'Jul', totalRevenue: 72000, cumulativeRevenue: 400000 },
      { month: 'Aug', totalRevenue: 69000, cumulativeRevenue: 469000 },
      { month: 'Sep', totalRevenue: 78000, cumulativeRevenue: 547000 },
      { month: 'Oct', totalRevenue: 82000, cumulativeRevenue: 629000 },
    ],
    customerInsights: {
      retentionRate: { value: 76, change: 2.5, increased: true },
      churnRate: { value: 12, change: 1.8, increased: false },
      avgAppointmentsPerDay: { value: 24, change: 3.2, increased: true },
      pageViews: { value: 1450, change: 5.7, increased: true },
      newCustomers: { value: 45, change: 2.9, increased: true },
      averageBill: { value: 1250, change: 3.1, increased: true },
      totalRevenue: { value: '₹ 89,648', change: 2.3, increased: true },
      totalAppointments: { value: '517', change: 1.2, increased: true }
    }
  },
  quarterly: {
    revenueData: [
      { month: 'Q1', totalRevenue: 145000, cumulativeRevenue: 145000 },
      { month: 'Q2', totalRevenue: 183000, cumulativeRevenue: 328000 },
      { month: 'Q3', totalRevenue: 219000, cumulativeRevenue: 547000 },
      { month: 'Q4', totalRevenue: 82000, cumulativeRevenue: 629000 },
    ],
    customerInsights: {
      retentionRate: { value: 79, change: 3.5, increased: true },
      churnRate: { value: 10, change: 2.8, increased: false },
      avgAppointmentsPerDay: { value: 26, change: 4.2, increased: true },
      pageViews: { value: 4350, change: 8.7, increased: true },
      newCustomers: { value: 115, change: 4.9, increased: true },
      averageBill: { value: 1350, change: 5.1, increased: true },
      totalRevenue: { value: '₹ 629,000', change: 5.3, increased: true },
      totalAppointments: { value: '1,824', change: 3.2, increased: true }
    }
  },
  yearly: {
    revenueData: [
      { month: '2020', totalRevenue: 520000, cumulativeRevenue: 520000 },
      { month: '2021', totalRevenue: 580000, cumulativeRevenue: 1100000 },
      { month: '2022', totalRevenue: 670000, cumulativeRevenue: 1770000 },
      { month: '2023', totalRevenue: 720000, cumulativeRevenue: 2490000 },
      { month: '2024', totalRevenue: 629000, cumulativeRevenue: 3119000 },
    ],
    customerInsights: {
      retentionRate: { value: 81, change: 4.5, increased: true },
      churnRate: { value: 8, change: 3.8, increased: false },
      avgAppointmentsPerDay: { value: 25, change: 2.2, increased: true },
      pageViews: { value: 15450, change: 12.7, increased: true },
      newCustomers: { value: 320, change: 7.9, increased: true },
      averageBill: { value: 1450, change: 6.1, increased: true },
      totalRevenue: { value: '₹ 3,119,000', change: 7.3, increased: true },
      totalAppointments: { value: '6,240', change: 5.2, increased: true }
    }
  },
  custom: {
    // This will be populated with data for custom date range
    revenueData: [],
    customerInsights: {
      retentionRate: { value: 0, change: 0, increased: true },
      churnRate: { value: 0, change: 0, increased: false },
      avgAppointmentsPerDay: { value: 0, change: 0, increased: true },
      pageViews: { value: 0, change: 0, increased: true },
      newCustomers: { value: 0, change: 0, increased: true },
      averageBill: { value: 0, change: 0, increased: true },
      totalRevenue: { value: '₹ 0', change: 0, increased: true },
      totalAppointments: { value: '0', change: 0, increased: true }
    }
  }
};

// Dropdown menu component
function Dropdown({ options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {options.find(opt => opt.value === selected)?.icon}
          <span className="ml-2">{options.find(opt => opt.value === selected)?.label}</span>
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.icon}
              <span className="ml-2">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to generate realistic mock data for custom date range
function generateCustomData(startDate, endDate) {
  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate days difference
  const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  // Generate revenue data points - create points for each day if less than 10 days,
  // otherwise create equally spaced points
  let revenueData = [];
  let cumulativeRevenue = 0;
  
  if (daysDifference <= 10) {
    // Create a data point for each day
    for (let i = 0; i < daysDifference; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Generate realistic daily revenue (between 8000 and 15000)
      const dailyRevenue = Math.floor(800 + Math.random() * 700);
      cumulativeRevenue += dailyRevenue;
      
      revenueData.push({
        month: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalRevenue: dailyRevenue,
        cumulativeRevenue: cumulativeRevenue
      });
    }
  } else {
    // For longer periods, create equally spaced points
    const interval = Math.ceil(daysDifference / 7); // Create about 7 data points
    
    for (let i = 0; i < daysDifference; i += interval) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Generate period revenue (scaled by the number of days in this interval)
      const daysInThisInterval = Math.min(interval, daysDifference - i);
      const periodRevenue = Math.floor(daysInThisInterval * (8000 + Math.random() * 2000));
      cumulativeRevenue += periodRevenue;
      
      revenueData.push({
        month: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalRevenue: periodRevenue,
        cumulativeRevenue: cumulativeRevenue
      });
    }
    
    // Always include the end date as the last point if it's not already included
    const lastPoint = revenueData[revenueData.length - 1];
    const lastPointDate = new Date(lastPoint.month);
    if (lastPointDate.getDate() !== end.getDate() || lastPointDate.getMonth() !== end.getMonth()) {
      const finalPeriodRevenue = Math.floor(interval * (8000 + Math.random() * 2000));
      cumulativeRevenue += finalPeriodRevenue;
      
      revenueData.push({
        month: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalRevenue: finalPeriodRevenue,
        cumulativeRevenue: cumulativeRevenue
      });
    }
  }
  
  // Generate realistic customer insights based on the date range
  const customerInsights = {
    retentionRate: { 
      value: Math.floor(75 + Math.random() * 10), 
      change: +(2 + Math.random() * 4).toFixed(1), 
      increased: Math.random() > 0.2 // 80% chance of being increased
    },
    churnRate: { 
      value: Math.floor(5 + Math.random() * 10), 
      change: +(1 + Math.random() * 3).toFixed(1), 
      increased: Math.random() > 0.7 // 30% chance of being increased (which is bad for churn)
    },
    avgAppointmentsPerDay: { 
      value: Math.floor(20 + Math.random() * 10), 
      change: +(1 + Math.random() * 5).toFixed(1), 
      increased: Math.random() > 0.2
    },
    pageViews: { 
      value: Math.floor(300 + Math.random() * 3000), 
      change: +(3 + Math.random() * 10).toFixed(1), 
      increased: Math.random() > 0.1
    },
    newCustomers: { 
      value: Math.floor(10 + daysDifference * (1 + Math.random())), 
      change: +(2 + Math.random() * 6).toFixed(1), 
      increased: Math.random() > 0.2
    },
    averageBill: { 
      value: Math.floor(1000 + Math.random() * 500), 
      change: +(1 + Math.random() * 5).toFixed(1), 
      increased: Math.random() > 0.2
    },
    totalRevenue: { 
      value: `₹ ${cumulativeRevenue.toLocaleString()}`, 
      change: +(2 + Math.random() * 6).toFixed(1), 
      increased: Math.random() > 0.1
    },
    totalAppointments: { 
      value: Math.floor(daysDifference * (15 + Math.random() * 10)).toLocaleString(), 
      change: +(1 + Math.random() * 4).toFixed(1), 
      increased: Math.random() > 0.2
    }
  };
  
  return {
    revenueData,
    customerInsights
  };
}

export default function SalonDashboard() {
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [currentData, setCurrentData] = useState(allData.monthly);
  const [customDateApplied, setCustomDateApplied] = useState(false);

  // Time filter options for dropdown
  const timeFilterOptions = [
    { value: 'weekly', label: 'Daily', icon: <Calendar size={16} /> },
    { value: 'monthly', label: 'Monthly', icon: <CalendarDays size={16} /> },
    { value: 'quarterly', label: 'Quarterly', icon: <CalendarRange size={16} /> },
    { value: 'yearly', label: 'Yearly', icon: <CalendarRange size={16} /> },
    { value: 'custom', label: 'Custom Date Range', icon: <FilterIcon size={16} /> },
  ];

  // Update data when filter changes
  useEffect(() => {
    if (timeFilter !== 'custom') {
      setCurrentData(allData[timeFilter]);
      setCustomDateApplied(false);
    }
  }, [timeFilter]);

  // Handle custom date range change
  const handleDateRangeChange = (startDate, endDate) => {
    // If we have a valid date range
    if (startDate && endDate) {
      // Generate custom data based on the selected date range
      const generatedData = generateCustomData(startDate, endDate);
      
      // Update the data state
      allData.custom = generatedData;
      setCurrentData(generatedData);
      setCustomDateApplied(true);
    }
  };

  // Handle time filter change
  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen w-[1400px]">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-800">
            Growth Dashboard
          </h1>
          
          {/* Filter Controls */}
          <div className="flex items-center space-x-4">
            <Dropdown 
              options={timeFilterOptions}
              selected={timeFilter}
              onChange={handleTimeFilterChange}
            />
            
            {timeFilter === 'custom' && (
              <CustomDateRangeComponent onDateRangeChange={handleDateRangeChange} />
            )}
          </div>
        </div>

        {/* Grid layout for all insight cards - 4 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <InsightCard 
            icon={<IndianRupee size={20} />} 
            title="Total Revenue" 
            value={currentData.customerInsights.totalRevenue.value} 
            change={currentData.customerInsights.totalRevenue.change} 
            increased={currentData.customerInsights.totalRevenue.increased} 
          />
          <InsightCard 
            icon={<Users size={20} />} 
            title="Total Appointments" 
            value={currentData.customerInsights.totalAppointments.value} 
            change={currentData.customerInsights.totalAppointments.change} 
            increased={currentData.customerInsights.totalAppointments.increased} 
          />
          <InsightCard 
            icon={<Users size={20} />} 
            title="Customer Retention Rate" 
            value={`${currentData.customerInsights.retentionRate.value}%`} 
            change={`${currentData.customerInsights.retentionRate.change}pts` }
            increased={currentData.customerInsights.retentionRate.increased} 
          />
          <InsightCard 
            icon={<UserPlus size={20} />} 
            title="Churn Rate" 
            value={`${currentData.customerInsights.churnRate.value}%`} 
            change={`${currentData.customerInsights.churnRate.change}pts` }
            increased={currentData.customerInsights.churnRate.increased} 
          />
          <InsightCard 
            icon={<Clock size={20} />} 
            title="Avg. Appointments Per Day" 
            value={currentData.customerInsights.avgAppointmentsPerDay.value} 
            change={currentData.customerInsights.avgAppointmentsPerDay.change} 
            increased={currentData.customerInsights.avgAppointmentsPerDay.increased} 
          />
          <InsightCard 
            icon={<Activity size={20} />} 
            title="Salon Page Views" 
            value={currentData.customerInsights.pageViews.value} 
            change={currentData.customerInsights.pageViews.change} 
            increased={currentData.customerInsights.pageViews.increased} 
          />
          <InsightCard 
            icon={<UserPlus size={20} />} 
            title="New Customers This Period" 
            value={currentData.customerInsights.newCustomers.value} 
            change={currentData.customerInsights.newCustomers.change} 
            increased={currentData.customerInsights.newCustomers.increased} 
          />
          <InsightCard 
            icon={<IndianRupee size={20} />} 
            title="Average Bill" 
            value={`₹ ${currentData.customerInsights.averageBill.value}`} 
            change={currentData.customerInsights.averageBill.change} 
            increased={currentData.customerInsights.averageBill.increased} 
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Analysis</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#3B82F6" 
                  name="Period Revenue" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeRevenue" 
                  stroke="#EC4899" 
                  name="Cumulative Revenue" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side by side Top Categories and Conversion Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Categories */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Categories</h2>
            <TopCategories timeFilter={timeFilter} customDateApplied={customDateApplied} />
          </div>

          {/* Funnel Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversion Funnel</h2>
            <ConversionFunnel timeFilter={timeFilter} customDateApplied={customDateApplied} />
          </div>
        </div>
      </div>
    </div>
  );
}