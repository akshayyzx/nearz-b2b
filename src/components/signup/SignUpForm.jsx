import React, { useState } from "react";
import { SignUpFormApi } from "../api/signup/SignUpFormApi";

const SignUpForm = ({ onSignupSuccess }) => { 
    const [phone, setPhone] = useState("");
    const [referralCode, setReferralCode] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await SignUpFormApi(phone, referralCode);
            console.log("Signup Success:", result);
            alert("Signup successful!");
            
            onSignupSuccess(phone); 
        } catch (error) {
            console.error("Signup Error:", error);
            alert("Signup failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className="mb-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>
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
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
                <input
                    type="text"
                    id="referralCode"
                    placeholder="Enter referral code if you have one"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button 
                type="submit" 
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Sign Up
            </button>
        </form>
    );
};

export default SignUpForm;
