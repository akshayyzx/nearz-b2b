import {
  Calendar,
  Home,
  Tag,
  Smile,
  BookOpen,
  User,
  Megaphone,
  Users,
  LineChart,
  Grid,
  Settings,
} from 'lucide-react';
import React, { useState } from 'react';

const Sidebar = ({ onSelectView, activeView }) => {
  return (
    <aside className="w-16 bg-[#0A1B1F] flex flex-col items-center py-4 space-y-3 fixed top-16 left-0 h-screen z-30 mt-2">
      <SidebarIcon
        icon={<Home size={20} />}
        label="Home"
        active={activeView === 'home'}
        onClick={() => onSelectView('home')}
        showTooltip={true}
      />
      <SidebarIcon
        icon={<Calendar size={20} />}
        label="Calendar"
        active={activeView === 'calendar'}
        onClick={() => onSelectView('calendar')}
        showTooltip={true}
      />
      <SidebarIcon
        icon={<Users size={20} />}
        label="Client"
        active={activeView === 'client'}
        onClick={() => onSelectView('client')}
        showTooltip={true}
      />
      <SidebarIcon
        icon={<LineChart size={20} />}
        label="Reports"
        active={activeView === 'reports'}
        onClick={() => onSelectView('reports')}
        showTooltip={true}
      />
      <SidebarIcon 
        icon={<Tag size={20} />}
        label="Appointments"
        active={activeView === 'appointments'}
        onClick={() => onSelectView('appointments')}
        showTooltip={true}
      />
      <SidebarIcon 
        icon={<Settings size={20} className="opacity-40" />}
        showTooltip={false}
      />
      
      {/* Other sidebar icons with opacity 40% and no tooltips */}
      <SidebarIcon 
        icon={<BookOpen size={20} className="opacity-40" />} 
        showTooltip={false}
      />
      <SidebarIcon 
        icon={<User size={20} className="opacity-40" />} 
        showTooltip={false}
      />
      <SidebarIcon 
        icon={<Megaphone size={20} className="opacity-40" />} 
        showTooltip={false}
      />
      <SidebarIcon 
        icon={<Smile size={20} className="opacity-40" />} 
        showTooltip={false}
      />
      <SidebarIcon 
        icon={<Grid size={20} className="opacity-40" />} 
        showTooltip={false}
      />
    </aside>
  );
};

const SidebarIcon = ({ icon, label, active = false, onClick, showTooltip = true }) => {
  const [showLabel, setShowLabel] = useState(false);
  
  return (
    <div className="relative group">
      <div
        onClick={onClick}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
          active ? 'bg-[#F25435] text-white' : 'text-white hover:bg-[#162c30]'
        }`}
      >
        {icon}
      </div>
      
      {showTooltip && showLabel && (
        <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded min-w-max z-50 shadow-lg">
          {label}
        </div>
      )}
    </div>
  );
};

export default Sidebar;