// src/pages/user/ResetPassword.js
import React, { useState } from "react";
import { resetPassword } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

const ResetPassword = ({ emailOrPhone }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(emailOrPhone, password);
      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="form-container"> 
    <form onSubmit={handleSubmit}>
      <h3>Enter New Password</h3>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <button type="submit">Reset Password</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    </div>
  );
};

export default ResetPassword;
