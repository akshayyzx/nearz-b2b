const eventsData = [
    {
      id: 4584,
      date: "2025-04-01",
      start_time: "01:15 pm",
      end_time: "02:35 pm",
      amount: 315.0,
      status: "Pending",
      comment: "test",
      duration: "80",
      user: { id: 4442, username: "Akshay" },
      salon_services: [{ service_name: "Hair Conditioning" }],
    },
    {
      id: 4585,
      date: "2025-04-02",
      start_time: "10:00 am",
      end_time: "11:00 am",
      amount: 250.0,
      status: "Booked",
      comment: "Regular appointment",
      duration: "60",
      user: { id: 4443, username: "Priya" },
      salon_services: [{ service_name: "Facial" }],
    },
    {
      id: 4586,
      date: "2025-04-03",
      start_time: "03:30 pm",
      end_time: "04:45 pm",
      amount: 400.0,
      status: "Completed",
      comment: "First-time customer",
      duration: "75",
      user: { id: 4444, username: "Rohan" },
      salon_services: [{ service_name: "Haircut & Styling" }],
    },
    {
      id: 4587,
      date: "2025-04-04",
      start_time: "12:00 pm",
      end_time: "01:30 pm",
      amount: 500.0,
      status: "Cancelled",
      comment: "Client rescheduled",
      duration: "90",
      user: { id: 4445, username: "Megha" },
      salon_services: [{ service_name: "Full Body Massage" }],
    },
    {
      id: 4588,
      date: "2025-04-05",
      start_time: "09:30 am",
      end_time: "10:30 am",
      amount: 200.0,
      status: "NoShow",
      comment: "Client didn't arrive",
      duration: "60",
      user: { id: 4446, username: "Amit" },
      salon_services: [{ service_name: "Beard Trim" }],
    },
    {
      id: 4589,
      date: "2025-04-06",
      start_time: "05:00 pm",
      end_time: "06:15 pm",
      amount: 350.0,
      status: "Booked",
      comment: "VIP customer",
      duration: "75",
      user: { id: 4447, username: "Simran" },
      salon_services: [{ service_name: "Pedicure & Manicure" }],
    },
    {
      id: 4590,
      date: "2025-04-07",
      start_time: "11:45 am",
      end_time: "12:45 pm",
      amount: 275.0,
      status: "noshow",
      comment: "Frequent visitor",
      duration: "60",
      user: { id: 4448, username: "Karan" },
      salon_services: [{ service_name: "Hair Spa" }],
    },
    {
      id: 4591,
      date: "2025-04-08",
      start_time: "02:15 pm",
      end_time: "03:45 pm",
      amount: 450.0,
      status: "Pending",
      comment: "Special request",
      duration: "90",
      user: { id: 4449, username: "Neha" },
      salon_services: [{ service_name: "Bridal Makeup" }],
    },
    {
      id: 4592,
      date: "2025-04-09",
      start_time: "06:30 pm",
      end_time: "07:45 pm",
      amount: 380.0,
      status: "Booked",
      comment: "Evening slot",
      duration: "75",
      user: { id: 4450, username: "Vikram" },
      salon_services: [{ service_name: "Detox Treatment" }],
    },
    {
      id: 4593,
      date: "2025-04-10",
      start_time: "04:00 pm",
      end_time: "05:30 pm",
      amount: 500.0,
      status: "Cancelled",
      comment: "Client requested cancellation",
      duration: "90",
      user: { id: 4451, username: "Ananya" },
      salon_services: [{ service_name: "Keratin Treatment" }],
    },
  ];
  
  export default eventsData;