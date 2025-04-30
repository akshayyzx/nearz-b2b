import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// 1. Mock data
const mockData = {
  'All time': [
    { name: 'Hair Services', value: 18, color: '#60A5FA' },
    { name: 'Facials', value: 25, color: '#F87171' },
    { name: 'Manicure', value: 30, color: '#34D399' },
    { name: 'Pedicure', value: 15, color: '#A78BFA' },
    { name: 'Waxing', value: 12, color: '#FBBF24' },
  ],
  'Weekly': [
    { name: 'Hair Services', value: 10, color: '#60A5FA' },
    { name: 'Facials', value: 20, color: '#F87171' },
    { name: 'Manicure', value: 35, color: '#34D399' },
    { name: 'Pedicure', value: 10, color: '#A78BFA' },
    { name: 'Waxing', value: 25, color: '#FBBF24' },
  ],
  'Monthly': [
    { name: 'Hair Services', value: 22, color: '#60A5FA' },
    { name: 'Facials', value: 28, color: '#F87171' },
    { name: 'Manicure', value: 25, color: '#34D399' },
    { name: 'Pedicure', value: 15, color: '#A78BFA' },
    { name: 'Waxing', value: 10, color: '#FBBF24' },
  ],
};

export default function TopCategories() {
  const [timeFilter, setTimeFilter] = useState("All time");
  const data = mockData[timeFilter];
  
  return (
    <div className="mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Top categories</h2>
          <div className="flex space-x-2">
            {['All time', 'Weekly', 'Monthly'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-1 text-sm rounded-lg ${
                  timeFilter === filter
                    ? filter === 'Monthly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row h-80">
          <div className="w-full md:w-2/3 h-full flex items-center justify-center">
            <ResponsiveContainer width="120%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold"
                >
                  {data.reduce((sum, item) => sum + item.value, 0)}%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-2/3 pl-0 md:pl-8 flex items-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}