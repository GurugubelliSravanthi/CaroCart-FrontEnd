import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserLogin.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8081/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        alert("Login failed: " + errorMsg);
        return;
      }

      const token = await res.text();
      localStorage.setItem("carocart_token", token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please enter your credentials to login</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>

      <div className="login-footer">
        Don't have an account?{" "}
        <Link to="/signup" className="login-link">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
