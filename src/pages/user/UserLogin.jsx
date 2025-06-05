import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserLogin.css";

// JWT decode
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

// Eye icon component
const EyeIcon = ({ onClick, visible }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="eye-icon"
    viewBox="0 0 24 24"
    aria-label={visible ? "Hide password" : "Show password"}
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
);

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8081/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        alert("Login failed: " + errorMsg);
        return;
      }

      const token = await res.text();
      localStorage.setItem("carocart_token", token);
      const user = parseJwt(token);
      localStorage.setItem(
        "user",
        JSON.stringify(user ? { email: user.sub, role: user.role } : { email: "", role: "" })
      );
      window.dispatchEvent(new Event("carocart-login"));
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="login-page">
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

          <div className="form-group password-group">
            <label className="form-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <EyeIcon onClick={() => setShowPassword(!showPassword)} visible={showPassword} />
            </div>
          </div>

          <p>
  Forgot your password? <Link to="/forgot-password">Reset it here</Link>
</p>

          <button type="submit" className="login-button">Sign In</button>
        </form>

        <div className="login-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="login-link">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
