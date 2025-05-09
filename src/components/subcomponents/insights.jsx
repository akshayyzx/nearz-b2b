import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Calendar, TrendingUp, Users, CreditCard, Clock, Award, List, PieChart, X } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalonDashboard = () => {
  const [viewType, setViewType] = useState('monthly');
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customDateActive, setCustomDateActive] = useState(false);
  const [customData, setCustomData] = useState(null);

  useEffect(() => {
    if (customDateActive && startDate && endDate) {
      // Generate custom data when custom date is active
      const newCustomData = generateCustomData(startDate, endDate);
      setCustomData(newCustomData);
    }
  }, [customDateActive, startDate, endDate])
  
  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Reset custom date selection
  const resetCustomDate = () => {
    setStartDate('');
    setEndDate('');
    setCustomDateActive(false);
    setCustomData(null);
    setIsCustomDateOpen(false);
    setViewType('monthly');
  };

  // Apply custom date filter
  const applyCustomDateFilter = () => {
    if (startDate && endDate) {
      setCustomDateActive(true);
      setIsCustomDateOpen(false);
      // No need to generate data here as useEffect will handle it
    }
  };

  // Generate synthetic data based on date range for demo purposes
  const generateCustomData = (start, end) => {
    const startDateTime = new Date(start).getTime();
    const endDateTime = new Date(end).getTime();
    const daysDiff = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate date labels
    const labels = [];
    const currentDate = new Date(start);
    for (let i = 0; i < daysDiff; i++) {
      labels.push(currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Generate synthetic data
    const baseRevenue = 2500; // Base revenue per day
    const revenueData = Array.from({ length: daysDiff }, () => 
      Math.floor(baseRevenue + Math.random() * 1500)
    );
    
    const appointmentsData = revenueData.map(rev => 
      Math.floor(rev / 200 + Math.random() * 5)
    );
    
    // Calculate totals for summary metrics
    const totalRevenue = revenueData.reduce((acc, val) => acc + val, 0);
    const totalAppointments = appointmentsData.reduce((acc, val) => acc + val, 0);
    
    return {
      revenueChart: {
        labels: labels,
        data: revenueData,
        title: 'Custom Date Range Revenue'
      },
      appointmentsChart: {
        labels: labels,
        data: appointmentsData,
        title: 'Custom Date Range Appointments'
      },
      peakHoursChart: {
        labels: ['9-11am', '11-1pm', '1-3pm', '3-5pm', '5-7pm', '7-9pm'],
        data: [
          Math.floor(totalAppointments * 0.15),
          Math.floor(totalAppointments * 0.2),
          Math.floor(totalAppointments * 0.15),
          Math.floor(totalAppointments * 0.2),
          Math.floor(totalAppointments * 0.2),
          Math.floor(totalAppointments * 0.1)
        ],
        title: 'Peak Hours'
      },
      revenueDaysChart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [
          Math.floor(totalRevenue * 0.1),
          Math.floor(totalRevenue * 0.12),
          Math.floor(totalRevenue * 0.13),
          Math.floor(totalRevenue * 0.15),
          Math.floor(totalRevenue * 0.18),
          Math.floor(totalRevenue * 0.2),
          Math.floor(totalRevenue * 0.12)
        ],
        title: 'Revenue by Day'
      },
      serviceRevenueChart: {
        labels: ['Haircut', 'Color', 'Styling', 'Treatment', 'Spa', 'Makeup'],
        data: [
          Math.floor(totalRevenue * 0.3),
          Math.floor(totalRevenue * 0.25),
          Math.floor(totalRevenue * 0.15),
          Math.floor(totalRevenue * 0.12),
          Math.floor(totalRevenue * 0.1),
          Math.floor(totalRevenue * 0.08)
        ],
        title: 'Revenue by Service Category'
      },
      topServicesChart: {
        labels: ['Premium Haircut', 'Full Color', 'Hair Treatment', 'Bridal Makeup', 'Manicure', 'Facial', 'Massage', 'Haircut', 'Pedicure', 'Styling'],
        data: [
          Math.floor(totalRevenue * 0.18),
          Math.floor(totalRevenue * 0.15),
          Math.floor(totalRevenue * 0.12),
          Math.floor(totalRevenue * 0.1),
          Math.floor(totalRevenue * 0.09),
          Math.floor(totalRevenue * 0.08),
          Math.floor(totalRevenue * 0.08),
          Math.floor(totalRevenue * 0.08),
          Math.floor(totalRevenue * 0.06),
          Math.floor(totalRevenue * 0.06)
        ],
        title: 'Top 10 Revenue Generating Services'
      },
      customerTypeChart: {
        labels: ['New', 'Returning'],
        data: [
          Math.floor(totalRevenue * 0.25),
          Math.floor(totalRevenue * 0.75)
        ],
        title: 'Revenue by Customer Type'
      },
      genderChart: {
        labels: ['Female', 'Male', 'Other'],
        data: [
          Math.floor(totalRevenue * 0.65),
          Math.floor(totalRevenue * 0.33),
          Math.floor(totalRevenue * 0.02)
        ],
        title: 'Revenue by Gender'
      }
    };
  };
  
  // Dummy data for different view types
  const chartData = {
    daily: {
      revenueChart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [450, 650, 850, 1200, 950, 750, 850],
        title: 'Daily Revenue'
      },
      appointmentsChart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [2, 3, 4, 5, 4, 3, 4],
        title: 'Daily Appointments'
      },
      peakHoursChart: {
        labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'],
        data: [2, 3, 4, 5, 4, 3, 4, 5, 6, 5, 4, 3],
        title: 'Peak Hours'
      },
      revenueDaysChart: {
        labels: ['Today'],
        data: [8300],
        title: 'Revenue by Day'
      },
      serviceRevenueChart: {
        labels: ['Haircut', 'Color', 'Styling', 'Treatment', 'Spa', 'Makeup'],
        data: [3500, 2800, 1200, 1800, 1500, 900],
        title: 'Revenue by Service Category'
      },
      topServicesChart: {
        labels: ['Premium Haircut', 'Full Color', 'Hair Treatment', 'Bridal Makeup', 'Manicure', 'Facial', 'Massage', 'Haircut', 'Pedicure', 'Styling'],
        data: [1800, 1600, 1400, 1200, 1000, 900, 800, 700, 600, 500],
        title: 'Top 10 Revenue Generating Services'
      },
      customerTypeChart: {
        labels: ['New', 'Returning'],
        data: [3500, 6800],
        title: 'Revenue by Customer Type'
      },
      genderChart: {
        labels: ['Female', 'Male', 'Other'],
        data: [6500, 3700, 200],
        title: 'Revenue by Gender'
      }
    },
    weekly: {
      revenueChart: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        data: [4200, 5100, 4800, 5700, 6900, 8500, 6800],
        title: 'Weekly Revenue'
      },
      appointmentsChart: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
        data: [20, 25, 22, 28, 35, 42, 33],
        title: 'Weekly Appointments'
      },
      peakHoursChart: {
        labels: ['9-11am', '11-1pm', '1-3pm', '3-5pm', '5-7pm', '7-9pm'],
        data: [15, 22, 18, 25, 30, 20],
        title: 'Peak Hours'
      },
      revenueDaysChart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [4200, 5100, 4800, 5700, 6900, 8500, 6800],
        title: 'Revenue by Day'
      },
      serviceRevenueChart: {
        labels: ['Haircut', 'Color', 'Styling', 'Treatment', 'Spa', 'Makeup'],
        data: [14500, 12800, 8200, 9800, 7500, 5200],
        title: 'Revenue by Service Category'
      },
      topServicesChart: {
        labels: ['Premium Haircut', 'Full Color', 'Hair Treatment', 'Bridal Makeup', 'Manicure', 'Facial', 'Massage', 'Haircut', 'Pedicure', 'Styling'],
        data: [8800, 7600, 6400, 5200, 5000, 4900, 4800, 4700, 4600, 4500],
        title: 'Top 10 Revenue Generating Services'
      },
      customerTypeChart: {
        labels: ['New', 'Returning'],
        data: [12000, 30000],
        title: 'Revenue by Customer Type'
      },
      genderChart: {
        labels: ['Female', 'Male', 'Other'],
        data: [26000, 15000, 1000],
        title: 'Revenue by Gender'
      }
    },
    monthly: {
      revenueChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [25000, 28500, 27000, 31500, 30000, 32500, 35000, 34000, 33500, 36000, 38000, 42000],
        title: 'Monthly Revenue'
      },
      appointmentsChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [120, 135, 128, 145, 140, 150, 160, 155, 152, 165, 170, 180],
        title: 'Monthly Appointments'
      },
      peakHoursChart: {
        labels: ['9-11am', '11-1pm', '1-3pm', '3-5pm', '5-7pm', '7-9pm'],
        data: [75, 105, 90, 125, 145, 85],
        title: 'Peak Hours'
      },
      revenueDaysChart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [16800, 18200, 19500, 20800, 25600, 30200, 24900],
        title: 'Revenue by Day'
      },
      serviceRevenueChart: {
        labels: ['Haircut', 'Color', 'Styling', 'Treatment', 'Spa', 'Makeup'],
        data: [55000, 48000, 32000, 38000, 28000, 22000],
        title: 'Revenue by Service Category'
      },
      topServicesChart: {
        labels: ['Premium Haircut', 'Full Color', 'Hair Treatment', 'Bridal Makeup', 'Manicure', 'Facial', 'Massage', 'Haircut', 'Pedicure', 'Styling'],
        data: [32000, 29000, 25000, 22000, 19000, 18000, 17000, 16000, 15000, 14000],
        title: 'Top 10 Revenue Generating Services'
      },
      customerTypeChart: {
        labels: ['New', 'Returning'],
        data: [40000, 80000],
        title: 'Revenue by Customer Type'
      },
      genderChart: {
        labels: ['Female', 'Male', 'Other'],
        data: [80000, 38000, 2000],
        title: 'Revenue by Gender'
      }
    },
    yearly: {
      revenueChart: {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        data: [110000, 125000, 118000, 132000, 145000, 155000, 160000, 152000, 148000, 158000, 168000, 180000],
        title: 'Yearly Revenue'
      },
      appointmentsChart: {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        data: [520, 580, 550, 610, 670, 720, 740, 710, 690, 730, 780, 830],
        title: 'Yearly Appointments'
      },
      peakHoursChart: {
        labels: ['9-11am', '11-1pm', '1-3pm', '3-5pm', '5-7pm', '7-9pm'],
        data: [900, 1150, 1050, 1300, 1500, 950],
        title: 'Peak Hours'
      },
      revenueDaysChart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [210000, 225000, 240000, 255000, 310000, 355000, 290000],
        title: 'Revenue by Day'
      },
      serviceRevenueChart: {
        labels: ['Haircut', 'Color', 'Styling', 'Treatment', 'Spa', 'Makeup'],
        data: [650000, 580000, 360000, 420000, 330000, 250000],
        title: 'Revenue by Service Category'
      },
      topServicesChart: {
        labels: ['Premium Haircut', 'Full Color', 'Hair Treatment', 'Bridal Makeup', 'Manicure', 'Facial', 'Massage', 'Haircut', 'Pedicure', 'Styling'],
        data: [380000, 350000, 300000, 270000, 230000, 210000, 190000, 180000, 170000, 160000],
        title: 'Top 10 Revenue Generating Services'
      },
      customerTypeChart: {
        labels: ['New', 'Returning'],
        data: [500000, 1100000],
        title: 'Revenue by Customer Type'
      },
      genderChart: {
        labels: ['Female', 'Male', 'Other'],
        data: [1000000, 580000, 20000],
        title: 'Revenue by Gender'
      }
    }
  };
  
  // Premium color palette
  const colors = {
    primary: {
      gradient: ['rgba(101, 116, 205, 0.2)', 'rgba(101, 116, 205, 0.0)'],
      backgroundColor: 'rgba(101, 116, 205, 0.2)',
      borderColor: 'rgba(101, 116, 205, 1)'
    },
    secondary: {
      gradient: ['rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 0.0)'],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)'
    },
    accent: {
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      borderColor: 'rgba(255, 159, 64, 1)'
    },
    danger: {
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)'
    },
    neutral: {
      backgroundColor: 'rgba(201, 203, 207, 0.2)',
      borderColor: 'rgba(201, 203, 207, 1)'
    },
    success: {
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)'
    },
    purple: {
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)'
    },
    pieColors: [
      'rgba(101, 116, 205, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(153, 102, 255, 0.8)'
    ]
  };
  
  // Chart options with premium styling
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: false,
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: '500'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 4,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        displayColors: true,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          borderDash: [2, 4],
          color: 'rgba(226, 232, 240, 0.6)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          color: '#9ca3af',
          padding: 10
        },
        beginAtZero: true
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5
      },
      line: {
        tension: 0.4
      }
    }
  };

  // Horizontal bar options
  const horizontalBarOptions = {
    ...options,
    indexAxis: 'y',
    scales: {
      ...options.scales,
      x: {
        ...options.scales.x,
        beginAtZero: true
      }
    },
    plugins: {
      ...options.plugins,
      legend: {
        display: false
      }
    }
  };
  
  // Create datasets for each chart type
  const createLineDataset = (data, title, color) => {
    return {
      labels: data.labels,
      datasets: [
        {
          label: title,
          data: data.data,
          borderColor: color.borderColor,
          backgroundColor: context => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, color.gradient[0]);
            gradient.addColorStop(1, color.gradient[1]);
            return gradient;
          },
          pointBackgroundColor: color.borderColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
  };
  
  const createBarDataset = (data, title, color) => {
    return {
      labels: data.labels,
      datasets: [
        {
          label: title,
          data: data.data,
          backgroundColor: color.backgroundColor,
          borderColor: color.borderColor,
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: color.borderColor,
          barThickness: 'flex',
          maxBarThickness: 50
        }
      ]
    };
  };
  
  const createPieDataset = (data, title) => {
    return {
      labels: data.labels,
      datasets: [
        {
          label: title,
          data: data.data,
          backgroundColor: colors.pieColors.slice(0, data.labels.length),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 5
        }
      ]
    };
  };
  
  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Calculate average bill value
  const calculateAvgBillValue = (revenue, billCount) => {
    return revenue / billCount;
  };
  
  // Get current view's data based on selection
  const currentViewData = customDateActive && customData ? customData : chartData[viewType];
  
  // Calculate summary metrics
  const totalRevenue = currentViewData.revenueChart.data.reduce((acc, val) => acc + val, 0);
  const totalAppointments = currentViewData.appointmentsChart.data.reduce((acc, val) => acc + val, 0);
  // Assume bill count is slightly less than appointments (some appointments might have multiple services in one bill)
  const totalBillCount = Math.round(totalAppointments * 0.85);
  const avgBillValue = calculateAvgBillValue(totalRevenue, totalBillCount);

  // Today's date to set max date for datepicker
  const today = new Date().toISOString().split('T')[0];
  
  // Handle view type change
  const handleViewTypeChange = (value) => {
    if (value === "") return; // Handle placeholder selection
    
    if (value === "custom") {
      setIsCustomDateOpen(true);
    } else {
      setViewType(value);
      setCustomDateActive(false);
      setCustomData(null);
    }
  };

  // Handle custom date selection
  const handleCustomDateSelection = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setCustomDateActive(true);
    setIsCustomDateOpen(false);
    
    // No need to fetch data, as useEffect will generate custom data
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6 w-full mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-[1300px]">
        {/* Dashboard Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          SALES DASHBOARD
        </h1>
        
        {/* Time Period Filter */}
        <div className="relative inline-block">
            <select
              value={customDateActive ? "custom" : viewType}
              onChange={(e) => handleViewTypeChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm min-w-40"
            >
              {/* <option value="" disabled>ViewType</option> */}
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Date Range</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
  
        {/* Date Range Display (when custom date is active) */}
        {customDateActive && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-6 inline-flex items-center">
            <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-indigo-700">
              {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
            </span>
            <button 
              onClick={resetCustomDate}
              className="ml-2 text-indigo-600 hover:text-indigo-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Custom Date Range Picker Dialog */}
        {isCustomDateOpen && (
 <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 ">
    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative  border-2 border-indigo-600">
      {/* Close button */}
      <button
        onClick={() => setIsCustomDateOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Date Range</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            max={endDate || today}
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            min={startDate}
            max={today}
            value={endDate || ''}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsCustomDateOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={applyCustomDateFilter}
            disabled={!startDate || !endDate}
            className={`px-4 py-2 rounded-md text-sm font-medium transition duration-150 ${
              !startDate || !endDate
                ? 'bg-indigo-300 text-white cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
)}
  
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
              <CreditCard className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{formatNumber(totalRevenue)}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {customDateActive 
                ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
                : viewType === 'daily' ? 'Today' 
                : viewType === 'weekly' ? 'This Week' 
                : viewType === 'monthly' ? 'This Month' 
                : 'This Year'}
            </span>
            <span className="flex items-center text-emerald-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5.2%
            </span>
          </div>
        </div>

        {/* Total Appointments Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Appointments</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatNumber(totalAppointments)}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {customDateActive 
                ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
                : viewType === 'daily' ? 'Today' 
                : viewType === 'weekly' ? 'This Week' 
                : viewType === 'monthly' ? 'This Month' 
                : 'This Year'}
            </span>
            <span className="flex items-center text-emerald-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3.8%
            </span>
          </div>
        </div>

        {/* Average Bill Value Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-lg mr-4">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Bill Value</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{formatNumber(avgBillValue.toFixed(2))}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {customDateActive 
                ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
                : viewType === 'daily' ? 'Today' 
                : viewType === 'weekly' ? 'This Week' 
                : viewType === 'monthly' ? 'This Month' 
                : 'This Year'}
            </span>
            <span className="flex items-center text-emerald-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.4%
            </span>
          </div>
        </div>

        {/* Total Customers Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 p-3 rounded-lg mr-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bills</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatNumber(totalBillCount)}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {customDateActive 
                ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
                : viewType === 'daily' ? 'Today' 
                : viewType === 'weekly' ? 'This Week' 
                : viewType === 'monthly' ? 'This Month' 
                : 'This Year'}
            </span>
            <span className="flex items-center text-emerald-600 font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +4.1%
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentViewData.revenueChart.title}
          </h2>
          <div className="h-80">
            <Line 
              data={createLineDataset(
                currentViewData.revenueChart, 
                currentViewData.revenueChart.title, 
                colors.primary
              )}
              options={options}
            />
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentViewData.appointmentsChart.title}
          </h2>
          <div className="h-80">
            <Line 
              data={createLineDataset(
                currentViewData.appointmentsChart, 
                currentViewData.appointmentsChart.title, 
                colors.secondary
              )}
              options={options}
            />
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Revenue by Service Category */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentViewData.serviceRevenueChart.title}
          </h2>
          <div className="h-80">
            <Doughnut 
              data={createPieDataset(
                currentViewData.serviceRevenueChart, 
                currentViewData.serviceRevenueChart.title
              )}
              options={{
                ...options,
                maintainAspectRatio: false,
                plugins: {
                  ...options.plugins,
                  legend: {
                    ...options.plugins.legend,
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Revenue by Day */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentViewData.revenueDaysChart.title}
          </h2>
          <div className="h-80">
            <Bar 
              data={createBarDataset(
                currentViewData.revenueDaysChart, 
                currentViewData.revenueDaysChart.title, 
                colors.primary
              )}
              options={options}
            />
          </div>
        </div>
      </div>

      {/* Third Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Peak Hours */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentViewData.peakHoursChart.title}
          </h2>
          <div className="h-80">
            <Line 
              data={createBarDataset(
                currentViewData.peakHoursChart, 
                currentViewData.peakHoursChart.title, 
                colors.accent
              )}
              options={options}
            />
          </div>
        </div>

        {/* Customer Types */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentViewData.customerTypeChart.title}
          </h2>
          <div className="h-80 w-full">
            <Doughnut 
              data={createPieDataset(
                currentViewData.customerTypeChart, 
                currentViewData.customerTypeChart.title
              )}
              options={{
                ...options,
                cutout: '60%',
                plugins: {
                  ...options.plugins,
                  legend: {
                    ...options.plugins.legend,
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Fourth Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Top Revenue Generating Services */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentViewData.topServicesChart.title}
          </h2>
          <div className="h-96">
            <Bar 
              data={createBarDataset(
                currentViewData.topServicesChart, 
                currentViewData.topServicesChart.title, 
                colors.success
              )}
              options={horizontalBarOptions}
            />
          </div>
        </div>

        {/* Revenue by Gender */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {currentViewData.genderChart.title}
          </h2>
          <div className="flex">
            <div className="h-95 w-full">
              <Doughnut 
                data={createPieDataset(
                  currentViewData.genderChart, 
                  currentViewData.genderChart.title
                )}
                options={{
                  ...options,
                  maintainAspectRatio: false,
                  plugins: {
                    ...options.plugins,
                    legend: {
                      ...options.plugins.legend,
                      position: 'bottom'
                    },
                    
                  }
                }}
              />
            </div>
          </div>
          {/* <div className="flex flex-col mt-4">
            {currentViewData.genderChart.labels.map((label, index) => (
              <div key={label} className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: colors.pieColors[index] }}
                  />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="text-sm font-semibold">
                ₹{formatNumber(currentViewData.genderChart.data[index])}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 Salon Dashboard. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SalonDashboard;