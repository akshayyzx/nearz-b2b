import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAppointments, generateBill } from "./FetchAppointmentSlots";
import CustomDateRangeComponent from "./CustomDateRangeComponent";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  FileText, 
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  ClockIcon,
  Search,
  Filter
} from "lucide-react";

const BillingHistory = ({ onUpdateStats }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [billStatus, setBillStatus] = useState({});
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch appointments
  useEffect(() => {
    const loadAppointments = async () => {      
      try {
        setLoading(true);
        const data = await fetchAppointments();
        console.log("Appointments:", data);
  
        if (data && Array.isArray(data)) {
          setAppointments(data);
          
          // Initial filtering based on selected tab
          filterAppointmentsByTab(data, selectedTab);
  
          // Calculate and update stats
          const calculatedStats = {
            total: data.length,
            completed: data.filter(a => a.status.toLowerCase() === "confirmed").length,
            cancelled: data.filter(a => a.status.toLowerCase() === "cancelled").length,
            declined: data.filter(a => a.status.toLowerCase() === "declined").length,
            pending: data.filter(a => a.status.toLowerCase() === "pending").length,
            noShow: data.filter(a => a.status.toLowerCase() === "no show").length
          };
  
          // Pass stats to parent component
          if (onUpdateStats) {
            onUpdateStats(calculatedStats);
          }
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
  }, [onUpdateStats]);

  // Filter appointments when tab changes
  useEffect(() => {
    filterAppointmentsByTab(appointments, selectedTab);
  }, [selectedTab, appointments]);

  // Filter appointments when search query changes
  useEffect(() => {
    const filtered = filterAppointmentsBySearch(filteredAppointments, searchQuery);
    setFilteredAppointments(filtered);
  }, [searchQuery]);

  const filterAppointmentsByTab = (appts, tab) => {
    if (!appts || !Array.isArray(appts) || appts.length === 0) {
      setFilteredAppointments([]);
      return;
    }
    
    const filtered = appts.filter((appt) => 
      tab === "upcoming" ? isUpcoming(appt?.date) : !isUpcoming(appt?.date)
    );
    
    setFilteredAppointments(filtered);
  };

  const filterAppointmentsBySearch = (appts, query) => {
    if (!query) return appts;
    
    return appts.filter((appt) => {
      const queryLower = query.toLowerCase();
      
      // Search by customer name
      const customerName = appt.user?.username?.toLowerCase() || "";
      if (customerName.includes(queryLower)) return true;
      
      // Search by service
      const services = (appt.salon_services || [])
        .map((s) => (s.custom_name || s.service_name || "").toLowerCase())
        .join(" ");
      if (services.includes(queryLower)) return true;
      
      // Search by status
      const status = (appt.status || "").toLowerCase();
      if (status.includes(queryLower)) return true;
      
      // Search by date
      const date = formatDate(appt.date).toLowerCase();
      if (date.includes(queryLower)) return true;
      
      return false;
    });
  };

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

  const isUpcoming = (dateStr) => {
    const today = new Date();
    const appointmentDate = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateRangeChange = (startDate, endDate, customData) => {
    if (!startDate || !endDate) {
      // Reset to default filtered appointments by tab
      filterAppointmentsByTab(appointments, selectedTab);
      return;
    }

    // Filter appointments by date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set hours to 0 for date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    const filtered = appointments.filter(appt => {
      const appointmentDate = new Date(appt.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= start && appointmentDate <= end;
    });
    
    setFilteredAppointments(filtered);
  };

  const openInvoiceWindow = (ulid) => {
    navigate(`/bill/${ulid}`);
  };

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 mt-50">
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
    <div>
      {/* Header and Filter Section */}
      <div className="flex justify-between items-center mb-6 w-[1350px] mt-10 -ml-20">
        <h3 className="text-4xl font-bold text-gray-800 ml-20">Billing History</h3>
        <div className="flex space-x-4">
          {/* Date Filter */}
          <div className="flex items-center">
            <CustomDateRangeComponent onDateRangeChange={handleDateRangeChange} />
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center text-xs mb-7 font-medium bg-indigo-50 hover:bg-gray-200 text-indigo-600 px-3 py-1.5 rounded-lg transition-colors duration-200">
              <FileText size={14} className="mr-1" />
              <span>Export</span>
            </button>
            {/* <button className="flex items-center text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
              <Calendar size={14} className="mr-1" />
              <span>Schedule</span>
            </button> */}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col mb-6 space-y-4">
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
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none bg-white rounded-lg ">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by customer, service, or status..."
            className="pl-10 pr-4 py-3 w-full bg-white  border-gray-200 rounded-lg shadow  focus:border-indigo-400 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl shadow-lg border border-gray-100">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <Calendar size={40} className="text-gray-400" />
          </div>
          {searchQuery ? (
            <>
              <p className="text-gray-500 font-medium text-lg mb-2">No appointments found matching "{searchQuery}"</p>
              <p className="text-gray-400 max-w-md mx-auto">Try adjusting your search or clear filters to see more results.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md"
              >
                Clear Search
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 font-medium text-lg mb-2">No {selectedTab} appointments found.</p>
              <p className="text-gray-400 max-w-md mx-auto">When you have {selectedTab} appointments, they will appear here.</p>
              <button className="mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md">
                Schedule New Appointment
              </button>
            </>
          )}
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
          {searchQuery && (
            <p className="text-xs text-gray-400 mt-1">
              Filtered by: "{searchQuery}"
            </p>
          )}
        </div>
        <div className="flex items-center">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;