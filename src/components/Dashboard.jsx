import React, { useState } from 'react';
import Sidebar from '../components/subcomponents/Drawer.jsx';
import CalendarView from '../components/subcomponents/CalendarView.jsx';
import Insights from '../components/subcomponents/Insights';
import UserSegmentation from '../components/subcomponents/UserSegmentation';
import Header from './Header.jsx';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('calendar');

  const handleViewSelect = (view) => {
    setActiveView(view);
  };

  const renderPage = () => {
    switch (activeView) {
      case 'calendar':
        return <CalendarView />;
      case 'reports':
        return <Insights />;
      case 'client':
        return <UserSegmentation />;
      default:
        return <div className="text-white p-4">Select a page</div>;
    }
  };

  return (
    <>
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header at Top */}
      <div className="">
        <Header />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <Sidebar onSelectView={handleViewSelect} activeView={activeView} />

        {/* Main content */}
        <div >
          {renderPage()}
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
