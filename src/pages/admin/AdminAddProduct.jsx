import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { addProduct, updateProduct } from "../../services/productService";
import {
  getAllCategories,
  getSubCategoriesByCategoryId,
} from "../../services/categoryService";
import { getToken } from "../../utils/auth";
import "./AdminProductForm.css"; // New CSS file

const AdminAddProduct = () => {
  const location = useLocation();
  const editProduct = location.state?.product;
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    subCategoryId: "",
    price: "",
    mrp: "",
    discount: "",
    stock: "",
    unit: "",
    imageUrl: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchCategories();

    if (editProduct) {
      const subCat = editProduct.subCategory || {};
      setForm({
        name: editProduct.name || "",
        description: editProduct.description || "",
        brand: editProduct.brand || "",
        subCategoryId: subCat.id || "",
        price: editProduct.price || "",
        mrp: editProduct.mrp || "",
        discount: editProduct.discount || "",
        stock: editProduct.stock || "",
        unit: editProduct.unit || "",
        imageUrl: editProduct.imageUrl || "",
        isAvailable: editProduct.isAvailable ?? true,
      });

      if (subCat.categoryId) {
        setSelectedCategoryId(subCat.categoryId);
        fetchSubcategories(subCat.categoryId);
      }
    }
  }, [editProduct]);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await getSubCategoriesByCategoryId(categoryId);
      setSubcategories(res.data);
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    setForm({ ...form, subCategoryId: "" });
    fetchSubcategories(categoryId);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    setIsSubmitting(true);

    const payload = {
      ...form,
      subCategory: { id: form.subCategoryId },
      price: parseFloat(form.price),
      mrp: parseFloat(form.mrp),
      discount: parseFloat(form.discount),
      stock: parseInt(form.stock),
    };
    delete payload.subCategoryId;

    try {
      if (editProduct) {
        await updateProduct(editProduct.id, payload, token);
        setMessage("Product updated successfully!");
      } else {
        await addProduct(payload, token);
        setMessage("Product added successfully!");
        setForm({
          name: "",
          description: "",
          brand: "",
          subCategoryId: "",
          price: "",
          mrp: "",
          discount: "",
          stock: "",
          unit: "",
          imageUrl: "",
          isAvailable: true,
        });
        setSelectedCategoryId("");
        setSubcategories([]);
      }
    } catch (error) {
      setMessage(
        "Error: " + (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-product-form-container">
      <h2 className="form-title">
        {editProduct ? "Edit Product" : "Add New Product"}
      </h2>

      {message && (
        <div
          className={`form-message ${
            message.includes("Error") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Enter brand name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subCategoryId">Subcategory</label>
            <select
              id="subCategoryId"
              name="subCategoryId"
              value={form.subCategoryId}
              onChange={handleChange}
              required
              disabled={!selectedCategoryId}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Selling price"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mrp">MRP (₹)</label>
            <input
              type="number"
              id="mrp"
              name="mrp"
              value={form.mrp}
              onChange={handleChange}
              placeholder="Maximum retail price"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              placeholder="Discount percentage"
              required
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Available quantity"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="e.g. kg, g, ml, pieces"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {form.imageUrl && (
          <div className="image-preview">
            <img
              src={form.imageUrl}
              alt="Product preview"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={form.isAvailable}
            onChange={handleChange}
          />
          <label htmlFor="isAvailable">Product is available</label>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting
            ? "Processing..."
            : editProduct
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
