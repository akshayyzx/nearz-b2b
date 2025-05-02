import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Search, Users, User, UserPlus, Clock, DollarSign, Activity, IndianRupee,
  Calendar, ChevronDown
} from 'lucide-react';

import TopCategories from '../../utils/topCategories.jsx';
import ConversionFunnel from '../../utils/coversionFunnel.jsx';

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

// Date filter dropdown component
function DateFilterDropdown({ selectedFilter, setSelectedFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedFilter} 
        <ChevronDown size={16} className="ml-2" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-40 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            <li 
              onClick={() => handleFilterChange('Daily')}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Daily
            </li>
            <li 
              onClick={() => handleFilterChange('Weekly')}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Weekly
            </li>
            <li 
              onClick={() => handleFilterChange('Monthly')}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Monthly
            </li>
            <li 
              onClick={() => handleFilterChange('Yearly')}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Yearly
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Improved date range picker component
function DateRangePicker({ dateRange, setDateRange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState({
    start: dateRange.start || '',
    end: dateRange.end || ''
  });
  
  const handleApply = () => {
    setDateRange(tempDateRange);
    setIsOpen(false);
  };
  
  const formatDisplayDate = () => {
    if (dateRange.start && dateRange.end) {
      return `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`;
    }
    return 'Select date range';
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Calendar size={16} className="mr-2" />
        <span>{formatDisplayDate()}</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-20 p-4 bg-white border border-gray-300 rounded-md shadow-lg w-72 -ml-20">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Select Date Range</h3>
          <div className="flex flex-col space-y-3">
            <div>
              <label className="block text-xs text-gray-500">Start Date</label>
              <input 
                type="date" 
                value={tempDateRange.start}
                onChange={(e) => setTempDateRange({...tempDateRange, start: e.target.value})}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">End Date</label>
              <input 
                type="date"
                value={tempDateRange.end}
                onChange={(e) => setTempDateRange({...tempDateRange, end: e.target.value})}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
                min={tempDateRange.start} // Prevent selecting end date before start date
              />
            </div>
            
            {/* Quick selection buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  const today = new Date();
                  const lastWeek = new Date();
                  lastWeek.setDate(today.getDate() - 7);
                  setTempDateRange({
                    start: lastWeek.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                  });
                }}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Last 7 days
              </button>
              <button 
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date();
                  lastMonth.setMonth(today.getMonth() - 1);
                  setTempDateRange({
                    start: lastMonth.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                  });
                }}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Last 30 days
              </button>
              <button 
                onClick={() => {
                  const today = new Date();
                  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                  setTempDateRange({
                    start: thisMonthStart.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                  });
                }}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                This Month
              </button>
              <button 
                onClick={() => {
                  const today = new Date();
                  const thisYearStart = new Date(today.getFullYear(), 0, 1);
                  setTempDateRange({
                    start: thisYearStart.toISOString().split('T')[0],
                    end: today.toISOString().split('T')[0]
                  });
                }}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                This Year
              </button>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={!tempDateRange.start || !tempDateRange.end}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// All data sets
const dataSets = {
  daily: {
    revenue: [
      { label: '22 Apr', totalRevenue: 4200, cumulativeRevenue: 4200 },
      { label: '23 Apr', totalRevenue: 3800, cumulativeRevenue: 8000 },
      { label: '24 Apr', totalRevenue: 4500, cumulativeRevenue: 12500 },
      { label: '25 Apr', totalRevenue: 5100, cumulativeRevenue: 17600 },
      { label: '26 Apr', totalRevenue: 4900, cumulativeRevenue: 22500 },
      { label: '27 Apr', totalRevenue: 5800, cumulativeRevenue: 28300 },
      { label: '28 Apr', totalRevenue: 6200, cumulativeRevenue: 34500 },
      { label: '29 Apr', totalRevenue: 5600, cumulativeRevenue: 40100 },
      { label: '30 Apr', totalRevenue: 5900, cumulativeRevenue: 46000 },
      { label: '01 May', totalRevenue: 6100, cumulativeRevenue: 52100 },
    ],
    insights: {
      totalIncome: { value: "₹ 6,100", change: "3.4", increased: true },
      totalClients: { value: "45", change: "2.8", increased: true },
      retentionRate: { value: 78, change: 3.2, increased: true },
      churnRate: { value: 11, change: 2.1, increased: false },
      avgAppointmentsPerDay: { value: 26, change: 4.5, increased: true },
      pageViews: { value: 180, change: 6.2, increased: true },
      newCustomers: { value: 7, change: 3.5, increased: true },
      averageBill: { value: 1350, change: 2.9, increased: true }
    }
  },
  weekly: {
    revenue: [
      { label: 'Week 1', totalRevenue: 18200, cumulativeRevenue: 18200 },
      { label: 'Week 2', totalRevenue: 19400, cumulativeRevenue: 37600 },
      { label: 'Week 3', totalRevenue: 17800, cumulativeRevenue: 55400 },
      { label: 'Week 4', totalRevenue: 21500, cumulativeRevenue: 76900 },
      { label: 'Week 5', totalRevenue: 20300, cumulativeRevenue: 97200 },
      { label: 'Week 6', totalRevenue: 22100, cumulativeRevenue: 119300 },
      { label: 'Week 7', totalRevenue: 23400, cumulativeRevenue: 142700 },
      { label: 'Week 8', totalRevenue: 21900, cumulativeRevenue: 164600 },
    ],
    insights: {
      totalIncome: { value: "₹ 21,900", change: "2.1", increased: false },
      totalClients: { value: "162", change: "1.8", increased: true },
      retentionRate: { value: 77, change: 2.8, increased: true },
      churnRate: { value: 11.5, change: 1.5, increased: false },
      avgAppointmentsPerDay: { value: 25, change: 3.8, increased: true },
      pageViews: { value: 950, change: 4.9, increased: true },
      newCustomers: { value: 22, change: 2.6, increased: true },
      averageBill: { value: 1290, change: 2.5, increased: true }
    }
  },
  monthly: {
    revenue: [
      { label: 'Jan', totalRevenue: 45000, cumulativeRevenue: 45000 },
      { label: 'Feb', totalRevenue: 52000, cumulativeRevenue: 97000 },
      { label: 'Mar', totalRevenue: 48000, cumulativeRevenue: 145000 },
      { label: 'Apr', totalRevenue: 61000, cumulativeRevenue: 206000 },
      { label: 'May', totalRevenue: 55000, cumulativeRevenue: 261000 },
      { label: 'Jun', totalRevenue: 67000, cumulativeRevenue: 328000 },
      { label: 'Jul', totalRevenue: 72000, cumulativeRevenue: 400000 },
      { label: 'Aug', totalRevenue: 69000, cumulativeRevenue: 469000 },
      { label: 'Sep', totalRevenue: 78000, cumulativeRevenue: 547000 },
      { label: 'Oct', totalRevenue: 82000, cumulativeRevenue: 629000 },
    ],
    insights: {
      totalIncome: { value: "₹ 82,000", change: "5.1", increased: true },
      totalClients: { value: "517", change: "1.2", increased: true },
      retentionRate: { value: 76, change: 2.5, increased: true },
      churnRate: { value: 12, change: 1.8, increased: false },
      avgAppointmentsPerDay: { value: 24, change: 3.2, increased: true },
      pageViews: { value: 1450, change: 5.7, increased: true },
      newCustomers: { value: 45, change: 2.9, increased: true },
      averageBill: { value: 1250, change: 3.1, increased: true }
    }
  },
  yearly: {
    revenue: [
      { label: '2020', totalRevenue: 580000, cumulativeRevenue: 580000 },
      { label: '2021', totalRevenue: 620000, cumulativeRevenue: 1200000 },
      { label: '2022', totalRevenue: 710000, cumulativeRevenue: 1910000 },
      { label: '2023', totalRevenue: 850000, cumulativeRevenue: 2760000 },
      { label: '2024', totalRevenue: 920000, cumulativeRevenue: 3680000 },
    ],
    insights: {
      totalIncome: { value: "₹ 920,000", change: "8.2", increased: true },
      totalClients: { value: "3245", change: "4.5", increased: true },
      retentionRate: { value: 72, change: 1.8, increased: true },
      churnRate: { value: 15, change: 2.3, increased: false },
      avgAppointmentsPerDay: { value: 22, change: 2.6, increased: true },
      pageViews: { value: "18,650", change: "6.8", increased: true },
      newCustomers: { value: "430", change: "5.2", increased: true },
      averageBill: { value: 1180, change: "2.7", increased: true }
    }
  },
  custom: {
    revenue: [],
    insights: {
      totalIncome: { value: "₹ 0", change: "0", increased: true },
      totalClients: { value: "0", change: "0", increased: true },
      retentionRate: { value: 0, change: 0, increased: true },
      churnRate: { value: 0, change: 0, increased: false },
      avgAppointmentsPerDay: { value: 0, change: 0, increased: true },
      pageViews: { value: 0, change: 0, increased: true },
      newCustomers: { value: 0, change: 0, increased: true },
      averageBill: { value: 0, change: 0, increased: true }
    }
  }
};

export default function SalonDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('Monthly');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentData, setCurrentData] = useState(dataSets.monthly);
  const [isCustomDate, setIsCustomDate] = useState(false);
  
  // Update data when filter changes
  useEffect(() => {
    if (isCustomDate) {
      // In a real app, we would fetch data for the selected date range here
      // For this demo, we'll just use dummy data
      const customData = generateCustomData(dateRange);
      setCurrentData(customData);
    } else {
      // Use predefined data based on filter
      setCurrentData(dataSets[selectedFilter.toLowerCase()]);
    }
  }, [selectedFilter, dateRange, isCustomDate]);
  
  // Generate custom data for date range (simulation)
  const generateCustomData = (range) => {
    if (!range.start || !range.end) return dataSets.custom;
    
    const start = new Date(range.start);
    const end = new Date(range.end);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate random data based on date range
    const revenueData = [];
    let cumulativeRevenue = 0;
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dailyRevenue = Math.floor(Math.random() * 2000) + 3000; // Random revenue between 3000-5000
      cumulativeRevenue += dailyRevenue;
      
      revenueData.push({
        label: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalRevenue: dailyRevenue,
        cumulativeRevenue: cumulativeRevenue
      });
    }
    
    // Calculate total income for the period
    const totalIncome = revenueData.reduce((sum, day) => sum + day.totalRevenue, 0);
    
    return {
      revenue: revenueData,
      insights: {
        totalIncome: { value: `₹ ${totalIncome.toLocaleString()}`, change: (Math.random() * 5 + 1).toFixed(1), increased: Math.random() > 0.3 },
        totalClients: { value: Math.floor(totalIncome / 1200).toString(), change: (Math.random() * 3 + 1).toFixed(1), increased: Math.random() > 0.3 },
        retentionRate: { value: Math.floor(Math.random() * 10 + 70), change: (Math.random() * 3 + 1).toFixed(1), increased: Math.random() > 0.3 },
        churnRate: { value: Math.floor(Math.random() * 5 + 10), change: (Math.random() * 3 + 1).toFixed(1), increased: Math.random() > 0.7 },
        avgAppointmentsPerDay: { value: Math.floor(Math.random() * 10 + 20), change: (Math.random() * 3 + 1).toFixed(1), increased: Math.random() > 0.3 },
        pageViews: { value: Math.floor(Math.random() * 1000 + 500), change: (Math.random() * 5 + 1).toFixed(1), increased: Math.random() > 0.3 },
        newCustomers: { value: Math.floor(Math.random() * 30 + 15), change: (Math.random() * 3 + 1).toFixed(1), increased: Math.random() > 0.3 },
        averageBill: { value: Math.floor(Math.random() * 300 + 1000), change: (Math.random() * 3 + 1).toFixed(1), increased: Math.random() > 0.3 }
      }
    };
  };
  
  // Handle date range selection
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setIsCustomDate(true);
    // Reset filter to indicate we're using custom dates
    setSelectedFilter('Custom');
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-8 w-[1400px]">
        {/* Top Bar */}
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 mb-5">
          Growth Dashboard
        </h1>
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search services, clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          {/* Time Period Filter Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar size={18} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">View By:</span>
            </div>
            
            <DateFilterDropdown 
              selectedFilter={selectedFilter} 
              setSelectedFilter={(filter) => {
                setSelectedFilter(filter);
                setIsCustomDate(false);
              }}
            />
            
            <DateRangePicker 
              dateRange={dateRange}
              setDateRange={handleDateRangeChange}
            />
          </div>
        </div>

        {/* Customer Insights Cards - Grid of 4x2 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <InsightCard 
            icon={<IndianRupee size={20} />} 
            title="Total Income" 
            value={currentData.insights.totalIncome.value} 
            change={currentData.insights.totalIncome.change} 
            increased={currentData.insights.totalIncome.increased} 
          />
          <InsightCard 
            icon={<Users size={20} />} 
            title="Total Clients" 
            value={currentData.insights.totalClients.value} 
            change={currentData.insights.totalClients.change} 
            increased={currentData.insights.totalClients.increased} 
          />
          <InsightCard 
            icon={<Users size={20} />} 
            title="Customer Retention Rate" 
            value={`${currentData.insights.retentionRate.value}%`} 
            change={currentData.insights.retentionRate.change} 
            increased={currentData.insights.retentionRate.increased} 
          />
          <InsightCard 
            icon={<UserPlus size={20} />} 
            title="Churn Rate" 
            value={`${currentData.insights.churnRate.value}%`} 
            change={currentData.insights.churnRate.change} 
            increased={currentData.insights.churnRate.increased} 
          />
          <InsightCard 
            icon={<Clock size={20} />} 
            title="Avg. Appointments Per Day" 
            value={currentData.insights.avgAppointmentsPerDay.value} 
            change={currentData.insights.avgAppointmentsPerDay.change} 
            increased={currentData.insights.avgAppointmentsPerDay.increased} 
          />
          <InsightCard 
            icon={<Activity size={20} />} 
            title="Salon Page Views" 
            value={currentData.insights.pageViews.value} 
            change={currentData.insights.pageViews.change} 
            increased={currentData.insights.pageViews.increased} 
          />
          <InsightCard 
            icon={<UserPlus size={20} />} 
            title="New Customers" 
            value={currentData.insights.newCustomers.value} 
            change={currentData.insights.newCustomers.change} 
            increased={currentData.insights.newCustomers.increased} 
          />
          <InsightCard 
            icon={<IndianRupee size={20} />} 
            title="Average Bill" 
            value={`₹ ${currentData.insights.averageBill.value}`} 
            change={currentData.insights.averageBill.change} 
            increased={currentData.insights.averageBill.increased} 
          />
        </div>
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Analysis ({isCustomDate ? 
              `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}` : 
              selectedFilter})
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#3B82F6" 
                  name={`${selectedFilter} Revenue`} 
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
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Top Categories */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <TopCategories/>
          </div>

          {/* Funnel Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ConversionFunnel/>
          </div>
        </div>
      </div>
    </div>
  );
}