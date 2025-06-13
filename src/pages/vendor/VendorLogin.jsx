import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Decode JWT to extract payload
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect if already logged in as VENDOR
  useEffect(() => {
    const token = localStorage.getItem("carocart_token");
    if (token) {
      const user = parseJwt(token);
      if (user?.role === "VENDOR") {
        navigate("/vendors/dashboard");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const params = new URLSearchParams({ email, password });
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

      const vendor = parseJwt(token);
      if (vendor) {
        localStorage.setItem("role", vendor.role || "VENDOR");
        localStorage.setItem(
          "user",
          JSON.stringify({ email: vendor.sub, role: vendor.role })
        );
      }

      window.dispatchEvent(new Event("carocart-login"));
      // ✅ Removed alert
      navigate("/vendors/dashboard");
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
