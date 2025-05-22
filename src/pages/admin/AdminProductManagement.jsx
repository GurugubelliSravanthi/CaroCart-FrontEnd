import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8082/products"; // Product service URL

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("carocart_token");

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
    };

    try {
      if (isEditing && form.id) {
        // Update existing product
        await axios.put(`${API_BASE}/admin/update/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new product
        await axios.post(`${API_BASE}/admin/add`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Reset form and refresh list
      setForm({ id: null, name: "", description: "", price: "", quantity: "" });
      setIsEditing(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${API_BASE}/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Admin Product Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
        <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
        <div>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="price"
            placeholder="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="quantity"
            placeholder="Quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? "Updating..."
              : "Adding..."
            : isEditing
            ? "Update Product"
            : "Add Product"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setForm({
                id: null,
                name: "",
                description: "",
                price: "",
                quantity: "",
              });
            }}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Products</h3>
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
