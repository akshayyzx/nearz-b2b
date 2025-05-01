import React, { useState } from 'react';
import Sidebar from './Drawer.jsx';
import CalendarView from './subcomponents/calendarView.jsx';
import Insights from '../components/subcomponents/insights';
import UserSegmentation from '../components/subcomponents/UserSegmentation';
import AppointmentsList from './subcomponents/Appointments.jsx';
import GrowthMetrics from './subcomponents/GrowthMetrics.jsx'


const Dashboard = () => {
  const [activeView, setActiveView] = useState('calendar');

  const handleViewSelect = (view) => {
    setActiveView(view);
  };

  const renderPage = () => {
    switch (activeView) {
      case 'home':
        return <GrowthMetrics/>;
      case 'calendar':
        return <CalendarView />;
      case 'reports':
        return <Insights />;
      case 'client':
        return <UserSegmentation />;
      case 'appointments':
        return <AppointmentsList/>;
      default:
        return <div className="text-white p-4">Select a page</div>;
    }
  };

  return (
    <>
    <div className="min-h-screen flex flex-col">
     

      {/* Sidebar + Content */}
      <div className="flex flex-1 ">
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
