import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/authService";
import "./AdminLogin.css"; // Import the CSS file

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await adminLogin({ email, password });
      if (response.data.token) {
        localStorage.setItem("carocart_token", response.data.token);
        localStorage.setItem("role", "ADMIN");
        navigate("/admins/dashboard");
      } else {
        setError("Login failed: No token received");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed: Invalid credentials"
      );
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Admin Login</h2>
      {error && <div className="login-error">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
