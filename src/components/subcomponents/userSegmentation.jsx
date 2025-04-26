import React, { useState } from 'react';

export default function RFMSegmentsTreemap() {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const segments = [
    { id: 1, name: "Hibernating", value: 19053, percent: "30%", color: "#93C5FD", gridArea: "4 / 1 / 5 / 3", recency: 1, frequency: 2, monetary: 2 },
    { id: 2, name: "Need Attention", value: 8741, percent: "14%", color: "#F97316", gridArea: "3 / 3 / 4 / 4", recency: 3, frequency: 2, monetary: 2 },
    { id: 3, name: "Loyal Customers", value: 8603, percent: "14%", color: "#0AA3E7", gridArea: "1 / 2 / 2 / 4", recency: 2, frequency: 5, monetary: 4 },
    { id: 4, name: "Champions", value: 7960, percent: "13%", color: "#24D2BD", gridArea: "1 / 4 / 2 / 6", recency: 4, frequency: 5, monetary: 5 },
    { id: 5, name: "At Risk", value: 4954, percent: "8%", color: "#FCA5A5", gridArea: "2 / 1 / 3 / 3", recency: 1, frequency: 4, monetary: 3 },
    { id: 6, name: "Potential Loyalist", value: 4569, percent: "7%", color: "#24AE60", gridArea: "2 / 4 / 4 / 6", recency: 3, frequency: 3, monetary: 3 },
    { id: 7, name: "Promising", value: 4546, percent: "7%", color: "#F9B42A", gridArea: "3 / 4 / 4 / 5", recency: 4, frequency: 1, monetary: 1 },
    { id: 8, name: "New Customers", value: 2672, percent: "4%", color: "#A7F3D0", gridArea: "4 / 4 / 5 / 6", recency: 5, frequency: 1, monetary: 1 },
    { id: 9, name: "Can't lose them", value: 954, percent: "2%", color: "#F9B42A", gridArea: "1 / 1 / 2 / 2", recency: 1, frequency: 5, monetary: 5 },
    { id: 10, name: "About to Sleep", value: 480, percent: "1%", color: "#E34141", gridArea: "3 / 1 / 4 / 2", recency: 3, frequency: 1, monetary: 3 },
  ];

  const generateRandomCustomers = (segmentId, count = 5) => {
    const segment = segments.find(s => s.id === segmentId);
    return Array.from({ length: count }, (_, i) => ({
      id: `CUST-${segmentId}-${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      orders: Math.floor(Math.random() * 20) + 1,
      revenue: Math.floor(Math.random() * 10000) + 500,
      lastOrderDays: Math.floor(Math.random() * 900) + 30,
      segment: segment?.name || "Unknown"
    }));
  };

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
    setShowTable(true);
  };

  const customerData = selectedSegment ? generateRandomCustomers(selectedSegment.id) : [];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow overflow-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">RFM Segments</h1>
          <p className="text-gray-700 max-w-3xl mt-2">
            RFM stands for <span className="font-semibold">Recency</span>, <span className="font-semibold">Frequency</span>, and <span className="font-semibold">Monetary</span> value. Customers are grouped by these scores into segments to better understand their behavior.
          </p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-bold">62,532</div>
          <div className="text-2xl text-gray-600">customers</div>
        </div>
      </div>

      <div className="grid grid-cols-5 grid-rows-4 gap-1 h-96 mb-8">
        {segments.map(segment => (
          <div
          key={segment.id}
          style={{
            backgroundColor: segment.color,
            gridArea: segment.gridArea,
          }}
          className="relative rounded-xl p-4 text-white font-medium shadow-md cursor-pointer transition-transform duration-200 ease-in-out hover:z-10 hover:scale-105 group"
          onClick={() => handleSegmentClick(segment)}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-bold">{segment.name}</h3>
              <p className="text-3xl font-extrabold">{segment.percent}</p>
            </div>
            <div className="text-right text-lg">
              <p>{segment.value.toLocaleString()}</p>
            </div>
          </div>
        
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-70 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <div className="text-white text-center space-y-2">
              <h4 className="text-xl font-semibold">{segment.name}</h4>
              <p>{segment.value.toLocaleString()} customers ({segment.percent})</p>
              <div className="flex justify-center gap-3 mt-2">
                <div className="bg-white/20 px-2 py-1 rounded-md text-sm">
                  <p className="font-bold">R</p>
                  <p>{segment.recency}/5</p>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-md text-sm">
                  <p className="font-bold">F</p>
                  <p>{segment.frequency}/5</p>
                </div>
                <div className="bg-white/20 px-2 py-1 rounded-md text-sm">
                  <p className="font-bold">M</p>
                  <p>{segment.monetary}/5</p>
                </div>
              </div>
              <p className="text-sm mt-1">(Click to view sample customers)</p>
            </div>
          </div>
          </div>
        ))}
      </div>

      {/* Simplified Legend */}
      <div className="flex flex-wrap gap-6 mt-6 mb-10">
        {segments.map(segment => (
          <div key={`legend-${segment.id}`} className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: segment.color }}></div>
            <span className="text-sm font-medium">{segment.name}</span>
          </div>
        ))}
      </div>

      {showTable && selectedSegment && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              <span className="inline-block w-4 h-4 rounded mr-2" style={{ backgroundColor: selectedSegment.color }}></span>
              {selectedSegment.name} Segment - Sample Customers
            </h2>
            <button 
              onClick={() => setShowTable(false)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Close
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border text-left">Customer ID</th>
                  <th className="py-2 px-4 border text-left">Name</th>
                  <th className="py-2 px-4 border text-left">Email</th>
                  <th className="py-2 px-4 border text-right">Orders</th>
                  <th className="py-2 px-4 border text-right">Revenue</th>
                  <th className="py-2 px-4 border text-right">Last Order (days)</th>
                </tr>
              </thead>
              <tbody>
                {customerData.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{customer.id}</td>
                    <td className="py-2 px-4 border">{customer.name}</td>
                    <td className="py-2 px-4 border">{customer.email}</td>
                    <td className="py-2 px-4 border text-right">{customer.orders}</td>
                    <td className="py-2 px-4 border text-right">${customer.revenue.toLocaleString()}</td>
                    <td className="py-2 px-4 border text-right">{customer.lastOrderDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
  