import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Mock data with consistent colors
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
  // Using only 'All time' data without filters
  const data = mockData['All time'];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Top 5 Popular Services</h2>
        </div>

        {/* Increased chart height and made it full width */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
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
                className="text-xl font-semibold text-gray-700"
              >
                {total}%
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend moved below chart */}
        <div className="mt-6 flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="text-sm">
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-gray-500">{item.value}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}