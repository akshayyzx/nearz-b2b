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
import { Calendar, TrendingUp, Users, CreditCard, Clock, Award, List, PieChart } from 'lucide-react';

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
    // When resetting, make sure we restore the previous view type
    setViewType('monthly'); // Or whatever default you prefer
  };

  // Apply custom date filter
  const applyCustomDateFilter = () => {
    if (startDate && endDate) {
      // Make sure we create the custom data before setting customDateActive
      const newCustomData = generateCustomData(startDate, endDate);
      setCustomData(newCustomData);
      setCustomDateActive(true);
      setIsCustomDateOpen(false);
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
        labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'],
        data: [450, 650, 850, 1200, 950, 750, 850, 1100, 1300, 1150, 950, 750],
        title: 'Daily Revenue'
      },
      appointmentsChart: {
        labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'],
        data: [2, 3, 4, 5, 4, 3, 4, 5, 6, 5, 4, 3],
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
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [4200, 5100, 4800, 5700, 6900, 8500, 6800],
        title: 'Weekly Revenue'
      },
      appointmentsChart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [25000, 28500, 27000, 31500],
        title: 'Monthly Revenue'
      },
      appointmentsChart: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [120, 135, 128, 145],
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
    sixMonths: {
      revenueChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [110000, 125000, 118000, 132000, 145000, 155000],
        title: 'Last 6 Months Revenue'
      },
      appointmentsChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [520, 580, 550, 610, 670, 720],
        title: 'Last 6 Months Appointments'
      },
      peakHoursChart: {
        labels: ['9-11am', '11-1pm', '1-3pm', '3-5pm', '5-7pm', '7-9pm'],
        data: [450, 580, 520, 650, 750, 450],
        title: 'Peak Hours'
      },
      revenueDaysChart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [102000, 108000, 115000, 125000, 155000, 175000, 143000],
        title: 'Revenue by Day'
      },
      serviceRevenueChart: {
        labels: ['Haircut', 'Color', 'Styling', 'Treatment', 'Spa', 'Makeup'],
        data: [330000, 290000, 180000, 210000, 165000, 125000],
        title: 'Revenue by Service Category'
      },
      topServicesChart: {
        labels: ['Premium Haircut', 'Full Color', 'Hair Treatment', 'Bridal Makeup', 'Manicure', 'Facial', 'Massage', 'Haircut', 'Pedicure', 'Styling'],
        data: [190000, 175000, 150000, 135000, 115000, 105000, 95000, 90000, 85000, 80000],
        title: 'Top 10 Revenue Generating Services'
      },
      customerTypeChart: {
        labels: ['New', 'Returning'],
        data: [250000, 550000],
        title: 'Revenue by Customer Type'
      },
      genderChart: {
        labels: ['Female', 'Male', 'Other'],
        data: [500000, 290000, 10000],
        title: 'Revenue by Gender'
      }
    },
    yearly: {
      revenueChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [110000, 125000, 118000, 132000, 145000, 155000, 160000, 152000, 148000, 158000, 168000, 180000],
        title: 'Yearly Revenue'
      },
      appointmentsChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
  
  return (
    <div className="bg-gray-50 min-h-screen p-6 w-[1400px] mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Dashboard Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          SALES DASHBOARD
        </h1>
        
        {/* Time Period Filter */}
        <div className="relative">
          <div className="flex space-x-2">
          <select
  value={customDateActive ? "custom" : viewType}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustomDateOpen(true);
    } else {
      setViewType(value);
      setCustomDateActive(false);
      setCustomData(null);
    }
  }}
  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm min-w-40"
>
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option value="monthly">Monthly</option>
  <option value="sixMonths">Last 6 Months</option>
  <option value="yearly">Yearly</option>
  <option value="custom">Custom Date Range</option>
</select>
            
            {customDateActive && (
  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-6 inline-flex items-center">
    <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
    <span className="text-sm font-medium text-indigo-700">
      {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
    </span>
  </div>
)}
          </div>
          
          {/* Custom Date Range Popup */}
          {isCustomDateOpen && (
            <div className="absolute right-0 top-12 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
              <div className="mb-3">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Select Date Range</h3>
                <p className="text-sm text-gray-500">Choose start and end dates to filter data</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={startDate}
                      max={endDate || today}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        max={today}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCustomDateOpen(false)}
                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCustomDateFilter}
                    disabled={!startDate || !endDate}
                    className={`${
                      !startDate || !endDate
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white font-medium py-2 px-4 rounded-lg text-sm`}
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Date Range Display (when custom date is active) */}
        {customDateActive && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-6 inline-flex items-center">
            <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
            <span className="text-sm font-medium text-indigo-700">
              {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
            </span>
          </div>
        )}
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">₹{formatNumber(totalRevenue)}</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-xs font-medium text-emerald-500">+12.5% from previous period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Appointments</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatNumber(totalAppointments)}</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-xs font-medium text-emerald-500">+8.3% from previous period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Bill Value</p>
                <h3 className="text-2xl font-bold text-gray-800">₹{formatNumber(Math.round(avgBillValue))}</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-xs font-medium text-emerald-500">+5.2% from previous period</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Customers</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatNumber(Math.round(totalAppointments * 0.75))}</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <Users className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-xs font-medium text-emerald-500">+7.8% from previous period</span>
            </div>
          </div>
        </div>
        
        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{currentViewData.revenueChart.title}</h3>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="h-64">
              <Line 
                data={createLineDataset(currentViewData.revenueChart, 'Revenue', colors.primary)} 
                options={options} 
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{currentViewData.appointmentsChart.title}</h3>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="h-64">
              <Line 
                data={createLineDataset(currentViewData.appointmentsChart, 'Appointments', colors.secondary)} 
                options={options}
              />
            </div>
          </div>
        </div>
        
        {/* Secondary Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{currentViewData.peakHoursChart.title}</h3>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="h-64">
              <Line 
                data={createBarDataset(currentViewData.peakHoursChart, 'Appointments', colors.accent)} 
                options={options}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{currentViewData.revenueDaysChart.title}</h3>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="h-64">
              <Bar 
                data={createBarDataset(currentViewData.revenueDaysChart, 'Revenue', colors.primary)} 
                options={options}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{currentViewData.serviceRevenueChart.title}</h3>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <PieChart className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="h-64">
              <Pie 
                data={createPieDataset(currentViewData.serviceRevenueChart, 'Revenue')} 
                options={{
                  ...options,
                  maintainAspectRatio: false,
                  plugins: {
                    ...options.plugins,
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">{currentViewData.topServicesChart.title}</h3>
              <div className="bg-indigo-50 p-2 rounded-lg">
                <Award className="h-5 w-5 text-indigo-500" />
              </div>
            </div>
            <div className="h-96">
              <Bar 
                data={createBarDataset(currentViewData.topServicesChart, 'Revenue', colors.success)} 
                options={horizontalBarOptions}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{currentViewData.customerTypeChart.title}</h3>
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-indigo-500" />
                </div>
              </div>
              <div className="h-48">
                <Doughnut 
                  data={createPieDataset(currentViewData.customerTypeChart, 'Revenue')} 
                  options={{
                    ...options,
                    cutout: '70%',
                    plugins: {
                      ...options.plugins,
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{currentViewData.genderChart.title}</h3>
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <PieChart className="h-5 w-5 text-indigo-500" />
                </div>
              </div>
              <div className="h-48">
                <Doughnut 
                  data={createPieDataset(currentViewData.genderChart, 'Revenue')} 
                  options={{
                    ...options,
                    cutout: '70%',
                    plugins: {
                      ...options.plugins,
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 pt-6 border-t border-gray-200 mt-6">
          <div className="mb-4 md:mb-0">
            © 2025 Salon Management System. All rights reserved.
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <List className="h-4 w-4 mr-2" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center bg-indigo-600 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              <PieChart className="h-4 w-4 mr-2" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SalonDashboard;