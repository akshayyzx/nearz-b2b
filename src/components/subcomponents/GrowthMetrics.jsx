import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Search, Users, User, UserPlus, Clock, DollarSign, Activity,IndianRupee
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

// Mock data for revenue chart
const revenueData = [
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
];

// Customer insights data
const customerInsightsData = {
  retentionRate: { value: 76, change: 2.5, increased: true },
  churnRate: { value: 12, change: 1.8, increased: false },
  avgAppointmentsPerDay: { value: 24, change: 3.2, increased: true },
  pageViews: { value: 1450, change: 5.7, increased: true },
  newCustomers: { value: 45, change: 2.9, increased: true },
  averageBill: { value: 1250, change: 3.1, increased: true }
};

export default function SalonDashboard() {
  const [timeFilter, setTimeFilter] = useState('Monthly');

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
        </div>

        {/* <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total income</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold text-gray-800">₹ 89,648</h2>
              <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-0.5 rounded">2.3% ↑</span>
            </div>
            <div className="mt-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line type="monotone" dataKey="totalRevenue" stroke="#4F46E5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total clients</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold text-gray-800">517</h2>
              <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-0.5 rounded">1.2% ↑</span>
            </div>
            <div className="mt-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <Line type="monotone" dataKey="totalRevenue" stroke="#4F46E5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}

        {/* Customer Insights Cards - 8 cards in 2 rows of 4 */}
       {/* Grid layout for all insight cards - 4 cards per row */}
<div className="grid grid-cols-4 gap-4 mb-6">
<InsightCard 
  icon={<IndianRupee size={20} />} 
  title="Total Income" 
  value="₹ 89,648" 
  change="2.3" 
  increased={true} 
/>
    <InsightCard 
    icon={<Users size={20} />} 
    title="Total Clients" 
    value="517" 
    change="1.2" 
    increased={true} 
  />
  <InsightCard 
    icon={<Users size={20} />} 
    title="Customer Retention Rate" 
    value={`${customerInsightsData.retentionRate.value}%`} 
    change={customerInsightsData.retentionRate.change} 
    increased={customerInsightsData.retentionRate.increased} 
  />
  
  <InsightCard 
    icon={<UserPlus size={20} />} 
    title="Churn Rate" 
    value={`${customerInsightsData.churnRate.value}%`} 
    change={customerInsightsData.churnRate.change} 
    increased={customerInsightsData.churnRate.increased} 
  />
  
  <InsightCard 
    icon={<Clock size={20} />} 
    title="Avg. Appointments Per Day" 
    value={customerInsightsData.avgAppointmentsPerDay.value} 
    change={customerInsightsData.avgAppointmentsPerDay.change} 
    increased={customerInsightsData.avgAppointmentsPerDay.increased} 
  />
  
  <InsightCard 
    icon={<Activity size={20} />} 
    title="Salon Page Views" 
    value={customerInsightsData.pageViews.value} 
    change={customerInsightsData.pageViews.change} 
    increased={customerInsightsData.pageViews.increased} 
  />

  <InsightCard 
    icon={<UserPlus size={20} />} 
    title="New Customers This Month" 
    value={customerInsightsData.newCustomers.value} 
    change={customerInsightsData.newCustomers.change} 
    increased={customerInsightsData.newCustomers.increased} 
  />
  
  <InsightCard 
    icon={<IndianRupee size={20} />} 
    title="Average Bill" 
    value={`₹ ${customerInsightsData.averageBill.value}`} 
    change={customerInsightsData.averageBill.change} 
    increased={customerInsightsData.averageBill.increased} 
  />
</div>
 {/* Revenue Chart - Replaced Salon Analytics with Revenue Chart */}
 <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Analysis</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#3B82F6" 
                  name="Monthly Revenue" 
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