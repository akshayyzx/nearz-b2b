import React, { useEffect, useState } from "react";
import { fetchAppointments } from "./FetchAppointmentSlots";
import { 
  Calendar, 
  ChevronRight, 
  PieChart, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  BarChart3,
  X
} from "lucide-react";

import ServiceCategory from '../../utils/serviceCategories';
import DropdownFilter from "./CustomDateRangeComponent";

const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all"); // Default filter is "all"
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  // Define period filter options
  const periodOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom Date Range" }
  ];

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    cancelled: 0,
    declined: 0,
    pending: 0,
    noShow: 0
  });

  useEffect(() => {
    const loadAppointments = async () => {      
      try {
        const data = await fetchAppointments();
        console.log("Appointments:", data);
  
        if (data && Array.isArray(data)) {
          setAppointments(data);
          filterAppointmentsByPeriod(data, periodFilter);
        } else {
          console.error("Unexpected API response structure:", data);
          setError("Appointments data is not in the expected format.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
  
    loadAppointments();
  }, []);

  // Apply filters when period changes
  useEffect(() => {
    if (periodFilter === "custom") {
      setIsCustomDateOpen(true);
    } else {
      filterAppointmentsByPeriod(appointments, periodFilter);
    }
  }, [periodFilter]);

  // Handle preset date range selections
  const applyPresetDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  };

  // Apply custom date filter
  const applyCustomDateFilter = () => {
    if (!startDate || !endDate) return;
    
    const filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const startFilterDate = new Date(startDate);
      const endFilterDate = new Date(endDate);
      
      // Set end date to end of day for inclusive filtering
      endFilterDate.setHours(23, 59, 59, 999);
      
      return appointmentDate >= startFilterDate && appointmentDate <= endFilterDate;
    });
    
    setFilteredAppointments(filtered);
    calculateStats(filtered);
    setIsCustomDateOpen(false);
  };

  // Filter appointments based on selected time period
  const filterAppointmentsByPeriod = (appointmentData, period) => {
    if (!appointmentData.length) return;
    
    const now = new Date();
    let filtered;
    
    switch (period) {
      case "daily":
        // Filter appointments from today
        filtered = appointmentData.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0);
        });
        break;
        
      case "weekly":
        // Filter appointments from this week
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999);
        
        filtered = appointmentData.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        });
        break;
        
      case "monthly":
        // Filter appointments from this month
        filtered = appointmentData.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return (
            appointmentDate.getMonth() === now.getMonth() && 
            appointmentDate.getFullYear() === now.getFullYear()
          );
        });
        break;
        
      case "yearly":
        // Filter appointments from this year
        filtered = appointmentData.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate.getFullYear() === now.getFullYear();
        });
        break;
        
      case "all":
      default:
        // Show all appointments
        filtered = appointmentData;
        break;
    }
    
    setFilteredAppointments(filtered);
    calculateStats(filtered);
  };

  // Calculate statistics based on provided appointment data
  const calculateStats = (appointmentData) => {
    const calculatedStats = {
      total: appointmentData.length,
      completed: appointmentData.filter(a => a.status.toLowerCase() === "confirmed").length,
      cancelled: appointmentData.filter(a => a.status.toLowerCase() === "cancelled").length,
      declined: appointmentData.filter(a => a.status.toLowerCase() === "declined").length,
      pending: appointmentData.filter(a => a.status.toLowerCase() === "pending").length,
      noShow: appointmentData.filter(a => a.status.toLowerCase() === "no show").length
    };
    
    setStats(calculatedStats);
  };

  // Extract service categories from appointment data
  const calculateServiceCategories = (appointmentData) => {
    // Create a map to count service occurrences
    const serviceCount = {};
    
    appointmentData.forEach(appointment => {
      if (appointment.service) {
        // Increment counter for this service type
        serviceCount[appointment.service] = (serviceCount[appointment.service] || 0) + 1;
      }
    });
    
    // Convert to array of objects and sort by count (descending)
    const sortedServices = Object.keys(serviceCount)
      .map(name => ({ name, value: serviceCount[name] }))
      .sort((a, b) => b.value - a.value);
      
    // Return top services (limit to 6 for display purposes)
    return sortedServices.slice(0, 6);
  };
  
  // Get service categories from filtered appointments
  const serviceCategories = calculateServiceCategories(filteredAppointments);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "#10B981"; // emerald
      case "pending":
        return "#F59E0B"; // amber
      case "declined":
        return "#EF4444"; // rose
      case "cancelled":
        return "#8B5CF6"; // purple
      case "no show":
        return "#6B7280"; // gray
      default:
        return "#6B7280"; // gray
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-600"></div>
          <p className="mt-4 text-indigo-600 font-medium">Loading appointment data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 bg-rose-50 rounded-xl shadow-lg border border-rose-100">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-rose-100">
          <AlertCircle size={32} className="text-rose-500" />
        </div>
        <p className="font-medium text-rose-700">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all duration-200 shadow-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="mx-auto p-4 sm:p-6 w-[1350px]">
      {/* Header with title and period filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 w-full">
        <h2 className="text-5xl font-bold text-[#F25435] mt-12 mb-4 md:mb-0">
          Appointments Dashboard
        </h2>
        
        {/* Period Filter */}
        <div className="mt-2 md:mt-12">
          <DropdownFilter 
            value={periodFilter}
            onChange={setPeriodFilter}
            options={periodOptions}
          />
        </div>
      </div>

      {/* Custom Date Range Popup */}
      {isCustomDateOpen && (   
        <div className="fixed inset-0 flex items-center justify-end z-50 mt-20">     
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

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-indigo-100">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-indigo-50">
            <PieChart size={20} className="text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Appointments</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-emerald-100">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle size={20} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mb-1">{stats.completed}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-100">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-purple-50">
            <XCircle size={20} className="text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.cancelled}</div>
          <div className="text-sm text-gray-500">Cancelled</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-rose-100">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-rose-50">
            <AlertCircle size={20} className="text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mb-1">{stats.declined}</div>
          <div className="text-sm text-gray-500">Declined</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-amber-100">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-amber-50">
            <Clock size={20} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500 mb-1">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-gray-200">
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-gray-100">
            <XCircle size={20} className="text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-600 mb-1">{stats.noShow}</div>
          <div className="text-sm text-gray-500">No Show</div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 text-lg">Appointments By Status</h3>
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-full relative flex items-center justify-center"
                 style={{ 
                   backgroundImage: `conic-gradient(
                     ${getStatusColor("confirmed")} 0deg, 
                     ${getStatusColor("confirmed")} ${stats.completed/stats.total*360}deg, 
                     ${getStatusColor("cancelled")} ${stats.completed/stats.total*360}deg, 
                     ${getStatusColor("cancelled")} ${(stats.completed+stats.cancelled)/stats.total*360}deg,
                     ${getStatusColor("declined")} ${(stats.completed+stats.cancelled)/stats.total*360}deg, 
                     ${getStatusColor("declined")} ${(stats.completed+stats.cancelled+stats.declined)/stats.total*360}deg,
                     ${getStatusColor("pending")} ${(stats.completed+stats.cancelled+stats.declined)/stats.total*360}deg, 
                     ${getStatusColor("pending")} ${(stats.completed+stats.cancelled+stats.declined+stats.pending)/stats.total*360}deg,
                     ${getStatusColor("no show")} ${(stats.completed+stats.cancelled+stats.declined+stats.pending)/stats.total*360}deg, 
                     ${getStatusColor("no show")} 360deg
                   )`,
                   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                 }}>
              <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center flex-col shadow-md">
                <div className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-500">Appointments</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("confirmed")}}></div>
              <span className="text-sm font-medium">Completed: <span className="text-gray-900">{stats.completed}</span></span>
              </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("pending")}}></div>
              <span className="text-sm font-medium">Pending: <span className="text-gray-900">{stats.pending}</span></span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("cancelled")}}></div>
              <span className="text-sm font-medium">Cancelled: <span className="text-gray-900">{stats.cancelled}</span></span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("declined")}}></div>
              <span className="text-sm font-medium">Declined: <span className="text-gray-900">{stats.declined}</span></span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("no show")}}></div>
              <span className="text-sm font-medium">No Show: <span className="text-gray-900">{stats.noShow}</span></span>
            </div>
          </div>
        </div>

        {/* Service Categories Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 text-lg">Service Categories</h3>
          </div>
          <ServiceCategory appointmentData={filteredAppointments} />
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;