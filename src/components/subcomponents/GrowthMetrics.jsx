import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Search, Calendar, Users, FileText, BarChart2, Layout, 
  Settings, Bell, MessageSquare, ChevronDown, ArrowUp, ArrowDown 
} from 'lucide-react';

// Import mock data
import {
  salesByDaysData,
  expenseBreakdownData,
  servicesCategoryData,
  customersData,
  revenueVsExpensesData,
  salesHistoryData,
  salesFunnelData
} from '../../utils/growthMockData.js';

// Device distribution data for pie chart
const serviceTypeData = [
  { name: 'Hair Services', value: 60, color: '#2563eb' },
  { name: 'Facial Services', value: 30, color: '#06b6d4' },
  { name: 'Nail Services', value: 10, color: '#e5e7eb' }
];

// Audience data
const clientAgeData = [
  { age: '18-24', percentage: 10.3, female: 30, male: 50, unknown: 20 },
  { age: '25-34', percentage: 24.3, female: 15, male: 60, unknown: 25 },
  { age: '35-44', percentage: 19.9, female: 10, male: 60, unknown: 30 },
  { age: '45-64', percentage: 18.4, female: 20, male: 50, unknown: 30 },
  { age: '65+', percentage: 7.5, female: 25, male: 65, unknown: 10 }
];

// Component for sidebar items
function SidebarItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center space-x-3 px-4 py-3 ${active ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'} cursor-pointer transition-colors rounded-lg`}>
      <div>{icon}</div>
      <span className="font-medium">{label}</span>
    </div>
  );
}

export default function SalonDashboard() {
  const [timeFilter, setTimeFilter] = useState('Monthly');

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      {/* <div className="w-64 bg-white shadow-sm p-4 flex flex-col">
        <div className="flex items-center space-x-2 px-2 py-4">
          <div className="bg-pink-600 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">SalonRadar</h1>
        </div>

        <div className="space-y-1 mt-6">
          <SidebarItem icon={<Layout size={20} />} label="Dashboard" active={true} />
          <SidebarItem icon={<FileText size={20} />} label="Services" />
          <SidebarItem icon={<Users size={20} />} label="Clients" />
          <SidebarItem icon={<BarChart2 size={20} />} label="Statistics" />
          <SidebarItem icon={<FileText size={20} />} label="Reports" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </div>

        <div className="mt-auto">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-4 text-white">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-white bg-opacity-20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="ml-2 font-semibold">Premium plan</h3>
            </div>
            <p className="text-sm text-white text-opacity-90">Get access to advanced SalonRadar features</p>
            <button className="mt-4 w-full bg-white text-pink-600 font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
              Upgrade now!
            </button>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 p-8 w-200% w-[1300px]">
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
          
          <div className="flex items-center space-x-4">
            {/* <button className="p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button> */}
            {/* <button className="p-2 text-gray-500 hover:text-gray-700">
              <MessageSquare size={20} />
            </button> */}
            <div className="flex items-center space-x-2">
              {/* <div className="h-10 w-10 bg-blue-500 rounded-full overflow-hidden">
                <img src="/api/placeholder/100/100" alt="Avatar" className="h-full w-full object-cover" />
              </div> */}
              <div>
                {/* <p className="text-sm font-medium">Emma Watson</p> */}
                {/* <p className="text-xs text-gray-500">Salon Manager</p> */}
              </div>
              {/* <ChevronDown size={16} className="text-gray-500" /> */}
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-3 gap-6 mb-6">
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
                <LineChart data={revenueVsExpensesData}>
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total profit</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold text-gray-800">₹ 52,994</h2>
              <span className="text-xs font-medium text-red-500 bg-red-100 px-2 py-0.5 rounded">1.2% ↓</span>
            </div>
            <div className="mt-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueVsExpensesData}>
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} dot={false} />
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
                <LineChart data={revenueVsExpensesData}>
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Salon Analytics */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Salon analytics</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueVsExpensesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Income" />
                  <Bar dataKey="expenses" fill="#EC4899" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Geography */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Orders geography</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-4 bg-red-500 mr-2 rounded"></span>
                    <span className="text-sm font-medium">Downtown</span>
                  </div>
                  <span className="text-sm font-medium">33%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-4 bg-blue-500 mr-2 rounded"></span>
                    <span className="text-sm font-medium">Uptown</span>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-4 bg-red-400 mr-2 rounded"></span>
                    <span className="text-sm font-medium">Midtown</span>
                  </div>
                  <span className="text-sm font-medium">22%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-4 bg-green-500 mr-2 rounded"></span>
                    <span className="text-sm font-medium">Suburbs</span>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Top categories</h2>
              <div className="flex space-x-2">
                <button className={`px-4 py-1 text-sm rounded-lg ${timeFilter === 'All time' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => setTimeFilter('All time')}>
                  All time
                </button>
                <button className={`px-4 py-1 text-sm rounded-lg ${timeFilter === 'Weekly' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`} onClick={() => setTimeFilter('Weekly')}>
                  Weekly
                </button>
                <button className={`px-4 py-1 text-sm rounded-lg ${timeFilter === 'Monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`} onClick={() => setTimeFilter('Monthly')}>
                  Monthly
                </button>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-1/3">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Hair Services', value: 18, color: '#60A5FA' },  
                        { name: 'Facials', value: 25, color: '#F87171' },
                        { name: 'Manicure', value: 30, color: '#34D399' },
                        { name: 'Pedicure', value: 15, color: '#A78BFA' },
                        { name: 'Waxing', value: 12, color: '#FBBF24' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={1}
                      dataKey="value"
                    >
                      {[
                        { name: 'Hair Services', value: 18, color: '#60A5FA' },  
                        { name: 'Facials', value: 25, color: '#F87171' },
                        { name: 'Manicure', value: 30, color: '#34D399' },
                        { name: 'Pedicure', value: 15, color: '#A78BFA' },
                        { name: 'Waxing', value: 12, color: '#FBBF24' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold">
                      18%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-2/3 pl-8 flex items-center">
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Hair Services</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Facials</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Manicure</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Pedicure</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <span className="text-sm text-gray-700">Waxing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Premium Haircut</div>
                      <div className="text-sm text-gray-500">Women's haircut</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$114.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">124</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$14,136.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Luxury Facial</div>
                      <div className="text-sm text-gray-500">Deep cleansing</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$140.90</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">76</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$10,708.40</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Deluxe Manicure</div>
                      <div className="text-sm text-gray-500">With nail art</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$85.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">54</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$4,617.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Spa Pedicure</div>
                      <div className="text-sm text-gray-500">With massage</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$230.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">68</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$15,640.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}