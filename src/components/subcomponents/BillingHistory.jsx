import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAppointments, generateBill } from "./FetchAppointmentSlots";
import DropdownFilter from "./CustomDateRangeComponent";
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
  Filter,
  X
} from "lucide-react";

const BillingHistory = ({ onUpdateStats }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [billStatus, setBillStatus] = useState({});
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all"); // Default filter is "all"
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  const navigate = useNavigate();

  // Define period filter options
  const periodOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "custom", label: "Custom Date Range" }
  ];

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
          filterAppointments(data, selectedTab, searchQuery);
  
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

  // Apply filters when tab or search query changes
  useEffect(() => {
    filterAppointments(appointments, selectedTab, searchQuery);
  }, [selectedTab, searchQuery, appointments]);

  // Apply period filter when it changes
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
    setIsCustomDateOpen(false);
  };

  // Filter appointments based on selected time period
  const filterAppointmentsByPeriod = (appointmentData, period) => {
    if (!appointmentData || !appointmentData.length) return;
    
    const now = new Date();
    let filtered;
    
    // First filter by tab (upcoming or previous)
    appointmentData = appointmentData.filter((appt) => 
      selectedTab === "upcoming" ? isUpcoming(appt?.date) : !isUpcoming(appt?.date)
    );

    // Then apply search if present
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      appointmentData = appointmentData.filter((appt) => {
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
    }
    
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
        // Show all appointments (with tab and search filters already applied)
        filtered = appointmentData;
        break;
    }
    
    setFilteredAppointments(filtered);
  };

  // Centralized filtering function for tab and search
  const filterAppointments = (appts, tab, query) => {
    if (!appts || !Array.isArray(appts) || appts.length === 0) {
      setFilteredAppointments([]);
      return;
    }
    
    // Filter by tab (upcoming or previous)
    let filtered = appts.filter((appt) => 
      tab === "upcoming" ? isUpcoming(appt?.date) : !isUpcoming(appt?.date)
    );
    
    // Apply search query if present
    if (query) {
      const queryLower = query.toLowerCase();
      filtered = filtered.filter((appt) => {
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
    }
    
    setFilteredAppointments(filtered);
    
    // Also apply the period filter if it's set
    if (periodFilter !== "all" && periodFilter !== "custom") {
      filterAppointmentsByPeriod(filtered, periodFilter);
    }
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
      {/* Header with title and period filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 w-[1350px] mt-12 -ml-20">
        <h3 className="text-4xl font-bold text-gray-800 ml-20">Billing History</h3>
        
        {/* Period Filter */}
        <div className="mt-2 md:mt-0">
          <DropdownFilter 
            value={periodFilter}
            onChange={setPeriodFilter}
            options={periodOptions}
          />
        </div>
      </div>

      {/* Custom Date Range Popup */}
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
            className="pl-10 pr-4 py-3 w-full bg-white border-gray-200 rounded-lg shadow focus:border-indigo-400 transition-all duration-200"
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