import React, { useState } from "react";
import { VerifyLoginApi } from "../api/verification/VerifyLoginApi";
import nearzlogin from "../../../src/assets/nearz-log.png"; // Ensure the path is correct
import signupview from "../../assets/signupview.png"; // Ensure the path is correct

const LoginForm = ({ initialPhone = "", onLoginSuccess }) => {
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const verificationResult = await VerifyLoginApi(phone, otp);
      console.log("Login successful!", verificationResult);

      const token = verificationResult?.token; // ✅ Extract the token

      if (token) {
        localStorage.setItem("authToken", token); // ✅ Store in localStorage

        if (onLoginSuccess) {
          onLoginSuccess(); // trigger post-login behavior
        }
      } else {
        setError("Login failed: Token not found in response.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Login failed. Please check your phone number and OTP and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left Side - Background Image */}
      <div className="hidden md:block h-full">
        <img
          src={signupview}
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={nearzlogin}
              alt="Nearz Login"
              className="w-32 h-auto object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Login to Your Account
          </h1>

          <form onSubmit={handleLogin}>
            {/* Phone Number Input */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#DD4F2E] text-white font-semibold rounded-lg hover:bg-[#C9381E] focus:outline-none focus:ring-2 focus:ring-[#DD4F2E] disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Don't have an account link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-[#DD4F2E] font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;