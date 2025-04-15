import React, { useState } from 'react';
import './App.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import Header from './components/Header';
// import Dashboard from './components/Dashboard';
import SignUpForm from './components/signup/SignUpForm.jsx';
import LoginForm from './components/signup/LoginForm.jsx';

function App() {
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Called after successful signup
  const handleSignupSuccess = (phone) => {
    setPhoneNumber(phone);
    setIsSignupComplete(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!isSignupComplete ? (
        <SignUpForm onSignupSuccess={handleSignupSuccess} />
      ) : (
        <LoginForm initialPhone={phoneNumber} />
      )}
    </div>
  );
}

export default App;
