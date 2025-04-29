import React, { useEffect, useState } from "react";
import { fetchAppointments, generateBill } from "./FetchAppointmentSlots";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  CreditCard, 
  FileText, 
  PieChart, 
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  ClockIcon,
  BarChart3
} from "lucide-react";

const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [billStatus, setBillStatus] = useState({});
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const navigate = useNavigate();

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
  
          const calculatedStats = {
            total: data.length,
            completed: data.filter(a => a.status.toLowerCase() === "confirmed").length,
            cancelled: data.filter(a => a.status.toLowerCase() === "cancelled").length,
            declined: data.filter(a => a.status.toLowerCase() === "declined").length,
            pending: data.filter(a => a.status.toLowerCase() === "pending").length,
            noShow: data.filter(a => a.status.toLowerCase() === "no show").length
          };
  
          setStats(calculatedStats);
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
  
  const handleGenerateBill = async (appointmentId) => {
    setBillStatus((prev) => ({ ...prev, [appointmentId]: "loading" }));

    try {
      const result = await generateBill(appointmentId);

      if (result.success) {
        setBillStatus((prev) => ({ ...prev, [appointmentId]: "success" }));
        setTimeout(() => {
          setBillStatus((prev) => {
            const newStatus = { ...prev };
            delete newStatus[appointmentId];
            return newStatus;
          });
        }, 3000);
      } else {
        setBillStatus((prev) => ({ ...prev, [appointmentId]: "error" }));
      }
    } catch (error) {
      setBillStatus((prev) => ({ ...prev, [appointmentId]: "error" }));
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "declined":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "cancelled":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "no show":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle size={16} className="text-emerald-700" />;
      case "pending":
        return <ClockIcon size={16} className="text-amber-700" />;
      case "declined":
        return <XCircle size={16} className="text-rose-700" />;
      case "cancelled":
        return <AlertCircle size={16} className="text-purple-700" />;
      case "no show":
        return <XCircle size={16} className="text-gray-700" />;
      default:
        return <ClockIcon size={16} className="text-gray-700" />;
    }
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

  const isUpcoming = (dateStr) => {
    const today = new Date();
    const appointmentDate = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  };

  const filteredAppointments = appointments.filter((appt) =>
    selectedTab === "upcoming" ? isUpcoming(appt?.date) : !isUpcoming(appt?.date)
  );

  const openInvoiceWindow = (ulid) => {
    navigate(`/bill/${ulid}`);
  };

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
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
    <div className="w-[200%] w-[1400px] mx-auto p-4 sm:p-6 ml-10">
     <div className="mb-8 text-center">
      <h2 className="text-3xl font-bold text-[#F25435]">
      Appointments Dashboard
    </h2>
        {/* <div className="mt-4 md:mt-0">
          <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center">
            <Calendar size={18} className="mr-2" />
            <span>New Appointment</span>
          </button>
        </div> */}
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
            <ClockIcon size={20} className="text-amber-500" />
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
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("cancelled")}}></div>
              <span className="text-sm font-medium">Cancelled: <span className="text-gray-900">{stats.cancelled}</span></span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("declined")}}></div>
              <span className="text-sm font-medium">Declined: <span className="text-gray-900">{stats.declined}</span></span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("pending")}}></div>
              <span className="text-sm font-medium">Pending: <span className="text-gray-900">{stats.pending}</span></span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("no show")}}></div>
              <span className="text-sm font-medium">No Show: <span className="text-gray-900">{stats.noShow}</span></span>
            </div>
          </div>
        </div>

        {/* Service Category Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 text-lg">Appointments By Service Category</h3>
            <div className="flex items-center text-indigo-600 text-sm font-medium cursor-pointer">
              <span>View Report</span>
              <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              {serviceCategories.map((service, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    <span className="text-sm font-medium text-gray-900">{service.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" 
                      style={{ width: `${(service.value / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-500">Total Services:</span>
                <span className="font-medium text-gray-900 ml-1">60</span>
              </div>
              <button className="flex items-center text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
                <BarChart3 size={14} className="mr-1" />
                <span>Detailed Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Appointment History */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Appointment History</h3>
        <div className="flex space-x-2">
          <button className="flex items-center text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors duration-200">
            <FileText size={14} className="mr-1" />
            <span>Export</span>
          </button>
          <button className="flex items-center text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
            <Calendar size={14} className="mr-1" />
            <span>Schedule</span>
          </button>
        </div>
      </div>
      
      <div className="flex mb-6">
        <div className="flex rounded-xl bg-gray-100 p-1.5 shadow-inner">
          <button
            onClick={() => setSelectedTab("upcoming")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              selectedTab === "upcoming"
                ? "bg-white text-indigo-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedTab("previous")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              selectedTab === "previous"
                ? "bg-white text-indigo-600 shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Previous
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <Calendar size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-lg mb-2">No {selectedTab} appointments found.</p>
          <p className="text-gray-400 max-w-md mx-auto">When you have {selectedTab} appointments, they will appear here.</p>
          <button className="mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md">
            Schedule New Appointment
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bill</th>
                <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <User size={14} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{appt.user?.username || "Customer Name"}</div>
                        <div className="text-gray-500 text-xs">{appt.user?.mobile || "Phone number"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-gray-900">{formatDate(appt.date)}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          {appt.start_time} - {appt.end_time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="max-w-xs truncate font-medium text-gray-700">
                      {(appt.salon_services || []).map((s) => s.custom_name || s.service_name).join(", ")}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 mr-2" />
                      <span className="text-gray-700">{appt.duration || "60"} min</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <CreditCard size={14} className="text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">₹{appt.amount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center w-fit ${getStatusClass(appt.status)}`}>
                      {getStatusIcon(appt.status)}
                      <span className="ml-1.5">{appt.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handleGenerateBill(appt.id)}
                        disabled={billStatus[appt.id] === "loading"}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                          billStatus[appt.id] === "loading" 
                            ? "bg-gray-100 text-gray-400" 
                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                        }`}
                      >
                        <FileText size={14} className="mr-1.5" />
                        {billStatus[appt.id] === "loading" ? "Processing..." : "Generate Bill"}
                      </button>
                      <button
                        onClick={() => openInvoiceWindow(appt.ulid)}
                        className="flex items-center bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-100 transition-all duration-200"
                      >
                        <CreditCard size={14} className="mr-1.5" />
                        View Bill
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
        <div>
          <p>Showing {filteredAppointments.length} {selectedTab} appointments</p>
        </div>
        <div className="flex items-center">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDashboard; 