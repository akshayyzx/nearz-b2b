import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Menu, X, Search } from 'lucide-react';

export default function Header() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState('User');
  const modalRef = useRef(null);
  
  // Get username from localStorage on component mount
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLogoutModal(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.clear();
    
    // Close the modal
    setShowLogoutModal(false);
    
    // Navigate to signup screen (using window.location instead of useNavigate)
    window.location.href = '/signup';
  };

  return (
    <div className="w-full">
      {/* Main Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#F25435] shadow-sm sticky top-0 z-50 transition-all duration-300">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 h-9">
          <img
            src="https://super-naiad-0ea617.netlify.app/static/media/logo.52c1adf0.svg"
            alt="logo"
            className="h-18 w-auto object-contain"
          />
        </div>
        {/* Icons */}
        <div className="flex items-center gap-4">
          <div
            className="relative"
            ref={modalRef}
          >
      <div 
  className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-800 text-white font-semibold flex items-center justify-center cursor-pointer transition-colors duration-200 shadow-sm"
  onClick={() => setShowLogoutModal(!showLogoutModal)}
>
  <User size={20} />
</div>
            
            {/* Logout Modal */}
            {showLogoutModal && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg py-3 px-2 w-48 z-50 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{userName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded transition-colors text-sm mt-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}