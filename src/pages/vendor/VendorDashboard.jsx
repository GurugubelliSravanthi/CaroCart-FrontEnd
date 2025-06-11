// src/pages/VendorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorDashboard.css"; // optional, if styling needed

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [vendorName, setVendorName] = useState("Vendor");

  useEffect(() => {
    const token = localStorage.getItem("carocart_token");

    if (!token) {
      navigate("/vendors/login");
      return;
    }

    const decoded = parseJwt(token);

    if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("carocart_token");
      navigate("/vendors/login");
      return;
    }

    if (decoded.firstName && decoded.lastName) {
      setVendorName(`${decoded.firstName} ${decoded.lastName}`);
    } else if (decoded.sub) {
      setVendorName(decoded.sub);
    } else {
      localStorage.removeItem("carocart_token");
      navigate("/vendors/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("carocart_token");
    navigate("/vendors/login");
  };

  const handleManageProducts = () => {
    navigate("/vendors/products");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Welcome, {vendorName}!</h1>
      <p className="dashboard-subtitle">
        This is your CaroCart Vendor Dashboard.
      </p>

      <div className="button-container">
        <button
          onClick={handleManageProducts}
          className="dashboard-button button-primary"
        >
          Manage Products
        </button>

        <button
          onClick={handleLogout}
          className="dashboard-button button-logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default VendorDashboard;
