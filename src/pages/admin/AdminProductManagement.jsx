// src/pages/admin/AdminProductManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8082/products";

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("carocart_token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleEdit = (product) => {
    // Navigate to add page with product data in state (or use params or a context)
    navigate("/admins/products/add", { state: { product } });
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Product Management</h2>

      <button onClick={() => navigate("/admins/products/add")} style={{ marginBottom: 20 }}>
        Add New Product
      </button>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id} style={{ marginBottom: 12 }}>
              <b>{p.name}</b> - {p.description} - ₹{p.price} - Qty: {p.quantity}
              <br />
              <button onClick={() => handleEdit(p)} style={{ marginRight: 10 }}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                style={{ backgroundColor: "#e74c3c", color: "white" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProductManagement;
