import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("carocart_token");

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      console.warn("No token found. Redirecting to login...");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8081/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        localStorage.removeItem("carocart_token");
        navigate("/login");
      });
  }, [token, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.put("http://localhost:8081/users/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Update failed. Please try again.");
    }
  };

  if (loading) return <div className="loading-text">Loading profile...</div>;

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-title">User Profile</h2>
      {message && (
        <p
          className={`user-profile-message ${
            message.startsWith("✅") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="user-profile-form">
        <div className="form-group">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            readOnly
            className="form-input"
            style={{ backgroundColor: "#f8fafc", color: "#64748b" }}
          />
        </div>
        <button type="submit" className="submit-button">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
