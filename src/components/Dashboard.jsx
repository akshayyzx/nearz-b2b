import React, { useState } from 'react';
import Sidebar from '../components/subcomponents/Drawer.jsx';
import CalendarView from '../components/subcomponents/calendarView';
import Insights from '../components/subcomponents/insights';
import UserSegmentation from '../components/subcomponents/userSegmentation';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('calendar'); // default to calendar

  const handleViewSelect = (view) => {
    setActiveView(view);
  };

  const renderPage = () => {
    switch (activeView) {
      case 'calendar':
        return <CalendarView className="calender-view"/>;
      case 'reports':
        return <Insights />;
      case 'client':
        return <UserSegmentation />;
      default:
        return <div className="text-white p-4">Select a page</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelectView={handleViewSelect} activeView={activeView} />
      <div className="flex-1 pl-5 ml-10">
        {renderPage()}
      </div>
    </div>
  );
};

export default Dashboard;
