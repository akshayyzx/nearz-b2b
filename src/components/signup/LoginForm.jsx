import React, { useState } from "react";
import { verifyLoginApi } from "../api/verification/VerifyLoginApi";

const LoginForm = ({ initialPhone = "" }) => {
    const [phone, setPhone] = useState(initialPhone);
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            // Verify with provided OTP
            const verificationResult = await verifyLoginApi(phone, otp);
            
            // Store the token
            setToken(verificationResult.token || verificationResult.access_token);
            
            console.log("Login successful!", verificationResult);
            alert("Login successful!");
            
            // redirect the user or update UI based on successful login
            
        } catch (error) {
            console.error("Login Error:", error);
            setError("Login failed. Please check your phone number and OTP and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
            <form onSubmit={handleLogin}>
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        id="phone"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
                    <input
                        type="text"
                        id="otp"
                        placeholder="Enter your OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
            
            {token && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="font-semibold text-green-800">Logged in successfully!</h3>
                    <p className="text-sm text-green-700">Token received and stored.</p>
                </div>
            )}
        </div>
    );
};

export default LoginForm;