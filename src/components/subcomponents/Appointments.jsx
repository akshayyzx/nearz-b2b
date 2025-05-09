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
  BarChart3
} from "lucide-react";
import AppointmentHistory from "./BillingHistory";
import CustomDateRangeComponent from "./CustomDateRangeComponent"; // Import the existing date picker

const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          setFilteredAppointments(data); // Initialize filtered to all appointments
  
          calculateStats(data);
        } else {
          console.error("Unexpected API response structure:", data);
          setError("Appointments data is not in the expected format.");
        }
      } catch (err) {
        setError(err.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };
  
    loadAppointments();
  }, []);

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

  // Handle date range changes from the CustomDateRangeComponent
  const handleDateRangeChange = (startDate, endDate, customData) => {
    // If no date range is selected (reset), show all appointments
    if (!startDate || !endDate) {
      setFilteredAppointments(appointments);
      calculateStats(appointments);
      return;
    }

    // Filter appointments based on date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the entire end date

    const filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= start && appointmentDate <= end;
    });

    setFilteredAppointments(filtered);
    calculateStats(filtered);
  };

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

  // Service category data (placeholder)
  const serviceCategories = [
    { name: "Haircut", value: 12 },
    { name: "Styling", value: 8 },
    { name: "Color", value: 6 },
    { name: "Facial", value: 15 },
    { name: "Manicure", value: 10 },
    { name: "Pedicure", value: 9 }
  ];

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
    <div className="w-full mx-auto p-4 sm:p-6 ">
      <div className="flex justify-between items-center mb-8 w-[1350px]">
  <h2 className="text-3xl font-bold text-[#F25435]">
    Appointments Dashboard
  </h2>
  
  {/* Date Filter Component */}
  <div className=" p-4 border border-gray-100">
    <CustomDateRangeComponent onDateRangeChange={handleDateRangeChange} />
  </div>
</div>

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
            <div className="flex items-center text-indigo-600 text-sm font-medium cursor-pointer">
              <span>View Details</span>
              <ChevronRight size={16} className="ml-1" />
            </div>
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
            <div className="flex items-center text-indigo-600 text-sm font-medium cursor-pointer">
              <span>View Details</span>
              <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
          <div className="space-y-4">
            {serviceCategories.map((service, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{service.name}</span>
                  <span className="text-sm font-medium text-gray-700">{service.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{width: `${(service.value / Math.max(...serviceCategories.map(s => s.value))) * 100}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;