import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewBill = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const { ulid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Set current date and time when component mounts using Indian format
    const now = new Date();
    const date = now.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const time = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    setFormattedDate(date);
    setFormattedTime(time);
    setCurrentDateTime(`${date} at ${time}`);
  }, []);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://shielded-scrubland-64985.herokuapp.com/appointments/bill?ulid=${ulid}`
        );
        const result = await response.json();

        if (!result.data) {
          throw new Error("Failed to load invoice data");
        }

        setInvoice(result.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error loading invoice. Please try again.");
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [ulid]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-xl w-full text-center">Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="mb-4">No invoice found</p>
        <button 
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    salon,
    id,
    date,
    end_time,
    user,
    salon_services,
    discount,
    discount_type,
    discount_value,
    full_amount,
    gst_details,
    promo_code_discount
  } = invoice;

  // Calculate subtotal from service amounts
  const subtotal = salon_services?.reduce(
    (sum, service) => sum + (service.amount || 0),
    0
  ) || 0;

  // Calculate discount amount based on discount type
  let discountAmount = 0;
  let discountDisplay = '';
  
  if (discount) {
    // If discount is already calculated and provided directly in the API response
    discountAmount = discount;
    discountDisplay = `₹${discountAmount.toFixed(2)}`;
  } else if (discount_value) {
    // Calculate based on discount_type and discount_value
    if (discount_type === 'percentage') {
      discountAmount = (subtotal * discount_value) / 100;
      discountDisplay = `${discount_value}% (₹${discountAmount.toFixed(2)})`;
    } else {
      // Fixed amount discount
      discountAmount = discount_value;
      discountDisplay = `₹${discountAmount.toFixed(2)}`;
    }
  }

  // Handle promo code discount if available
  const promoDiscount = promo_code_discount || 0;

  // Calculate total after discounts (before GST)
  const totalAfterDiscount = subtotal - discountAmount - promoDiscount;
  
  // Calculate GST if gst_details is available
  const gstRate = gst_details?.gst || 0;
  const gstAmount = gst_details?.amount || 0;
  
  // Final total (after discount and including GST)
  const finalTotal = full_amount || (totalAfterDiscount + gstAmount);

  return (
    <div className="min-h-screen bg-white p-4 text-black">
      <div className="max-w-4xl mx-auto p-6 border border-gray-300 rounded">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handleBack}
            className="text-blue-600 underline"
          >
            &lt; Back
          </button>
          <div className="text-sm text-gray-500">
            Generated: {currentDateTime}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">{salon?.name || "Salon Name"}</h2>

        <p className="mb-1"><strong>Address:</strong> {salon?.full_address}</p>
        <p className="mb-3"><strong>Contact:</strong> {salon?.user?.mobile}</p>

        <hr className="my-3" />

        <p className="mb-1"><strong>Invoice:</strong> {id || "N/A"}</p>
        <p className="mb-1"><strong>Service Date:</strong> {date || "N/A"}</p>
        <p className="mb-1"><strong>Invoice Generated on:</strong> {formattedDate} at {formattedTime}</p>
        <p className="mb-1"><strong>Customer:</strong> {user?.username || "Guest"}</p>
        <p className="mb-3"><strong>Contact:</strong> {user?.mobile || "N/A"}</p>

        <table className="w-full border border-gray-400 mb-4">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-100 text-left">Item</th>
              <th className="border border-gray-300 p-2 bg-gray-100 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {salon_services?.length > 0 ? (
              salon_services.map((service, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    {service.service_name}
                    {service.custom_name && (
                      <div className="text-sm text-gray-500">{service.custom_name}</div>
                    )}
                    {service.category_name && (
                      <div className="text-xs text-gray-500">Category: {service.category_name}</div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">₹{service.amount?.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border border-gray-300 p-2 text-center">No services found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-col items-end">
          <p className="mb-1"><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
          
          {/* Display discount with improved formatting */}
          {discountAmount > 0 && (
            <p className="mb-1 text-green-700">
              <strong>Discount:</strong> {discountDisplay}
            </p>
          )}
          
          {/* Display promo code discount if available */}
          {promoDiscount > 0 && (
            <p className="mb-1 text-green-700">
              <strong>Promo Discount:</strong> ₹{promoDiscount.toFixed(2)}
            </p>
          )}
          
          {/* Display total after discounts but before GST */}
          <p className="mb-1"><strong>Total after discounts:</strong> ₹{totalAfterDiscount.toFixed(2)}</p>
          
          {/* Display GST details if available */}
          {gst_details && (
            <>
              <p className="mb-1">
                <strong>GST ({gstRate}%):</strong> ₹{gstAmount.toFixed(2)}
                {gst_details.gst_number && (
                  <span className="text-xs text-gray-500 ml-2">GSTIN: {gst_details.gst_number}</span>
                )}
              </p>
            </>
          )}
          
          <hr className="my-2 w-48" />
          <p className="text-lg font-bold mb-4"><strong>GRAND TOTAL:</strong> ₹{finalTotal.toFixed(2)}</p>
        </div>

        <div className="text-center text-gray-700 mt-8 italic">
          <p>Thank you for your visit!</p>
          <p className="text-sm">This is a system-generated bill and does not require a signature.</p>
          <p className="text-xs mt-2">Viewed on: {currentDateTime}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewBill;