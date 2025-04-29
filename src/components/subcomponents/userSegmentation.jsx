import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function RFMSegmentsTreemap() {
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  const treemapRef = useRef(null);
  
  const segments = [
    { id: 1, name: "Champions", value: 13, displayValue: 7960, percent: "13%", color: "#2563EB", recency: 5, frequency: 4, monetary: 5, days: 145, gradientFrom: "#1E40AF", gradientTo: "#3B82F6" }, // blue gradient
    { id: 2, name: "Loyal Customers", value: 14, displayValue: 8603, percent: "14%", color: "#10B981", recency: 3, frequency: 5, monetary: 4, days: 579, gradientFrom: "#047857", gradientTo: "#34D399" }, // emerald gradient
    { id: 3, name: "Potential Loyalist", value: 7, displayValue: 4569, percent: "7%", color: "#6366F1", recency: 4, frequency: 3, monetary: 3, days: 399, gradientFrom: "#4338CA", gradientTo: "#818CF8" }, // indigo gradient
    { id: 4, name: "New Customers", value: 4, displayValue: 2672, percent: "4%", color: "#06B6D4", recency: 5, frequency: 1, monetary: 1, days: 279, gradientFrom: "#0891B2", gradientTo: "#22D3EE" }, // cyan gradient
    { id: 5, name: "Promising", value: 30, displayValue: 4546, percent: "30%", color: "#F59E0B", recency: 4, frequency: 1, monetary: 1, days: 507, gradientFrom: "#B45309", gradientTo: "#FBBF24" }, // amber gradient
    { id: 6, name: "Need Attention", value: 14, displayValue: 8741, percent: "14%", color: "#F97316", recency: 3, frequency: 2, monetary: 2, days: 683, gradientFrom: "#C2410C", gradientTo: "#FB923C" }, // orange gradient
    { id: 7, name: "About to Sleep", value: 1, displayValue: 480, percent: "1%", color: "#EF4444", recency: 3, frequency: 1, monetary: 3, days: 679, gradientFrom: "#B91C1C", gradientTo: "#F87171" }, // red gradient
    { id: 8, name: "Can't lose them", value: 2, displayValue: 954, percent: "2%", color: "#8B5CF6", recency: 1, frequency: 5, monetary: 5, days: 826, gradientFrom: "#6D28D9", gradientTo: "#A78BFA" }, // purple gradient
    { id: 9, name: "At Risk", value: 8, displayValue: 4954, percent: "8%", color: "#DB2777", recency: 1, frequency: 4, monetary: 3, days: 881, gradientFrom: "#9D174D", gradientTo: "#EC4899" }, // pink gradient
    { id: 10, name: "Hibernating", value: 7, displayValue: 19053, percent: "7%", color: "#64748B", recency: 1, frequency: 2, monetary: 2, days: 928, gradientFrom: "#475569", gradientTo: "#94A3B8" }, // slate gradient
  ];

  const mockCustomerData = {
    1: generateCustomers("Champions", 15),
    2: generateCustomers("Loyal Customers", 15),
    3: generateCustomers("Potential Loyalist", 15),
    4: generateCustomers("New Customers", 15),
    5: generateCustomers("Promising", 15),
    6: generateCustomers("Need Attention", 15),
    7: generateCustomers("About to Sleep", 15),
    8: generateCustomers("Can't lose them", 15),
    9: generateCustomers("At Risk", 15),
    10: generateCustomers("Hibernating", 15)
  };

  function generateCustomers(segment, count) {
    // Array of common Indian first names
    const firstNames = [
      "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", 
      "Reyansh", "Ayaan", "Atharva", "Krishna", "Ishaan",
      "Shaurya", "Advait", "Dhruv", "Kabir", "Ritvik",
      "Aadhya", "Ananya", "Pari", "Aanya", "Aarohi", 
      "Anvi", "Myra", "Sara", "Navya", "Kavya",
      "Siya", "Neha", "Riya", "Divya", "Tanvi"
    ];
    
    // Array of common Indian last names
    const lastNames = [
      "Sharma", "Verma", "Patel", "Gupta", "Singh", 
      "Kumar", "Jain", "Shah", "Rao", "Reddy",
      "Nair", "Menon", "Iyer", "Agarwal", "Mukherjee",
      "Chatterjee", "Sengupta", "Bose", "Banerjee", "Desai",
      "Mehta", "Kaur", "Malhotra", "Chopra", "Khanna"
    ];
    
    // Array of common Indian cities for email domains
    const cities = [
      "delhi", "mumbai", "bangalore", "hyderabad", "chennai", 
      "kolkata", "pune", "ahmedabad", "jaipur", "lucknow"
    ];
    
    // Array of common email domains in India
    const emailDomains = [
      "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
      "rediffmail.com", "ymail.com"
    ];
    
    // Array of salon/spa services
    const services = [
      "HairCut", "Facial", "Manicure", "Pedicure", "Hair Coloring",
      "Beard Trim", "Waxing", "Massage", "Hair Spa", "Threading",
      "Makeup", "Bridal Package", "Hair Treatment", "Keratin Treatment", "Body Scrub"
    ];
    
    const customers = [];
    for (let i = 1; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      
      // Generate a unique customer ID with segment prefix and random alphanumeric
      const randomAlphaNum = Math.random().toString(36).substring(2, 8).toUpperCase();
      const id = `IN${new Date().getFullYear().toString().slice(-2)}${segment.substring(0, 2).toUpperCase()}${randomAlphaNum}`;
      
      const revenue = Math.floor(Math.random() * 50000) + 10000;
      const orders = Math.floor(Math.random() * 15) + 1;
      const lastOrderDays = Math.floor(Math.random() * 300) + 10;
      
      // Generate email with first name and last name
      const emailName = (firstName + lastName.charAt(0)).toLowerCase();
      const emailCity = cities[Math.floor(Math.random() * cities.length)];
      const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
      const email = `${emailName}@${emailDomain}`;
      
      const last5Orders = [];
      for (let j = 1; j <= 5; j++) {
        const daysAgo = Math.floor(Math.random() * lastOrderDays);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        // Generate unique order ID with date components
        const dateStr = date.toISOString().slice(2, 10).replace(/-/g, "");
        const orderSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const orderId = `BT${dateStr}${orderSuffix}`;
        
        const service = services[Math.floor(Math.random() * services.length)];
        const amount = Math.floor(Math.random() * 10000) + 1000;
        
        last5Orders.push({
          orderId: orderId,
          date: date.toLocaleDateString('en-GB'),
          service: service,
          amount: amount
        });
      }
      
      // Sort orders by date (most recent first)
      last5Orders.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB - dateA;
      });
      
      customers.push({
        id: id,
        name: fullName,
        email: email,
        orders,
        revenue,
        lastOrderDays,
        last5Orders
      });
    }
    return customers;
  }

  useEffect(() => {
    if (treemapRef.current) {
      renderTreemap();
    }
  }, []);

  const renderTreemap = () => {
    const container = treemapRef.current;
    const width = container.clientWidth;
    const height = 400;
    
    // Clear any existing SVG
    d3.select(container).select("svg").remove();
    
    // Create SVG
    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");
    
    // Create tooltip div
    const tooltip = d3.select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.75)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "100");
    
    // Create hierarchical data structure for D3 treemap
    const root = d3.hierarchy({children: segments})
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
    
    // Create treemap layout
    const treemap = d3.treemap()
      .size([width, height])
      .padding(2)
      .round(true);
    
    treemap(root);
    
    // Create treemap cells
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);
    
    // Add rectangle for each cell
    leaf.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => d.data.color)
      .attr("rx", 4)
      .attr("ry", 4)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        // Show tooltip on hover
        tooltip
          .html(`
            <strong>${d.data.name}</strong><br/>
            Customers: ${d.data.displayValue}<br/>
            Percentage: ${d.data.percent}
          `)
          .style("visibility", "visible")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        
        // Highlight the cell
        d3.select(this)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
      })
      .on("mousemove", function(event) {
        // Move tooltip with mouse
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        // Hide tooltip
        tooltip.style("visibility", "hidden");
        
        // Remove highlight
        d3.select(this)
          .attr("stroke", null)
          .attr("stroke-width", null);
      })
      .on("click", (event, d) => {
        handleSegmentClick(d.data);
      });
    
    // Add percentage text (only label to show by default)
    leaf.append("text")
      .attr("x", d => (d.x1 - d.x0) / 2)
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d => d.data.percent)
      .attr("font-size", d => {
        // Adjust font size based on cell size
        const cellWidth = d.x1 - d.x0;
        const cellHeight = d.y1 - d.y0;
        const minDim = Math.min(cellWidth, cellHeight);
        return Math.min(minDim / 3, 24) + "px"; // Cap at 24px
      })
      .attr("font-weight", "bold")
      .attr("fill", "white");
  };

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
    // Use the mock data for this example
    setCustomerData(mockCustomerData[segment.id] || []);
    setShowTable(true);
  };

  const handleCustomerClick = (customer) => {
    if (expandedCustomer === customer.id) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(customer.id);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return customerData;
    
    return [...customerData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [customerData, sortConfig]);

  const filteredData = React.useMemo(() => {
    if (!filterValue) return sortedData;
    
    return sortedData.filter(customer => 
      customer.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      customer.email.toLowerCase().includes(filterValue.toLowerCase()) ||
      customer.id.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [sortedData, filterValue]);

  return (
    <div className="w-[200%] max-w-[1400px] p-6 bg-white rounded-lg shadow mx-auto mt-5 ml-12">
      <h2 className="text-4xl font-semibold mb-4 text-center">RFM Customer Segmentation Analysis</h2>
      
      {/* D3.js Treemap Visualization */}
      <div className="mb-8">
        <div ref={treemapRef} className="w-full h-96"></div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {segments.map(segment => (
          <div key={`legend-${segment.id}`} className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: segment.color }}></div>
            <span className="font-medium text-sm">{segment.name}</span>
          </div>
        ))}
      </div>

      {/* Customer Table */}
      {showTable && selectedSegment && (
  <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden shadow-lg">
    <div className="bg-gradient-to-r from-white to-gray-50 p-5 flex flex-col md:flex-row justify-between items-start md:items-center border-b">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="w-5 h-5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: selectedSegment.color }}></div>
        <h2 className="text-xl font-semibold text-gray-800">{selectedSegment.name} Segment - Customers</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            className="border border-gray-300 rounded-lg px-4 py-2 pl-10 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button className="flex items-center text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition duration-150">
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          Filters
        </button>
        <button 
          onClick={() => setShowTable(false)}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm text-gray-700 shadow-sm transition duration-150"
        >
          Close
        </button>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-6 text-left font-medium text-xs text-gray-500 uppercase tracking-wider">
              <button className="flex items-center" onClick={() => handleSort('id')}>
                Customer ID
                {sortConfig.key === 'id' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg> : 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    }
                  </span>
                )}
              </button>
            </th>
            <th className="py-3 px-6 text-left font-medium text-xs text-gray-500 uppercase tracking-wider">
              <button className="flex items-center" onClick={() => handleSort('name')}>
                Name
                {sortConfig.key === 'name' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg> : 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    }
                  </span>
                )}
              </button>
            </th>
            <th className="py-3 px-6 text-left font-medium text-xs text-gray-500 uppercase tracking-wider">
              <button className="flex items-center" onClick={() => handleSort('email')}>
                Email
                {sortConfig.key === 'email' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg> : 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    }
                  </span>
                )}
              </button>
            </th>
            <th className="py-3 px-6 text-right font-medium text-xs text-gray-500 uppercase tracking-wider">
              <button className="flex items-center ml-auto" onClick={() => handleSort('revenue')}>
                Revenue
                {sortConfig.key === 'revenue' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg> : 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    }
                  </span>
                )}
              </button>
            </th>
            <th className="py-3 px-6 text-right font-medium text-xs text-gray-500 uppercase tracking-wider">
              <button className="flex items-center ml-auto" onClick={() => handleSort('lastOrderDays')}>
                Last Order
                {sortConfig.key === 'lastOrderDays' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg> : 
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    }
                  </span>
                )}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredData.map((customer) => (
            <React.Fragment key={customer.id}>
              <tr 
                className="hover:bg-blue-50 cursor-pointer transition duration-150"
                onClick={() => handleCustomerClick(customer)}
              >
                <td className="py-4 px-6 text-sm text-gray-800">{customer.id}</td>
                <td className="py-4 px-6 text-sm font-medium text-blue-600">{customer.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{customer.email}</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-right">₹{customer.revenue.toLocaleString()}</td>
                <td className="py-4 px-6 text-sm text-gray-600 text-right">{customer.lastOrderDays} days</td>
              </tr>
              {expandedCustomer === customer.id && (
                <tr>
                  <td colSpan="5" className="p-0 border-t-0">
                    <div className="bg-blue-50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-sm text-gray-700">Last 5 Purchases</h3>
                        <div className="flex space-x-3">
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition duration-150">View All Orders</button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCustomer(null);
                            }}
                            className="text-gray-500 hover:text-gray-700 transition duration-150"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <th className="py-3 px-6 text-left">Order ID</th>
                              <th className="py-3 px-6 text-left">Date</th>
                              <th className="py-3 px-6 text-left">Service</th>
                              <th className="py-3 px-6 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {customer.last5Orders.map((order) => (
                              <tr key={order.orderId} className="hover:bg-gray-50 transition duration-150">
                                <td className="py-3 px-6 text-xs text-gray-800">{order.orderId}</td>
                                <td className="py-3 px-6 text-xs text-gray-600">{order.date}</td>
                                <td className="py-3 px-6 text-xs text-gray-600">{order.service}</td>
                                <td className="py-3 px-6 text-xs text-gray-600 text-right">₹{order.amount.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredData.length}</span> customers
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}