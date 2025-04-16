import React, { useState, useEffect } from 'react';
import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import SignUpForm from './components/signup/SignUpForm.jsx';
import LoginForm from './components/signup/LoginForm.jsx';
// import Calendar from './components/subcomponents/CalendarView.jsx';
import Dashboard from "./components/Dashboard.jsx"
import Header from "./components/Header.jsx"

function App() {
  const [currentPage, setCurrentPage] = useState("signup");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    const savedPhone = localStorage.getItem("phoneNumber");

    if (savedPage) setCurrentPage(savedPage);
    if (savedPhone) setPhoneNumber(savedPhone);
    // localStorage.clear();
  }, []);

  const handleSignupSuccess = (phone) => {
    setPhoneNumber(phone);
    setCurrentPage("login");

    localStorage.setItem("currentPage", "login");
    localStorage.setItem("phoneNumber", phone);
  };

  const handleLoginSuccess = () => {
    setCurrentPage("dashboard");
    localStorage.setItem("currentPage", "dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* <Dashboard/> */}
      {currentPage === "signup" && <SignUpForm onSignupSuccess={handleSignupSuccess} />}
      {currentPage === "login" && <LoginForm initialPhone={phoneNumber} onLoginSuccess={handleLoginSuccess} />}
      {currentPage === "dashboard" && <Header/> && <Dashboard />}
    </div>
  );
}

export default App;
