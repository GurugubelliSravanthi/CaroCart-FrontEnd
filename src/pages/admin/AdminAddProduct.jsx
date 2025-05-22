import React, { useState } from "react";
import { addProduct } from "../../services/productService";
import { getToken } from "../../utils/auth";

const AdminAddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      const response = await addProduct(form, token);
      setMessage("Product added successfully!");
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
      });
    } catch (error) {
      setMessage(
        "Failed to add product. " + (error.response?.data?.message || "")
      );
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
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
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
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
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
