// src/pages/user/ForgotPassword.js
import React, { useState } from "react";
import { requestOTP } from "../../../services/authService";
import "./ForgotPassword.css";

const ForgotPassword = ({ onSuccess }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestOTP(emailOrPhone);
      onSuccess(emailOrPhone); // Move to OTP page
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  return (
    <div className="form-container"> 
    <form onSubmit={handleSubmit}>
      <h3>Enter your Email</h3>
      <input
        type="text"
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit">Send OTP</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    </div>
  );
};

export default ForgotPassword;
