import React, { useEffect, useState } from "react";
import { fetchAppointments, generateBill } from "./FetchAppointmentSlots";
import { useNavigate } from "react-router-dom";

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "#2DC653"; // emerald
      case "pending":
        return "#F39C12"; // amber
      case "declined":
        return "#2280BF"; // rose
      case "cancelled":
        return "#D91F0B"; // purple
      case "no show":
        return "#ADB5BD"; // gray
      default:
        return "#6b7280"; // gray
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-rose-500 bg-rose-50 rounded-xl shadow">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">{error}</p>
      </div>
    );

  return (
    <div className="w-full mx-auto p-4 sm:p-6">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
        Appointments Dashboard
      </h2>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Appointments</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-500">Cancelled</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-rose-600">{stats.declined}</div>
          <div className="text-sm text-gray-500">Declined</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.noShow}</div>
          <div className="text-sm text-gray-500">No Show</div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white rounded-xl shadow p-4 ">
          <h3 className="font-semibold mb-4 text-gray-700">Appointments By Status</h3>
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-full border-8 border-white relative flex items-center justify-center"
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
                   )`
                 }}>
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center text-lg font-bold">
                {stats.total}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("confirmed")}}></div>
              <span className="text-sm">Completed: {stats.completed}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("cancelled")}}></div>
              <span className="text-sm">Cancelled: {stats.cancelled}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("declined")}}></div>
              <span className="text-sm">Declined: {stats.declined}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("pending")}}></div>
              <span className="text-sm">Pending: {stats.pending}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: getStatusColor("no show")}}></div>
              <span className="text-sm">No Show: {stats.noShow}</span>
            </div>
          </div>
        </div>

        {/* Service Category Chart (Placeholder) */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-4 text-gray-700">Appointments By Service Category</h3>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-full flex space-x-4 justify-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 w-8" style={{height: '120px'}}></div>
                <span className="text-xs mt-1">Haircut</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-400 w-8" style={{height: '80px'}}></div>
                <span className="text-xs mt-1">Styling</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 w-8" style={{height: '60px'}}></div>
                <span className="text-xs mt-1">Color</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-400 w-8" style={{height: '150px'}}></div>
                <span className="text-xs mt-1">Facial</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 w-8" style={{height: '100px'}}></div>
                <span className="text-xs mt-1">Manicure</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-400 w-8" style={{height: '90px'}}></div>
                <span className="text-xs mt-1">Pedicure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Appointment History */}
      <h3 className="text-xl font-bold mb-4 text-gray-800">Appointment History</h3>
      <div className="flex mb-6">
        <div className="flex rounded-xl bg-gray-100 p-1 shadow-inner">
          <button
            onClick={() => setSelectedTab("upcoming")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === "upcoming"
                ? "bg-white text-[#4F46E5] shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedTab("previous")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === "previous"
                ? "bg-white text-[#4F46E5] shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Previous
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl shadow-sm border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 font-medium text-lg">No {selectedTab} appointments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Date & Time</th>
                <th className="py-3 px-4 text-left">Services</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-left">Total Bill</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{appt.user?.username || "Customer Name"}</div>
                    <div className="text-gray-500 text-xs">{appt.user?.mobile || "Phone number"}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div>{formatDate(appt.date)}</div>
                    <div className="text-xs text-gray-500">
                      {appt.start_time} - {appt.end_time}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate">
                      {(appt.salon_services || []).map((s) => s.custom_name || s.service_name).join(", ")}
                    </div>
                  </td>
                  <td className="py-3 px-4">{appt.duration || "60"} min</td>
                  <td className="py-3 px-4 font-medium">₹{appt.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handleGenerateBill(appt.id)}
                        disabled={billStatus[appt.id] === "loading"}
                        className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs hover:bg-indigo-200 transition"
                      >
                        {billStatus[appt.id] === "loading" ? "..." : "Generate Bill"}
                      </button>
                      <button
                        onClick={() => openInvoiceWindow(appt.ulid)}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-200 transition"
                      >
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
    </div>
  );
};

export default AppointmentsDashboard;