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
    {
      id: 1,
      name: "Champions",
      value: 13,
      displayValue: 7960,
      percent: "13%",
      color: "#0EA5E9",
      recency: 5,
      frequency: 5,
      monetary: 5,
      days: 30,
      gradientFrom: "#0284C7",
      gradientTo: "#38BDF8",
      description: "Most valuable – visit recently, regularly & high spenders"
    },
    {
      id: 2,
      name: "Loyal Customers",
      value: 14,
      displayValue: 8603,
      percent: "14%",
      color: "#6366F1",
      recency: 4,
      frequency: 5,
      monetary: 4,
      days: 60,
      gradientFrom: "#4338CA",
      gradientTo: "#818CF8",
      description: "Visit often and spend well, but not always very recent"
    },
    {
      id: 3,
      name: "Potential Loyalist",
      value: 7,
      displayValue: 4569,
      percent: "7%",
      color: "#10B981",
      recency: 4,
      frequency: 4,
      monetary: 3,
      days: 90,
      gradientFrom: "#047857",
      gradientTo: "#34D399",
      description: "Visit often and spend well – they can become regular loyal customers"
    },
    {
      id: 4,
      name: "New Customers",
      value: 4,
      displayValue: 2672,
      percent: "4%",
      color: "#8B5CF6",
      recency: 5,
      frequency: 1,
      monetary: 2,
      days: 30,
      gradientFrom: "#6D28D9",
      gradientTo: "#C084FC",
      description: "Just visited your salon for the first time"
    },
    {
      id: 5,
      name: "Promising",
      value: 7,
      displayValue: 4546,
      percent: "7%",
      color: "#9bc53d",
      recency: 4,
      frequency: 1,
      monetary: 3,
      days: 60,
      gradientFrom: "#B45309",
      gradientTo: "#FCD34D",
      description: "Recently bought and spent moderately, potential to return"
    },
    {
      id: 6,
      name: "Need Attention",
      value: 14,
      displayValue: 8741,
      percent: "14%",
      color: "#FB923C",
      recency: 3,
      frequency: 3,
      monetary: 3,
      days: 90,
      gradientFrom: "#EA580C",
      gradientTo: "#FDBA74",
      description: "Haven't been around lately but used to spend well"
    },
    {
      id: 7,
      name: "About to Sleep",
      value: 1,
      displayValue: 480,
      percent: "1%",
      color: "#F43F5E",
      recency: 2,
      frequency: 1,
      monetary: 1,
      days: 120,
      gradientFrom: "#BE123C",
      gradientTo: "#FB7185",
      description: "Very inactive with low spending or low visits"
    },
    {
      id: 8,
      name: "Can't lose them",
      value: 2,
      displayValue: 954,
      percent: "2%",
      color: "#00a9a5",
      recency: 1,
      frequency: 5,
      monetary: 5,
      days: 180,
      gradientFrom: "#0F766E",
      gradientTo: "#2DD4BF",
      description: "Frequent and big spenders, but haven't visited recently"
    },
    {
      id: 9,
      name: "At Risk",
      value: 8,
      displayValue: 4954,
      percent: "8%",
      color: "#E11D48",
      recency: 1,
      frequency: 3,
      monetary: 4,
      days: 150,
      gradientFrom: "#9F1239",
      gradientTo: "#FB7185",
      description: "Used to be good customers but haven't returned in a while"
    },
    {
      id: 10,
      name: "Hibernating",
      value: 30,
      displayValue: 19053,
      percent: "30%",
      color: "#94A3B8",
      recency: 1,
      frequency: 1,
      monetary: 2,
      days: 200,
      gradientFrom: "#475569",
      gradientTo: "#CBD5E1",
      description: "Haven't bought in a long time and didn't spend much"
    },
    {
      id: 11,
      name: "Lost",
      value: 4,
      displayValue: 2240,
      percent: "4%",
      color: "#6B7280",
      recency: 0,
      frequency: 0,
      monetary: 0,
      days: 365,
      gradientFrom: "#374151",
      gradientTo: "#D1D5DB",
      description: "Completely inactive and not valuable anymore"
    },
    {
      id: 12,
      name: "Price Sensitive",
      value: 6,
      displayValue: 3540,
      percent: "6%",
      color: "#5d5179",
      recency: 5,
      frequency: 4,
      monetary: 1,
      days: 45,
      gradientFrom: "#7C3AED",
      gradientTo: "#C084FC",
      description: "Visit recently and often, but usually spend less"
    }
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
    10: generateCustomers("Hibernating", 15),
    11: generateCustomers("Lost", 15),
    12: generateCustomers("Price Sensitive", 15)
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
    
    // Array of salon/spa services
    const services = [
      "HairCut", "Facial", "Manicure", "Pedicure", "Hair Coloring",
      "Beard Trim", "Waxing", "Massage", "Hair Spa", "Threading",
      "Makeup", "Bridal Package", "Hair Treatment", "Keratin Treatment", "Body Scrub"
    ];
    
    // Gender options
    const genders = ["Male", "Female", "Prefer not to say"];
    
    const customers = [];
    for (let i = 1; i <= count; i++) {
      // Determine gender first
      const gender = genders[Math.floor(Math.random() * genders.length)];
      
      // Select first name based on gender (simplified approach)
      let firstName;
      if (gender === "Male") {
        // Use names from first half of the array (male names)
        firstName = firstNames[Math.floor(Math.random() * 15)];
      } else if (gender === "Female") {
        // Use names from second half of the array (female names)
        firstName = firstNames[Math.floor(Math.random() * 15) + 15];
      } else {
        // Random name from the entire array
        firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      }
      
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      
      // Generate a unique customer ID with segment prefix and random alphanumeric
      const randomAlphaNum = Math.random().toString(36).substring(2, 8).toUpperCase();
      const id = `IN${new Date().getFullYear().toString().slice(-2)}${segment.substring(0, 2).toUpperCase()}${randomAlphaNum}`;
      
      // Generate billCount (formerly orders)
      let billCount;
      if (segment === "Price Sensitive") {
        billCount = Math.floor(Math.random() * 10) + 5; // Higher frequency but lower spend
      } else if (segment === "Lost") {
        billCount = Math.floor(Math.random() * 3) + 1; // Very few orders for lost customers
      } else {
        billCount = Math.floor(Math.random() * 15) + 1; // Normal orders for others
      }
      
      // Generate LTV (Lifetime Value)
      let ltv;
      if (segment === "Champions" || segment === "Loyal Customers") {
        ltv = Math.floor(Math.random() * 20000) + 30000; // Higher LTV for valuable customers
      } else if (segment === "Price Sensitive") {
        ltv = Math.floor(Math.random() * 10000) + 5000; // Lower LTV for price sensitive
      } else if (segment === "Lost") {
        ltv = Math.floor(Math.random() * 5000) + 2000; // Very low LTV for lost customers
      } else {
        ltv = Math.floor(Math.random() * 15000) + 10000; // Normal LTV for others
      }
      
      // Generate Average Rating (out of 5)
      let avgRating;
      if (segment === "Champions" || segment === "Loyal Customers") {
        // Higher ratings for valuable customers (4.0 - 5.0)
        avgRating = (Math.random() * 1.0 + 4.0).toFixed(1);
      } else if (segment === "Lost" || segment === "Hibernating") {
        // Lower ratings for inactive customers (2.0 - 4.0)
        avgRating = (Math.random() * 2.0 + 2.0).toFixed(1);
      } else {
        // Normal ratings for others (3.0 - 5.0)
        avgRating = (Math.random() * 2.0 + 3.0).toFixed(1);
      }
      
      // Adjust last order days based on segment
      let lastOrderDays;
      if (segment === "Price Sensitive") {
        lastOrderDays = Math.floor(Math.random() * 30) + 5; // Recent visits
      } else if (segment === "Lost") {
        lastOrderDays = Math.floor(Math.random() * 100) + 300; // Long time since last visit
      } else {
        lastOrderDays = Math.floor(Math.random() * 300) + 10; // Normal for others
      }
      
      // Generate Indian phone number
      const indianPhoneNumber = () => {
        const mobilePrefixes = ['6', '7', '8', '9'];
        const prefix = mobilePrefixes[Math.floor(Math.random() * mobilePrefixes.length)];
        const remainingDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        const fullNumber = prefix + remainingDigits.substring(0, 9);
        return `${fullNumber.substring(0, 5)} ${fullNumber.substring(5, 10)}`;
      };
      
      const phone = indianPhoneNumber();
      
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
        
        // Adjust service amounts based on segment
        let amount;
        if (segment === "Price Sensitive") {
          amount = Math.floor(Math.random() * 3000) + 500; // Lower spending for price sensitive
        } else if (segment === "Lost") {
          amount = Math.floor(Math.random() * 2000) + 500; // Low spending for lost customers
        } else {
          amount = Math.floor(Math.random() * 10000) + 1000; // Normal spending for others
        }
        
        // Generate random rating for this specific order (1-5 stars)
        const orderRating = Math.floor(Math.random() * 5) + 1;
        
        last5Orders.push({
          orderId: orderId,
          date: date.toLocaleDateString('en-GB'),
          service: service,
          amount: amount,
          rating: orderRating
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
        gender: gender,
        phone: phone,
        billCount: billCount,
        ltv: ltv,
        avgRating: avgRating,
        lastOrderDays: lastOrderDays,
        last5Orders: last5Orders
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
    const height = 550; // Increased height for better visualization
    
    // Clear any existing SVG
    d3.select(container).select("svg").remove();
    
    // Create SVG
    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("font", "30px sans-serif");
    
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
      .style("font-size", "10px")
      .style("pointer-events", "none")
      .style("z-index", "100");
    
    // Filter segments with value > 0
    const activeSegments = segments.filter(s => s.value > 0);
    
    // Create hierarchical data structure for D3 treemap
    const root = d3.hierarchy({children: activeSegments})
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
          <strong>${d.data.name}</strong> (${d.data.description})
          <div style="max-width: 250px; white-space: normal; word-wrap: break-word;">
            Customers: ${d.data.displayValue}<br/>
            Percentage: ${d.data.percent}<br/>
          </div>
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
    
    // Add percentage text
    leaf.append("text")
      .attr("x", d => (d.x1 - d.x0) / 2)
      .attr("y", d => (d.y1 - d.y0) / 2 - 10)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d => d.data.percent)
      .attr("font-size", d => {
        // Adjust font size based on cell size
        const cellWidth = d.x1 - d.x0;
        const cellHeight = d.y1 - d.y0;
        const minDim = Math.min(cellWidth, cellHeight);
        return Math.min(minDim / 4, 36) + "px"; // Cap at 36px
      })
      .attr("font-weight", "bold")
      .attr("fill", "black");
      
    // Add customer count text
    leaf.append("text")
      .attr("x", d => (d.x1 - d.x0) / 2)
      .attr("y", d => (d.y1 - d.y0) / 2 + 30)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d => d.data.displayValue.toLocaleString())
      .attr("font-size", d => {
        // Adjust font size based on cell size
        const cellWidth = d.x1 - d.x0;
        const cellHeight = d.y1 - d.y0;
        const minDim = Math.min(cellWidth, cellHeight);
        return Math.min(minDim / 6, 20) + "px"; // Cap at 14px
      })
      .attr("fill", "black");
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
      customer.phone.toLowerCase().includes(filterValue.toLowerCase()) ||
      customer.id.toLowerCase().includes(filterValue.toLowerCase()) ||
      customer.gender.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [sortedData, filterValue]);

  return (
    <div className="w-[1200px] p-6 bg-white rounded-lg shadow mx-auto mt-5">
      <h2 className="text-3xl font-bold mb-6">Customer Segmentation Analysis</h2>
       
     {/* D3.js Treemap Visualization */}
      <div>
        <div ref={treemapRef} className="w-full h-96"></div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-45 ml-12">
        {segments.filter(s => s.value > 0).map(segment => (
          <div key={`legend-${segment.id}`} className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: segment.color }}></div>
            <span className="font-medium text-sm">{segment.name}</span>
          </div>
        ))}
      </div>
      
      {/* Customer Table (appears when a segment is clicked) */}
     {showTable && selectedSegment && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-700">
              {selectedSegment.name} Segment Customers
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search customers..."
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <button 
                className="text-gray-600 hover:text-red-600 text-lg font-bold px-3 py-1"
                title="Close"
                onClick={() => setShowTable(false)}
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                   Service ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('gender')}
                  >
                    Gender {sortConfig.key === 'gender' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('billCount')}
                  >
                    Bill Count {sortConfig.key === 'billCount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('ltv')}
                  >
                    LTV (₹) {sortConfig.key === 'ltv' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('avgRating')}
                  >
                    Avg. Rating {sortConfig.key === 'avgRating' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort('lastOrderDays')}
                  >
                    Last Service {sortConfig.key === 'lastOrderDays' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map(customer => (
                  <React.Fragment key={customer.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {customer.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.billCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ₹{customer.ltv.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.avgRating} ★
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.lastOrderDays} days ago
                      </td>
                    </tr>

                    {expandedCustomer === customer.id && (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          <div className="p-4 rounded">
                            <h4 className="font-semibold mb-2 text-gray-800">Last 5 Services</h4>
                            <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Service ID</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Service</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customer.last5Orders.map((order, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="px-4 py-2 text-sm text-gray-600">{order.orderId}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{order.date}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{order.service}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">₹{order.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
</div>
  )}