import React, { useState } from 'react';
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
  
  // Dummy data for different view types
  const chartData = {
    weekly: {
      chart1: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [12, 19, 15, 17, 22, 30, 25],
        title: 'Weekly Revenue'
      },
      chart2: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [5, 8, 12, 9, 15, 20, 18],
        title: 'Weekly Appointments'
      },
      chart3: {
        labels: ['Haircut', 'Color', 'Style', 'Treatment'],
        data: [30, 20, 15, 10],
        title: 'Weekly Service Category'
      },
      chart4: {
        labels: ['Online', 'Walk-in', 'Phone'],
        data: [45, 35, 20],
        title: 'Weekly Booking Channels'
      },
      chart5: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [2, 3, 1, 4, 2, 5, 3],
        title: 'Weekly Cancellations'
      },
      chart6: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        data: [12, 8, 15, 10],
        title: 'Weekly Product Sales'
      },
      chart7: {
        labels: ['9-11am', '11-1pm', '1-3pm', '3-5pm', '5-7pm'],
        data: [15, 20, 18, 22, 25],
        title: 'Weekly Peak Hours'
      },
      chart8: {
        labels: ['New', 'Returning'],
        data: [30, 70],
        title: 'Weekly Customer Type'
      }
    },
    monthly: {
      chart1: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [2500, 3000, 2800, 3200],
        title: 'Monthly Revenue'
      },
      chart2: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [80, 95, 85, 100],
        title: 'Monthly Appointments'
      },
      chart3: {
        labels: ['Haircut', 'Color', 'Style', 'Treatment'],
        data: [120, 85, 65, 50],
        title: 'Monthly Service Category'
      },
      chart4: {
        labels: ['Online', 'Walk-in', 'Phone'],
        data: [180, 120, 60],
        title: 'Monthly Booking Channels'
      },
      chart5: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [10, 15, 12, 18],
        title: 'Monthly Cancellations'
      },
      chart6: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        data: [45, 35, 50, 40],
        title: 'Monthly Product Sales'
      },
      chart7: {
        labels: ['9-11am', '11-1pm', '1-3pm', '3-5pm', '5-7pm'],
        data: [60, 85, 75, 90, 95],
        title: 'Monthly Peak Hours'
      },
      chart8: {
        labels: ['New', 'Returning'],
        data: [25, 75],
        title: 'Monthly Customer Type'
      }
    },
    sixMonths: {
      chart1: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [15000, 18000, 16500, 19000, 20500, 22000],
        title: '6-Month Revenue'
      },
      chart2: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [480, 530, 510, 560, 590, 620],
        title: '6-Month Appointments'
      },
      chart3: {
        labels: ['Haircut', 'Color', 'Style', 'Treatment'],
        data: [720, 510, 390, 300],
        title: '6-Month Service Category'
      },
      chart4: {
        labels: ['Online', 'Walk-in', 'Phone'],
        data: [1100, 650, 350],
        title: '6-Month Booking Channels'
      },
      chart5: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [60, 55, 65, 58, 62, 70],
        title: '6-Month Cancellations'
      },
      chart6: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        data: [280, 230, 310, 260],
        title: '6-Month Product Sales'
      },
      chart7: {
        labels: ['9-11am', '11-1pm', '1-3pm', '3-5pm', '5-7pm'],
        data: [350, 420, 380, 450, 500],
        title: '6-Month Peak Hours'
      },
      chart8: {
        labels: ['New', 'Returning'],
        data: [20, 80],
        title: '6-Month Customer Type'
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
  
  // Get current view's data
  const currentViewData = chartData[viewType];
  
  // Calculate summary metrics
  const totalRevenue = currentViewData.chart1.data.reduce((acc, val) => acc + val, 0);
  const totalAppointments = currentViewData.chart2.data.reduce((acc, val) => acc + val, 0);
  const topService = currentViewData.chart3.labels[
    currentViewData.chart3.data.indexOf(Math.max(...currentViewData.chart3.data))
  ];
  const conversionRate = 85; // Dummy data
  
  return (
    <div className="bg-gray-50 min-h-screen ml-10 mt-5 rounded-xl">
      {/* Top navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Sales Analytics</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="sixMonths">Last 6 Months</option>
            </select>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-150 ease-in-out">
              Export Data
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8 w-[250%] max-w-[1400px]  rounded-lg">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          {/* <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="mt-1 text-gray-500">Comprehensive insights into your salon's performance</p>
          </div> */}
          <div className="mt-4 md:mt-0">
            <span className="inline-flex rounded-md shadow-sm">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Generate Report
              </button>
            </span>
          </div>
        </div>
        
        {/* KPI summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 4H18M6 8H18M10 4C13 4 15 6 15 8C15 10 13 12 10 12H6L17 20" 
        stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">₹{formatNumber(totalRevenue)}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-2">
              <div className="text-sm text-green-600 font-medium">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                8.2% increase
              </div>
            </div>
          </div>
          
          {/* Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{formatNumber(totalAppointments)}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-2">
              <div className="text-sm text-green-600 font-medium">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                5.7% increase
              </div>
            </div>
          </div>
          
          {/* Top Service */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-teal-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Top Service</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{topService}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-2">
              <div className="text-sm text-gray-600 font-medium">
                Most popular choice
              </div>
            </div>
          </div>
          
          {/* Conversion Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{conversionRate}%</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-2">
              <div className="text-sm text-green-600 font-medium">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                3.2% increase
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1 - Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{currentViewData.chart1.title}</h3>
                <div className="flex items-center">
                  <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    12.5%
                  </div>
                </div>
              </div>
              <div className="h-72">
                <Line 
                  options={options} 
                  data={createLineDataset(currentViewData.chart1, currentViewData.chart1.title, colors.primary)} 
                />
              </div>
            </div>
          </div>
          
          {/* Chart 2 - Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{currentViewData.chart2.title}</h3>
                <div className="flex items-center">
                  <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    8.3%
                  </div>
                </div>
              </div>
              <div className="h-72">
                <Line 
                  options={options} 
                  data={createLineDataset(currentViewData.chart2, currentViewData.chart2.title, colors.secondary)} 
                />
              </div>
            </div>
          </div>
          
          {/* Chart 3 - Service Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{currentViewData.chart3.title}</h3>
              </div>
              <div className="h-72">
                <Bar 
                  options={options} 
                  data={createBarDataset(currentViewData.chart3, currentViewData.chart3.title, colors.accent)} 
                />
              </div>
            </div>
          </div>
          
          {/* Chart 4 - Booking Channels */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{currentViewData.chart4.title}</h3>
              </div>
              <div className="h-[300px] flex items-center justify-center py-6">
                 <div className="w-[300px] max-w-md">
                   <Pie
                      options={{
                        ...options,
                        responsive: true,
                        maintainAspectRatio: true
                      }}
                      data={createPieDataset(currentViewData.chart4, currentViewData.chart4.title)}
                    />
                 </div>
               </div>
            </div>
          </div>
          
          {/* Chart 5 - Cancellations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{currentViewData.chart5.title}</h3>
                <div className="flex items-center">
                  <div className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    4.2%
                  </div>
                </div>
              </div>
              <div className="h-72">
                <Bar 
                  options={options} 
                  data={createBarDataset(currentViewData.chart5, currentViewData.chart5.title, colors.danger)} 
                />
              </div>
            </div>
          </div>
          
          {/* Chart 6 - Product Sales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{currentViewData.chart6.title}</h3>
                <div className="flex items-center">
                  <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    10.3%
                  </div>
                </div>
              </div>
              <div className="h-72">
                <Bar 
                  options={options} 
                  data={createBarDataset(currentViewData.chart6, currentViewData.chart6.title, colors.neutral)} 
                />
              </div>
            </div>
          </div>
          
          {/* Chart 7 - Peak Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{currentViewData.chart7.title}</h3>
              </div>
              <div className="h-72">
                <Bar 
                  options={options} 
                  data={createBarDataset(currentViewData.chart7, currentViewData.chart7.title, colors.primary)} 
                />
              </div>
            </div>
          </div>
          
          {/* Chart 8 - Customer Type */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 pt-5 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{currentViewData.chart8.title}</h3>
              </div>
             <div className="h-[300px] flex items-center justify-center py-6">
                 <div className="w-[300px] max-w-md">
                   <Doughnut
                      options={{
                        ...options,
                        responsive: true,
                        maintainAspectRatio: true
                      }}
                      data={createPieDataset(currentViewData.chart8, currentViewData.chart8.title)}
                    />
                 </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section - Additional insights */}
        {/* <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Customer Retention</span>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                    <div style={{ width: '78%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-600">78% retention rate</div>
                    <div className="text-xs font-semibold text-green-600">↑ 3.2%</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Stylist Utilization</span>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-green-200">
                    <div style={{ width: '92%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-600">92% utilization rate</div>
                    <div className="text-xs font-semibold text-green-600">↑ 5.7%</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Revenue Per Client</span>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-purple-200">
                    <div style={{ width: '85%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-600">₹85 per client average</div>
                    <div className="text-xs font-semibold text-green-600">↑ 7.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Recommendations section */}
        {/* <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-6 sm:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white rounded-full p-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="ml-5">
                <h3 className="text-lg font-bold text-white">AI-Powered Recommendations</h3>
                <p className="text-indigo-100">Based on your salon's performance data</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20">
                <h4 className="text-white font-medium mb-2 text-black">Increase Marketing Focus</h4>
                <p className="text-indigo-100 text-sm text-black">Promote color services to boost your second highest revenue generator by 15%.</p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20">
                <h4 className="text-white font-medium mb-2 text-black">Peak Hours Optimization</h4>
                <p className="text-indigo-100 text-sm text-black" >Consider adding staff during 5-7pm to maximize revenue during your busiest times.</p>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20">
                <h4 className="text-white font-medium mb-2 text-black">Client Retention Strategy</h4>
                <p className="text-indigo-100 text-sm text-black">Implement a loyalty program to increase returning customer percentage.</p>
              </div>
            </div>
          </div>
        </div> */}
        
        {/* Footer */}
        {/* <div className="mt-8 text-center text-sm text-gray-500 pb-6">
          <p>© {new Date().getFullYear()} Salon Analytics Dashboard • Premium Edition</p>
        </div> */}
      </div>
    </div>
  );
};

export default SalonDashboard;