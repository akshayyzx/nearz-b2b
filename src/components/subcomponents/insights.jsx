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
  Legend
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
        title: 'Weekly Service Distribution'
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
        title: 'Monthly Service Distribution'
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
        title: '6-Month Service Distribution'
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
  
  // Chart colors
  const colors = {
    blue: {
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: 'rgb(53, 162, 235)'
    },
    red: {
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgb(255, 99, 132)'
    },
    green: {
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)'
    },
    yellow: {
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      borderColor: 'rgb(255, 206, 86)'
    },
    purple: {
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgb(153, 102, 255)'
    },
    orange: {
      backgroundColor: 'rgba(255, 159, 64, 0.5)',
      borderColor: 'rgb(255, 159, 64)'
    },
    pieColors: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
    ]
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      }
    },
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
          backgroundColor: color.backgroundColor,
          tension: 0.3
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
          borderWidth: 1
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
          borderWidth: 1
        }
      ]
    };
  };
  
  // Get current view's data
  const currentViewData = chartData[viewType];
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="viewType" style={{ marginRight: '10px', fontWeight: 'bold', fontSize: '16px' }}>
          View Type:
        </label>
        <select
          id="viewType"
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', fontSize: '16px', border: '1px solid #ccc' }}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="sixMonths">Last 6 Months</option>
        </select>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', 
        gap: '20px',
        maxWidth: '100%'
      }}>
        {/* Chart 1 - Revenue (Line) */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            {currentViewData.chart1.title}
          </h3>
          <div style={{ height: '300px' }}>
            <Line 
              options={{...options, plugins: {...options.plugins, title: {display: true, text: currentViewData.chart1.title}}}} 
              data={createLineDataset(currentViewData.chart1, currentViewData.chart1.title, colors.blue)} 
            />
          </div>
        </div>
        
        {/* Chart 2 - Appointments (Line) */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            {currentViewData.chart2.title}
          </h3>
          <div style={{ height: '300px' }}>
            <Line 
              options={{...options, plugins: {...options.plugins, title: {display: true, text: currentViewData.chart2.title}}}} 
              data={createLineDataset(currentViewData.chart2, currentViewData.chart2.title, colors.green)} 
            />
          </div>
        </div>
        
        {/* Chart 3 - Service Distribution (Bar) */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            {currentViewData.chart3.title}
          </h3>
          <div style={{ height: '300px' }}>
            <Bar 
              options={{...options, plugins: {...options.plugins, title: {display: true, text: currentViewData.chart3.title}}}} 
              data={createBarDataset(currentViewData.chart3, currentViewData.chart3.title, colors.purple)} 
            />
          </div>
        </div>
        
        {/* Chart 4 - Booking Channels (Pie) */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            {currentViewData.chart4.title}
          </h3>
          <div style={{ height: '300px' }}>
            <Pie 
              options={{...options, plugins: {...options.plugins, title: {display: true, text: currentViewData.chart4.title}}}} 
              data={createPieDataset(currentViewData.chart4, currentViewData.chart4.title)} 
            />
          </div>
        </div>
        
        {/* Chart 5 - Cancellations (Bar) */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            {currentViewData.chart5.title}
          </h3>
          <div style={{ height: '300px' }}>
            <Bar 
              options={{...options, plugins: {...options.plugins, title: {display: true, text: currentViewData.chart5.title}}}} 
              data={createBarDataset(currentViewData.chart5, currentViewData.chart5.title, colors.red)} 
            />
          </div>
        </div>
        
        {/* Chart 6 - Product Sales (Bar) */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            {currentViewData.chart6.title}
          </h3>
          <div style={{ height: '300px' }}>
            <Bar 
              options={{...options, plugins: {...options.plugins, title: {display: true, text: currentViewData.chart6.title}}}} 
              data={createBarDataset(currentViewData.chart6, currentViewData.chart6.title, colors.orange)} 
            />
          </div>
        </div>
        
        {/* Chart 7 - Peak Hours (Bar) */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            {currentViewData.chart7.title}
          </h3>
          <div style={{ height: '300px' }}>
            <Bar 
              options={{...options, plugins: {...options.plugins, title: {display: true, text: currentViewData.chart7.title}}}} 
              data={createBarDataset(currentViewData.chart7, currentViewData.chart7.title, colors.yellow)} 
            />
          </div>
        </div>
        
        {/* Chart 8 - Customer Type (Doughnut) */}
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          backgroundColor: 'white',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
            {currentViewData.chart8.title}
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut 
              options={{...options, plugins: {...options.plugins, title: {display: true, text: currentViewData.chart8.title}}}} 
              data={createPieDataset(currentViewData.chart8, currentViewData.chart8.title)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDashboard;