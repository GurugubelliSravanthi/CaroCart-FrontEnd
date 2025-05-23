import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Construct URLSearchParams for query string
      const params = new URLSearchParams({ email, password });

      // POST request with no body, email & password as query params
      const res = await fetch(
        `http://localhost:8081/vendors/login?${params.toString()}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const errorMsg = await res.text();
        if (res.status === 403 || errorMsg.includes("not approved")) {
          setMessage("Login failed: You are not approved yet.");
        } else {
          setMessage("Login failed: " + errorMsg);
        }
        return;
      }
      

      const token = await res.text();
      localStorage.setItem("carocart_token", token);
      alert("Login successful!");
      navigate("/vendors/dashboard"); // Adjust this path to your actual dashboard route
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 40 }}>
      <h2>Vendor Login</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
        </div>
        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 12 }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default VendorLogin;
