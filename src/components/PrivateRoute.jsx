// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Helper to decode JWT payload
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

/**
 * PrivateRoute component
 * @param {ReactNode} children - component(s) to render if authorized
 * @param {string} [role] - optional role to check (e.g., "ADMIN", "VENDOR", "USER")
 */
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("carocart_token");

  if (!token) {
    // No token found, redirect to login
    if (role === "ADMIN") {
      return <Navigate to="/admins/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  const decoded = parseJwt(token);

  if (!decoded || !decoded.exp) {
    // Invalid token, redirect to login
    if (role === "ADMIN") {
      return <Navigate to="/admins/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Check token expiration (exp is in seconds)
  const now = Date.now() / 1000;
  if (decoded.exp < now) {
    // Token expired, redirect to login
    if (role === "ADMIN") {
      return <Navigate to="/admins/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (role && decoded.role !== role) {
    // Role doesn't match, redirect accordingly
    if (role === "ADMIN") {
      return <Navigate to="/admins/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Token exists, not expired, and role matches if required
  return children;
};

export default PrivateRoute;
