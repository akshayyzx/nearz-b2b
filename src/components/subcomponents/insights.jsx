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
import DropdownFilter from './CustomDateRangeComponent'; // Import the extracted component

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
  const [dateRangeText, setDateRangeText] = useState('');

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
    setDateRangeText('');
  };

  // Apply custom date filter
  const applyCustomDateFilter = () => {
    if (startDate && endDate) {
      setCustomDateActive(true);
      setIsCustomDateOpen(false);
      // No need to generate data here as useEffect will handle it
    }
  };

  // Apply preset date range
  const applyPresetDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setCustomDateActive(true);
    setDateRangeText(`Past ${days} days`);
    
    // Generate custom data
    const newCustomData = generateCustomData(
      start.toISOString().split('T')[0], 
      end.toISOString().split('T')[0]
    );
    setCustomData(newCustomData);
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
      setDateRangeText('');
    }
  };

  // Filter options for dropdown
  const filterOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom Date Range" }
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen p-6 w-full mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-[1300px]">
        {/* Dashboard Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          SALES DASHBOARD
        </h1>
        
        {/* Time Period Filter - Using our new component */}
        <DropdownFilter
          value={customDateActive ? "custom" : viewType}
          onChange={handleViewTypeChange}
          options={filterOptions}
        />
      </div>
  
      {/* Quick Date Range Filters */}
      {/* <div className="flex flex-wrap gap-3 mb-6 ml-220">
        <button
          onClick={() => applyPresetDateRange(7)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-200 transition-colors shadow-sm flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
          Past 7 days
        </button>
        
        <button 
          onClick={() => applyPresetDateRange(30)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-200 transition-colors shadow-sm flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
          Past 30 days
        </button>
        
        <button 
          onClick={() => applyPresetDateRange(60)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-200 transition-colors shadow-sm flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
          Past 60 days
        </button>
      </div> */}
  
      {/* Date Range Display (when custom date is active)
      {customDateActive && (
        // <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-6 inline-flex items-center cursor-pointer">
        //   <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
        //   <span className="text-sm font-medium text-indigo-700">
        //     {dateRangeText || `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`}
        //   </span>
        //   <button 
        //     onClick={resetCustomDate}
        //     className="ml-2 text-indigo-600 hover:text-indigo-800"
        //   >
        //     <X className="h-4 w-4" />
        //   </button>
        // </div>
      )} */}
      {/* Custom Date Range Picker Dialog */}
 {isCustomDateOpen && (
  <div className="fixed inset-0 flex items-center justify-end z-50 mt-10">
    <div className="bg-white rounded-lg p-6 w-[22vw] shadow-xl mr-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Date Range</h3>
        <button
          onClick={() => setIsCustomDateOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Start Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          max={endDate || today}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* End Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          min={startDate}
          max={today}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Preset Range Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => applyPresetDateRange(7)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-200 transition-colors shadow-sm flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
          Past 7 days
        </button>

        <button
          onClick={() => applyPresetDateRange(30)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-200 transition-colors shadow-sm flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
          Past 30 days
        </button>

        <button
          onClick={() => applyPresetDateRange(60)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-200 transition-colors shadow-sm flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
          Past 60 days
        </button>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsCustomDateOpen(false)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={applyCustomDateFilter}
          disabled={!startDate || !endDate}
          className={`px-4 py-2 rounded-md text-white ${
            !startDate || !endDate
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Apply
        </button>
      </div>
    </div>
  </div>
)}



      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-indigo-50 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-indigo-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">₹{formatNumber(totalRevenue)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {customDateActive ? dateRangeText || `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}` : viewType}
          </div>
        </div>
        
        {/* Total Appointments Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-emerald-50 p-3 mr-4">
              <Users className="h-6 w-6 text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">Total Appointments</h2>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{formatNumber(totalAppointments)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {customDateActive ? dateRangeText || `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}` : viewType}
          </div>
        </div>
        
        {/* Average Bill Value Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-amber-50 p-3 mr-4">
              <CreditCard className="h-6 w-6 text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">Avg. Bill Value</h2>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">₹{formatNumber(Math.round(avgBillValue))}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {customDateActive ? dateRangeText || `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}` : viewType}
          </div>
        </div>
        
        {/* Total Bill Count Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="rounded-full bg-blue-50 p-3 mr-4">
              <Award className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">Total Bills</h2>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{formatNumber(totalBillCount)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {customDateActive ? dateRangeText || `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}` : viewType}
          </div>
        </div>
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentViewData.revenueChart.title}</h2>
          <div className="h-64">
            <Line 
              data={createLineDataset(currentViewData.revenueChart, 'Revenue', colors.primary)} 
              options={options} 
            />
          </div>
        </div>
        
        {/* Appointments Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentViewData.appointmentsChart.title}</h2>
          <div className="h-64">
            <Line 
              data={createLineDataset(currentViewData.appointmentsChart, 'Appointments', colors.secondary)} 
              options={options} 
            />
          </div>
        </div>
      </div>
      
      {/* Service Analysis & Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Service Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentViewData.serviceRevenueChart.title}</h2>
          <div className="h-64">
            <Bar 
              data={createBarDataset(currentViewData.serviceRevenueChart, 'Service Revenue', colors.primary)} 
              options={options} 
            />
          </div>
        </div>
        
        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentViewData.peakHoursChart.title}</h2>
          <div className="h-64">
            <Bar 
              data={createBarDataset(currentViewData.peakHoursChart, 'Customer Count', colors.accent)} 
              options={options} 
            />
          </div>
        </div>
      </div>
      
      {/* Customer Analysis & Day Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue by Day of Week */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentViewData.revenueDaysChart.title}</h2>
          <div className="h-64">
            <Pie
              data={createBarDataset(currentViewData.revenueDaysChart, 'Revenue', colors.purple)} 
              options={options} 
            />
          </div>
        </div>
        
        {/* Revenue by Customer Type */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentViewData.customerTypeChart.title}</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={createPieDataset(currentViewData.customerTypeChart, 'Revenue')} 
              options={{
                ...options,
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%'
              }} 
            />
          </div>
        </div>
        
        {/* Revenue by Gender */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentViewData.genderChart.title}</h2>
          <div className="h-64 flex items-center justify-center">
            <Pie 
              data={createPieDataset(currentViewData.genderChart, 'Revenue')} 
              options={{
                ...options,
                responsive: true,
                maintainAspectRatio: false
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Top 10 Services Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentViewData.topServicesChart.title}</h2>
        <div className="h-96">
          <Bar 
            data={createBarDataset(currentViewData.topServicesChart, 'Revenue', colors.primary)} 
            options={horizontalBarOptions} 
          />
        </div>
      </div>
    </div>
  );
};

export default SalonDashboard;