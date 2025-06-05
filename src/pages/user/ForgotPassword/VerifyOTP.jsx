// src/pages/user/VerifyOtp.js
import React, { useState } from "react";
import { verifyOTP } from "../../../services/authService";
import "./VerifyOTP.css"; // Assuming you have some styles for the form

const VerifyOTP = ({ emailOrPhone, onSuccess, onBack }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(emailOrPhone, otp);
      onSuccess(); // Move to reset password
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <div className="form-container"> 
    <form onSubmit={handleSubmit}>
      <h3>Enter OTP sent to {emailOrPhone}</h3>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />
      <button type="submit">Verify OTP</button>
      <button type="button" onClick={onBack}>Back</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    </div>
  );
};

export default VerifyOTP;
