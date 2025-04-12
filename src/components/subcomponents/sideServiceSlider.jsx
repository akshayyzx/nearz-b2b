import React, { useState, useEffect } from 'react';

const ServiceSidebar = ({ isOpen, onClose, timeSlot }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the component is mounted before animation starts
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  // Sample services data
  const services = [
    {
      category: 'Hair & styling',
      count: 4,
      items: [
        { id: 1, name: 'Haircut', duration: '45min', price: '₹40' },
        { id: 2, name: 'Hair Color', duration: '1h 15min', price: '₹57' },
        { id: 3, name: 'Blow Dry', duration: '35min', price: '₹35' },
        { id: 4, name: 'Balayage', duration: '2h 30min', price: '₹150' }
      ]
    }
  ];
  
  // Filter services based on search query
  const filteredServices = services.map(category => {
    const filteredItems = category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      ...category,
      items: filteredItems
    };
  }).filter(category => category.items.length > 0);
  
  // If the sidebar is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          animateIn ? 'opacity-30' : 'opacity-0'
        }`} 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`absolute top-0 right-0 h-full bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out w-96 ${
          animateIn ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Select a service</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Client selection section */}
        <div className="p-4 border-b">
          <div className="font-medium mb-1">Add client</div>
          <div className="text-sm text-gray-500">
            Or leave empty<br />for walk-ins
          </div>
        </div>
        
        {/* Search input */}
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by service name"
              className="w-full border border-gray-300 rounded-lg p-2 pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Services list */}
        <div>
          {filteredServices.map((category, idx) => (
            <div key={idx}>
              <div className="px-4 py-3 font-medium flex justify-between items-center bg-gray-50">
                <span>{category.category}</span>
                <span className="text-gray-500">{category.count}</span>
              </div>
              
              {category.items.map(service => (
                <div 
                  key={service.id}
                  className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b"
                  onClick={() => {
                    console.log('Selected service:', service);
                    onClose();
                    // Here you can add logic to create the appointment with the selected service
                  }}
                >
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.duration}</div>
                  </div>
                  <div className="font-medium">₹{service.price.replace('₹', '')}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSidebar;