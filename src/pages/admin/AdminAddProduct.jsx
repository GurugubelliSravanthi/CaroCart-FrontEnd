import React, { useState } from "react";
import { addProduct } from "../../services/productService";
import { getToken } from "../../utils/auth";

const AdminAddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    mrp: "",
    discount: "",
    stock: "",
    unit: "",
    imageUrl: "",
    isAvailable: true, // default true
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    // Prepare payload with proper types
    const payload = {
      ...form,
      price: parseFloat(form.price),
      mrp: parseFloat(form.mrp),
      discount: parseFloat(form.discount),
      stock: parseInt(form.stock),
      isAvailable: form.isAvailable,
    };

    try {
      await addProduct(payload, token);
      setMessage("Product added successfully!");
      setForm({
        name: "",
        description: "",
        brand: "",
        category: "",
        price: "",
        mrp: "",
        discount: "",
        stock: "",
        unit: "",
        imageUrl: "",
        isAvailable: true,
      });
    } catch (error) {
      setMessage(
        "Failed to add product. " + (error.response?.data?.message || "")
      );
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Add New Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <br />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <br />

        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand"
          required
        />
        <br />

        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <br />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          min="0"
          step="0.01"
        />
        <br />

        <input
          type="number"
          name="mrp"
          value={form.mrp}
          onChange={handleChange}
          placeholder="MRP"
          required
          min="0"
          step="0.01"
        />
        <br />

        <input
          type="number"
          name="discount"
          value={form.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          required
          min="0"
          max="100"
          step="0.01"
        />
        <br />

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          required
          min="0"
          step="1"
        />
        <br />

        <input
          type="text"
          name="unit"
          value={form.unit}
          onChange={handleChange}
          placeholder="Unit (e.g. kg, pcs)"
          required
        />
        <br />

        <input
          type="url"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />
        <br />

        <label>
          <input
            type="checkbox"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          Available
        </label>
        <br />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
