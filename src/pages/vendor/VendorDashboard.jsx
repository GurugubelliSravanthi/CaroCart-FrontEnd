// src/pages/VendorDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simple JWT decode without external lib
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("vendorJwtToken");

  useEffect(() => {
    if (!token) {
      navigate("/vendors/login");
    }
  }, [token, navigate]);

  let vendorEmail = "Vendor";

  if (token) {
    const decoded = parseJwt(token);
    if (decoded && decoded.sub) {
      vendorEmail = decoded.sub;
    } else {
      localStorage.removeItem("vendorJwtToken");
      navigate("/vendors/login");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("vendorJwtToken");
    navigate("/vendors/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {vendorEmail}!</h1>
      <p>This is your CaroCart Vendor Dashboard.</p>

      {/* You can add more vendor-specific features here */}

      <button
        onClick={handleLogout}
        style={{ marginTop: 20, padding: "8px 16px" }}
      >
        Logout
      </button>
    </div>
  );
};

export default VendorDashboard;
