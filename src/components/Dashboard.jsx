import React, { useState, useEffect } from 'react';
import Sidebar from './Drawer.jsx';
import CalendarView from './subcomponents/calendarView.jsx';
import Insights from '../components/subcomponents/insights';
import UserSegmentation from '../components/subcomponents/userSegmentation';
import AppointmentsList from './subcomponents/Appointments.jsx';
import GrowthMetrics from './subcomponents/GrowthMetrics.jsx';
import BillingHistory from './subcomponents/BillingHistory.jsx';
import Campaign from './subcomponents/Campaign.jsx';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('calendar');

  // Load persisted view from localStorage on mount
  useEffect(() => {
    const savedView = localStorage.getItem('activeDashboardView');
    if (savedView) {
      setActiveView(savedView);
    }
  }, []);

  // Update view and persist it
  const handleViewSelect = (view) => {
    setActiveView(view);
    localStorage.setItem('activeDashboardView', view);
  };

  const renderPage = () => {
    switch (activeView) {
      case 'home':
        return <GrowthMetrics />;
      case 'calendar':
        return <CalendarView />;
      case 'reports':
        return <Insights />;
      case 'client':
        return <UserSegmentation />;
      case 'appointments':
        return <AppointmentsList />;
      case 'billing history':
        return <BillingHistory />;
      case 'campaign':
        return <Campaign />;
      default:
        return <div className="text-white p-4">Select a page</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar onSelectView={handleViewSelect} activeView={activeView} />
        <div>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
