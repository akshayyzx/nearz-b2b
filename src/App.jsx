import React, { useState, useEffect } from 'react';
import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';

import SignUpForm from './components/signup/SignUpForm.jsx';
import LoginForm from './components/signup/LoginForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import Header from './components/Header.jsx';
import ViewBill from './components/subcomponents/ViewBill.jsx';
// import Drawer from './components/Drawer.jsx'

// Wrapper to allow navigation after signup
function SignUpWrapper({ onSignupSuccess }) {
  const navigate = useNavigate();

  const handleSignup = (phone) => {
    onSignupSuccess(phone);
    navigate('/login');
  };

  return <SignUpForm onSignupSuccess={handleSignup} />;
}

// Header wrapper (hides header on /bill/* pages)
function HeaderWrapper({ isAuthenticated, onLogout }) {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith('/bill/')) return null;
  return isAuthenticated ? <Header onLogout={onLogout} /> : null;
}

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedPhone = localStorage.getItem('phoneNumber');
    const savedAuth = localStorage.getItem('isAuthenticated') === 'true';

    if (savedPhone) setPhoneNumber(savedPhone);
    if (savedAuth) setIsAuthenticated(true);

    setIsLoading(false);
  }, []);

  const handleSignupSuccess = (phone) => {
    setPhoneNumber(phone);
    localStorage.setItem('phoneNumber', phone);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPhoneNumber('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('phoneNumber');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <Router>
   <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="fixed top-0 left-0 right-0 z-20">
          <HeaderWrapper 
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex-1 mt-16 flex items-center justify-center overflow-auto">
          <Routes>
            {/* Root path loads SignUp */}
            <Route
              path="/"
              element={
                isAuthenticated
                  ? <Navigate to="/dashboard" />
                  : <Navigate to="/signup" />
              }
            />

            {/* Signup */}
            <Route
              path="/signup"
              element={
                isAuthenticated
                  ? <Navigate to="/dashboard" />
                  : <SignUpWrapper onSignupSuccess={handleSignupSuccess} />
              }
            />

            {/* Login */}
            <Route
              path="/login"
              element={
                isAuthenticated
                  ? <Navigate to="/dashboard" />
                  : <LoginForm initialPhone={phoneNumber} onLoginSuccess={handleLoginSuccess} />
              }
            />

            {/* Dashboard (auth protected) */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated
                  ? <Dashboard />
                  : <Navigate to="/login" />
              }
            />

            {/* ViewBill (open to all) */}
            <Route path="/bill/:ulid" element={<ViewBill />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
