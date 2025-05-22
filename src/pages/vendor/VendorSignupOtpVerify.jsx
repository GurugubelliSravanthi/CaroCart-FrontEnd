import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VendorSignupVerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:8081/vendors/signup/verify-otp?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`,
        {
          method: "POST",
        }
      );

      const data = await res.text();

      if (res.ok) {
        alert("OTP verified! You can now login.");
        navigate("/vendors/login");
      } else {
        setMessage(data);
      }
    } catch (error) {
      setMessage("Error verifying OTP: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Verify OTP</h2>
      <p>
        Email: <strong>{email}</strong>
      </p>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <br />
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VendorSignupVerifyOtp;
