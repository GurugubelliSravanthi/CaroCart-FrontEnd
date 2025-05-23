// src/pages/VendorProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VendorProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("carocart_token");
  const [vendor, setVendor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    gstNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8081/vendors/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setVendor(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/login");
      });
  }, [token, navigate]);

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    axios
      .put("http://localhost:8081/vendors/profile", vendor, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setMessage("Profile updated successfully"))
      .catch(() => setMessage("Update failed"));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Vendor Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <br />
          <input
            name="firstName"
            value={vendor.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <br />
          <input
            name="lastName"
            value={vendor.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email (read-only):</label>
          <br />
          <input name="email" value={vendor.email} readOnly />
        </div>
        <div>
          <label>Mobile Number:</label>
          <br />
          <input
            name="mobileNumber"
            value={vendor.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>GST Number:</label>
          <br />
          <input
            name="gstNumber"
            value={vendor.gstNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default VendorProfile;
