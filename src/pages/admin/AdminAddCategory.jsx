import React, { useState, useEffect } from "react";
import {
  addCategory,
  addSubCategory,
  getAllCategories,
} from "../../services/categoryService";
import { getToken } from "../../utils/auth";
import "./AdminAddCategory.css";

const AdminAddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const token = getToken();

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  const handleAddCategory = async () => {
    try {
      await addCategory({ name: categoryName }, token);
      showNotification("Category added successfully", "success");
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      showNotification("Failed to add category", "error");
      console.error(err);
    }
  };

  const handleAddSubcategory = async () => {
    try {
      await addSubCategory(
        { name: subcategoryName, categoryId: selectedCategoryId },
        token
      );
      showNotification("Subcategory added successfully", "success");
      setSubcategoryName("");
    } catch (err) {
      showNotification("Failed to add subcategory", "error");
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="admin-category-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="category-section">
        <h2 className="section-title">Add New Category</h2>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
          <button
            className="primary-btn"
            onClick={handleAddCategory}
            disabled={!categoryName.trim()}
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="divider"></div>

      <div className="category-section">
        <h2 className="section-title">Add New Subcategory</h2>
        <div className="form-group">
          <select
            className="form-select"
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            value={selectedCategoryId}
          >
            <option value="">Select Parent Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-input"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            placeholder="Enter subcategory name"
          />
          <button
            className="primary-btn"
            onClick={handleAddSubcategory}
            disabled={!selectedCategoryId || !subcategoryName.trim()}
          >
            Add Subcategory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCategory;
