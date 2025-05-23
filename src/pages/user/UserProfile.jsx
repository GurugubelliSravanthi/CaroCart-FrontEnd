import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      setMessage("❌ Update failed. Try again.");
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>User Profile</h2>
      {message && (
        <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Email (read-only):</label>
          <input
            type="email"
            name="email"
            value={user.email}
            readOnly
            style={{
              width: "100%",
              backgroundColor: "#f0f0f0",
              marginBottom: 10,
            }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
