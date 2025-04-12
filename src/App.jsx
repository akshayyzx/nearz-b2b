import React from 'react'
import './App.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from './components/Header'
import Dashboard from './components/Dashboard';

function App() {


  return (
    <>
      <div>
        <Header/>
        <Dashboard/>
        </div>
    </>
  )
}

export default App
