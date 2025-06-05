import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css"; 

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

const UserDashBoard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("carocart_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = parseJwt(token);

    if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("carocart_token");
      navigate("/login");
      return;
    }

    if (decoded.firstName && decoded.lastName) {
      setUserName(`${decoded.firstName} ${decoded.lastName}`);
    } else if (decoded.sub) {
      setUserName(decoded.sub);
    } else {
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
    <div className="dashboard-container">
      <h1 className="dashboard-header">Welcome, {userName}!</h1>
      <p className="dashboard-subtitle">
        This is your CaroCart User Dashboard.
      </p>

      <div className="button-container">
        <button
          onClick={handleProfile}
          className="dashboard-button button-primary"
        >
          View Profile
        </button>

        <button
          onClick={handleBrowseProducts}
          className="dashboard-button button-secondary"
        >
          Browse Products
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

export default UserDashBoard;
