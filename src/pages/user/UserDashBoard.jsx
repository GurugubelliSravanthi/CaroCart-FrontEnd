// src/pages/UserDashBoard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Simple JWT decode without external lib
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const UserDashBoard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("carocart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = parseJwt(token);

    // Check token expiration
    if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
      // Token expired or invalid, logout
      localStorage.removeItem("carocart_token");
      navigate("/login");
      return;
    }

    if (decoded && decoded.sub) {
      setUserEmail(decoded.sub);
    } else {
      console.error("Invalid token");
      localStorage.removeItem("carocart_token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("carocart_token");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleBrowseProducts = () => {
    navigate("/products");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {userEmail}!</h1>
      <p>This is your CaroCart User Dashboard.</p>

      <button
        onClick={handleProfile}
        style={{ marginTop: 20, padding: "8px 16px", marginRight: "10px" }}
      >
        View Profile
      </button>

      <button
        onClick={handleBrowseProducts}
        style={{ marginTop: 20, padding: "8px 16px", marginRight: "10px" }}
      >
        Browse Products
      </button>

      <button
        onClick={handleLogout}
        style={{ marginTop: 20, padding: "8px 16px" }}
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashBoard;
