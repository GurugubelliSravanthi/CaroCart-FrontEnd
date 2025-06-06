import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/authService";
import "./AdminLogin.css";

// Decode JWT to extract role
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false); // 👁 Toggle state

  // ✅ Redirect if already logged in as ADMIN
  useEffect(() => {
    const token = localStorage.getItem("carocart_token");
    if (token) {
      const user = parseJwt(token);
      if (user?.role === "ADMIN") {
        navigate("/admins/dashboard");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await adminLogin({ email, password });
      if (response.data.token) {
        localStorage.setItem("carocart_token", response.data.token);
        localStorage.setItem("role", "ADMIN");
        window.dispatchEvent(new Event("carocart-login"));
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

        <div className="form-group password-wrapper">
          <label className="form-label">Password:</label>
          <div className="password-input-container">
            <input
              type={visible ? "text" : "password"}
              className="form-input password-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye-icon" onClick={() => setVisible(!visible)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                {visible ? (
                  <>
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a17.28 17.28 0 0 1 4.88-5.68" />
                    <path d="M3 3l18 18" />
                    <path d="M9.5 9.5a3 3 0 0 1 4.24 4.24" />
                    <path d="M14.5 14.5a3 3 0 0 1-4.24-4.24" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </span>
          </div>
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
