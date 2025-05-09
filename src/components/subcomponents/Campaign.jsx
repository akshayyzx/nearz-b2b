import React, { useState } from 'react';

export default function CampaignManager() {
  const [campaignName, setCampaignName] = useState('');
  const [segment, setSegment] = useState('');
  const [gender, setGender] = useState('');
  const [occasion, setOccasion] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');

  const segmentOptions = [
    "Champions",
    "Loyal Customers",
    "Potential Loyalist",
    "New Customers",
    "Promising",
    "Need Attention",
    "About to Sleep",
    "Can't lose them",
    "At Risk",
    "Hibernating",
    "Lost",
    "Price Sensitive"
  ];

  const genderOptions = ["Male", "Female", "All"];
  const occasionOptions = ["Birthday", "Festive Season", "Anniversary", "Special Offer"];

  const handlePreview = () => {
    // In a real app, this would generate a preview
    console.log("Preview generated");
  };

  const handleRun = () => {
    // In a real app, this would run the campaign
    console.log("Campaign running");
  };

  return (
    <div className="bg-gray-100 min-h-screen w-[1350px]">
    {/* Header */}
    <div className="relative">
      <h1 className="text-3xl font-bold text-black absolute top-4 left-4">
        Campaigns for Customers.
      </h1>
    </div>


      {/* Main content */}
  <div className="max-w-6xl mx-auto px-4 w-[1350px] pt-20">
    {/* Tab Navigation */}
    {/* <div className="flex mb-6 ml-4">
      <button className="bg-white px-6 py-2 border border-gray-300 rounded-l font-medium">
        Create Campaign
      </button>
      <button className="bg-gray-100 px-6 py-2 border border-gray-300 rounded-r font-medium">
        Campaign History
      </button>
    </div> */}

        <div className="flex flex-wrap">
          {/* Left Panel - Campaign Form */}
          <div className="w-full lg:w-1/2 p-4">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Campaign</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="E.g. Happy Hours"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Customer Segment</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                >
                  <option value="">Select</option>
                  {segmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Occasion</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                >
                  <option value="">Select</option>
                  {occasionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex mb-4 gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">Starting Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Template</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="template1">Happy Hour</option>
                  <option value="template2">Special Discount</option>
                  <option value="template3">Holiday Special</option>
                </select>
              </div>
              
              <div className="mb-4">
                <div className="border border-gray-300 rounded">
                  <div className="flex items-center border-b border-gray-300 p-2 bg-gray-50">
                    <span className="font-medium">Normal</span>
                    <span className="mx-2">|</span>
                    <button className="font-bold mx-1">B</button>
                    <button className="italic mx-1">I</button>
                    <button className="underline mx-1">U</button>
                  </div>
                  <textarea
                    className="w-full p-4 min-h-32 border-none outline-none"
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Campaign Summary and Preview */}
          <div className="w-full lg:w-1/2 p-4">
            <div className="bg-white p-6 rounded shadow mb-4">
              <h2 className="text-xl font-bold mb-4">Campaign Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Campaign Name:</span>
                  <span className="font-medium">{campaignName || "HAPPY HOURS"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Segment:</span>
                  <span className="font-medium">{segment || "Everyone"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">{gender || "Male"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Period:</span>
                  <span className="font-medium">
                    {startDate && endDate 
                      ? `${startDate} to ${endDate}`
                      : "08/05/25 to 10/05/25"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Occasion:</span>
                  <span className="font-medium">{occasion || "Festive Season"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Audience:</span>
                  <span className="font-medium">500</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">Rs. 250</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Balance:</span>
                  <span className="font-medium">Rs. 400</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-600"
                  onClick={handleRun}
                >
                  Run
                </button>
              </div>
            </div>
            
            {/* Message Preview */}
            <div className="flex justify-center">
              <div className="border-8 border-black rounded-3xl max-w-xs relative">
                <div className="bg-green-500 text-white p-2 rounded-t-lg flex items-center">
                  <div className="flex-1 text-center">Message</div>
                </div>
                <div className="bg-white p-4 h-72">
                  <div className="text-sm">
                    <p><strong>It's Happy Hour at [Salon Name]!</strong></p>
                    <p>Get 20% OFF on all services between 2 PM – 5 PM today.</p>
                    <p>Walk in, glam up, and glow out!</p>
                    <p><strong>Offer valid today only. Hurry!</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}