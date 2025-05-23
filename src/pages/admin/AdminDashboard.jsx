import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminVendorApproval = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("carocart_token");

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: Please login as admin");
      setLoading(false);
      return;
    }

    // Fetch vendors with isApproved = false
    axios
      .get("http://localhost:8081/vendors/admin/vendors/pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setVendors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          "Failed to fetch vendors: " + (err.response?.data || err.message)
        );
        setLoading(false);
      });
  }, [token]);

  const handleApprove = (vendorId) => {
    setMessage("");
    axios
      .post(
        `http://localhost:8081/vendors/admin/approve/${vendorId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setMessage(res.data);
        // Remove approved vendor from list
        setVendors((prev) => prev.filter((v) => v.id !== vendorId));
      })
      .catch((err) => {
        setMessage("Approval failed: " + (err.response?.data || err.message));
      });
  };

  if (loading) return <div>Loading vendors...</div>;

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Pending Vendor Approvals</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {vendors.length === 0 ? (
        <p>No vendors pending approval.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>ID</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Name
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Email
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                GST Number
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {vendor.id}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {vendor.firstName} {vendor.lastName}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {vendor.email}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {vendor.gstNumber || "N/A"}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  <button
                    onClick={() => handleApprove(vendor.id)}
                    style={{ padding: "6px 12px", cursor: "pointer" }}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminVendorApproval;
