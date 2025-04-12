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
import React from 'react';

const Sidebar = ({ onSelectView, activeView }) => {
  return (
    <aside className="w-16 bg-[#0A1B1F] flex flex-col items-center py-4 space-y-3 fixed top-16 left-0 h-screen ">
      <SidebarIcon
        icon={<Home size={20} />}
        active={activeView === 'home'}
        onClick={() => onSelectView('home')}
      />
      <SidebarIcon
        icon={<Calendar size={20} />}
        active={activeView === 'calendar'}
        onClick={() => onSelectView('calendar')}
        
      />
      <SidebarIcon
        icon={<Smile size={20} />}
        active={activeView === 'client'}
        onClick={() => onSelectView('client')}
      />
      <SidebarIcon
        icon={<LineChart size={20} />}
        active={activeView === 'reports'}
        onClick={() => onSelectView('reports')}
      />

      {/* Other sidebar icons */}
      <SidebarIcon icon={<Tag size={20} />} />
      <SidebarIcon icon={<BookOpen size={20} />} />
      <SidebarIcon icon={<User size={20} />} />
      <SidebarIcon icon={<Megaphone size={20} />} />
      <SidebarIcon icon={<Users size={20} />} />
      <SidebarIcon icon={<Grid size={20} />} />
      <SidebarIcon icon={<Settings size={20} />} />
    </aside>
  );
};

const SidebarIcon = ({ icon, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
      active ? 'bg-[#F25435] text-white' : 'text-white hover:bg-[#162c30]'
    }`}
  >
    {icon}
  </div>
);

export default Sidebar;
