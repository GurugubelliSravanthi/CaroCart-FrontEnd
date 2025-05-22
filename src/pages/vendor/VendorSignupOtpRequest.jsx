import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorSignupRequestOtp = () => {
  const [vendor, setVendor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    gstNumber: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:8081/vendors/signup/request-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vendor),
        }
      );

      const data = await res.text();

      if (res.ok) {
        alert("OTP sent to your email. Please verify.");
        navigate(
          `/vendors/signup/verify-otp?email=${encodeURIComponent(vendor.email)}`
        );
      } else {
        setMessage(data);
      }
    } catch (error) {
      setMessage("Error requesting OTP: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Vendor Signup - Request OTP</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="First Name"
          value={vendor.firstName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="lastName"
          placeholder="Last Name"
          value={vendor.lastName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={vendor.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="mobileNumber"
          placeholder="Mobile Number"
          value={vendor.mobileNumber}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={vendor.password}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="gstNumber"
          placeholder="GST Number"
          value={vendor.gstNumber}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Request OTP</button>
      </form>
    </div>
  );
};

export default VendorSignupRequestOtp;
