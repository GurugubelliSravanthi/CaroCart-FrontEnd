// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/authService";

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
        localStorage.setItem("jwtToken", response.data.token);
        localStorage.setItem("role", "ADMIN");
        navigate("/admins/vendors/pending"); // redirect to admin vendor approval page
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
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Admin Login</h2>
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Password:</label>
          <br />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: 20, padding: "8px 16px" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
