import React, { useState } from "react";
import { SignUpFormApi } from "../api/signup/SignUpFormApi";
import signupview from "../../assets/signupview.png";

const SignUpForm = ({ onSignupSuccess }) => {
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(""); // To handle the name input

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const normalizedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

    try {
      const result = await SignUpFormApi(normalizedPhone, referralCode, name);
      
      // Store the user's name in localStorage
      localStorage.setItem("userName", name);
      
      // Also store the phone number for reference
      // localStorage.setItem("userPhone", normalizedPhone);
      
      onSignupSuccess(normalizedPhone);
      alert("Signup successful!");
    } catch (error) {
      alert("Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="h-screen w-full">
        <img
          src={signupview}
          alt="Signup Visual"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Right Side - Signup Form */}
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Sign Up
          </h1>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="referralCode"
              className="block text-sm font-medium text-gray-700"
            >
              Referral Code (Optional)
            </label>
            <input
              type="text"
              id="referralCode"
              placeholder="Enter referral code if you have one"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#DD4F2E] text-white font-semibold rounded-lg hover:bg-[#C9381E] focus:outline-none focus:ring-2 focus:ring-[#DD4F2E] disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? "Signing Up…" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;