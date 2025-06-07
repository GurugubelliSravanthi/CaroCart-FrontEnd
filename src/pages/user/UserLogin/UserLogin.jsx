import React, { useState, useEffect, useRef } from "react";
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

function getUserRoleFromToken() {
  const token = localStorage.getItem("carocart_token");
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.role || null;
}

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
    style={{ cursor: "pointer" }}
    viewBox="0 0 24 24"
    aria-label={visible ? "Hide password" : "Show password"}
    role="button"
  >
    {visible ? (
      <>
        <path d="M17.94 17.94A10.93 10.93 0 0112 19c-7 0-10-7-10-7a17.56 17.56 0 014.61-5.46" />
        <path d="M1 1l22 22" />
        <path d="M9.53 9.53a3 3 0 004.24 4.24" />
        <path d="M14.12 14.12A3 3 0 019.88 9.88" />
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
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    const role = getUserRoleFromToken();
    if (role === "USER") {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("http://localhost:8081/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setLoginError("Email or password is incorrect.");
        return;
      }

      const token = await res.text();
      localStorage.setItem("carocart_token", token);
      const user = parseJwt(token);
      localStorage.setItem(
        "user",
        JSON.stringify(
          user ? { email: user.sub, role: user.role } : { email: "", role: "" }
        )
      );
      window.dispatchEvent(new Event("carocart-login"));

      // ✅ Submit hidden native form to prompt Chrome to save password
      setTimeout(() => {
        if (formRef.current) formRef.current.submit();
      }, 200);

      navigate("/");
    } catch (error) {
      setLoginError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">
            Please enter your credentials to login
          </p>
        </div>

        {/* ✅ Error Message */}
        {loginError && (
          <div className="login-error" style={{ color: "red", marginBottom: "10px" }}>
            {loginError}
          </div>
        )}

        {/* ✅ Hidden native form for Chrome password manager */}
        <form
          ref={formRef}
          action="/dummy-login"
          method="POST"
          style={{ display: "none" }}
        >
          <input name="email" type="email" value={email} readOnly />
          <input name="password" type="password" value={password} readOnly />
          <button type="submit">Submit</button>
        </form>

        {/* ✅ Visible React login form */}
        <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group password-group">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              required
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <div className="eye-icon">
              <EyeIcon
                onClick={() => setShowPassword(!showPassword)}
                visible={showPassword}
              />
            </div>
          </div>

          <p>
            Forgot your password?{" "}
            <Link to="/forgot-password">Reset it here</Link>
          </p>

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
    </div>
  );
};

export default UserLogin;