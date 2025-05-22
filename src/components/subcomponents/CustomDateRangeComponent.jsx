import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const DropdownFilter = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the label from the selected value
  const getSelectedLabel = () => {
    const selected = options.find(option => option.value === value);
    return selected ? selected.label : 'Select Period';
  };
  
  return (
    <div className="relative w-64 ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center cursor-pointer justify-between px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
      >
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
          <span className="font-medium text-gray-700">{getSelectedLabel()}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex cursor-pointer items-center ${value === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;