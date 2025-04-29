import React from 'react';
import { Search, Calendar, Users, FileText, BarChart2, Users as UsersIcon, Layout, FileText as FileTextIcon, Monitor, Settings, Bell, MessageSquare, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

// Component for sidebar items
export function SidebarItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center space-x-3 px-4 py-3 ${active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'} cursor-pointer transition-colors`}>
      <div>{icon}</div>
      <span>{label}</span>
    </div>
  );
}

// Component for stats cards
export function StatsCard({ title, value, change }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm h-full">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <span className={`ml-2 flex items-center text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}

// Component for dropdown
export function Dropdown({ label }) {
  return (
    <button className="flex items-center space-x-1 text-sm text-gray-500 bg-white border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <span>{label}</span>
      <ChevronDown size={14} />
    </button>
  );
}

// Component for sortable table headers
export function SortableTableHeader({ label }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <div className="w-3 h-1 bg-gray-300"></div>
          <div className="w-3 h-1 bg-gray-300 mt-0.5"></div>
        </div>
      </div>
    </th>
  );
}

// Custom tooltip components for charts
export function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="text-gray-600 text-sm font-medium">{payload[0].payload.day || payload[0].payload.month}</p>
        <p className="text-lg font-bold text-cyan-500">{payload[0].value}</p>
      </div>
    );
  }
  return null;
}

export function CustomBarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="text-gray-600 text-sm font-medium">{payload[0].payload.name}</p>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
          <p className="text-sm font-medium">Male: {payload[0].payload.male}</p>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-cyan-400 mr-2"></div>
          <p className="text-sm font-medium">Female: {payload[0].payload.female}</p>
        </div>
      </div>
    );
  }
  return null;
}

export function CustomRevenueTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="text-gray-600 text-sm font-medium">{payload[0].payload.month}</p>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-700 mr-2"></div>
          <p className="text-sm font-medium">Revenue: ${payload[0].payload.revenue}k</p>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <p className="text-sm font-medium">Expenses: ${payload[0].payload.expenses}k</p>
        </div>
      </div>
    );
  }
  return null;
}