import React, { useEffect, useState } from "react";
import { fetchAppointments, generateBill } from "./FetchAppointmentSlots";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [billStatus, setBillStatus] = useState({});
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchAppointments();
        setAppointments(data);
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
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "pending":
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case "declined":
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
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
    selectedTab === "upcoming" ? isUpcoming(appt.date) : !isUpcoming(appt.date)
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
    <div className="w-320 mx-auto p-4 sm:p-6 ">
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#F25435] to-[#DD4F2E] bg-clip-text text-transparent">
        Your Appointments
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex rounded-xl bg-gray-100 p-1 shadow-inner">
          <button
            onClick={() => setSelectedTab("upcoming")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === "upcoming"
                ? "bg-white text-[#F25435] shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedTab("previous")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              selectedTab === "previous"
                ? "bg-white text-[#F25435] shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Previous
          </button>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl shadow-sm border border-gray-100 mt-50">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 font-medium text-lg">No {selectedTab} appointments found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#F25435] to-[#DD4F2E] p-4 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{appt.salon?.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${getStatusClass(appt.status)}`}>
                    {getStatusIcon(appt.status)}
                    {appt.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex flex-wrap gap-6 mb-4">
                  {/* Date & Time */}
                  <div className="flex items-start space-x-3">
                    <div className="text-[#F25435]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">DATE & TIME</p>
                      <p className="text-gray-700 font-medium">{formatDate(appt.date)}</p>
                      <p className="text-gray-700">{appt.start_time} - {appt.end_time}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-start space-x-3">
                    <div className="text-[#F25435]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">AMOUNT</p>
                      <p className="text-gray-700 font-bold">₹{appt.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mt-5">
                  <h4 className="text-sm text-gray-500 font-medium mb-2">SERVICES BOOKED</h4>
                  <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                    {appt.salon_services.map((service, index) => (
                      <div key={service.id} className={`flex justify-between ${index !== 0 ? "border-t border-gray-200 pt-2" : ""}`}>
                      <p className="text-gray-700 font-medium">{service.custom_name || service.service_name}</p>
                      <p className="text-gray-700 font-semibold">₹{service.amount}</p>
                    </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleGenerateBill(appt.id)}
                    disabled={billStatus[appt.id] === "loading"}
                    className="flex-1 bg-gradient-to-r from-[#F25435] to-[#DD4F2E] hover:from-[#F25435] to-[#DD4F2E] text-white px-4 py-3 rounded-xl font-medium transition disabled:opacity-50 flex justify-center items-center"
                  >
                    {billStatus[appt.id] === "loading" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>Generate Bill</>
                    )}
                  </button>

                  <button
                    onClick={() => openInvoiceWindow(appt.ulid)}
                    className="flex-1 bg-white border-2 border-[#F25435] text-[#F25435] hover:bg-purple-50 px-4 py-3 rounded-xl font-medium transition flex justify-center items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Bill
                  </button>
                </div>

                {billStatus[appt.id] === "success" && (
                  <div className="mt-3 bg-emerald-50 text-emerald-700 p-2 rounded-lg flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bill sent successfully!
                  </div>
                )}
                
                {billStatus[appt.id] === "error" && (
                  <div className="mt-3 bg-rose-50 text-rose-700 p-2 rounded-lg flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Failed to send bill. Please try again.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;