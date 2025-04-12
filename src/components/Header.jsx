import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#F25435] shadow-md sticky top-0 z-50">
      {/* Logo + Title */}
      <div className="flex items-center gap-2">
        <img 
          src="https://coruscating-kheer-a59585.netlify.app/static/media/logo.52c1adf0.svg" 
          alt="logo" 
          className="h-10 w-auto object-contain"
        />
        {/* <span className="text-lg font-semibold text-white">For Business</span> */}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <button className="text-white hover:text-gray-200 transition-colors">
          <Bell size={22} />
        </button>
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#F25435] font-semibold cursor-pointer hover:bg-gray-100 transition">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
