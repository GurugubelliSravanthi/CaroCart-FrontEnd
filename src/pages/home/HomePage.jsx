import React, { useEffect, useState } from "react";
import {
  getAllCategories,
  getSubCategoriesByCategoryId,
} from "../../services/categoryService";
import { getAllProducts } from "../../services/productService";
import "./HomePage.css";

const API_BASE = "http://localhost:8082/products";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoryRes, productRes] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);

      const allCategories = categoryRes.data;
      const allProducts = productRes.data;

      const subMap = {};
      await Promise.all(
        allCategories.map(async (cat) => {
          const subRes = await getSubCategoriesByCategoryId(cat.id);
          const nonEmptySubcategories = subRes.data.filter((sub) =>
            allProducts.some((p) => p.subCategory?.id === sub.id)
          );
          if (nonEmptySubcategories.length > 0) {
            subMap[cat.id] = nonEmptySubcategories;
          }
        })
      );

      // Filter out categories with no non-empty subcategories
      const filteredCategories = allCategories.filter(
        (cat) => subMap[cat.id]?.length > 0
      );

      setCategories(filteredCategories);
      setSubcategoriesMap(subMap);
      setProducts(allProducts);
    } catch (err) {
      console.error("Failed to load homepage data", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductsBySubcategory = (subCategoryId) =>
    products.filter((p) => p.subCategory?.id === subCategoryId);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(productId)
        ? newFavorites.delete(productId)
        : newFavorites.add(productId);
      return newFavorites;
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">CaroCart</h1>
          <p className="hero-subtitle">
            Discover premium products curated just for you
          </p>
          <div className="hero-features">
            <span className="feature-badge">Premium Quality</span>
            <span className="feature-badge">Best Prices</span>
            <span className="feature-badge">Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {categories.map((cat) => (
          <div key={cat.id} className="category-section">
            {/* Category Header */}
            <div className="category-header">
              <h2 className="category-title">{cat.name}</h2>
              <div className="category-divider"></div>
              <p className="category-description">
                Explore our curated collection of premium{" "}
                {cat.name.toLowerCase()}
              </p>
            </div>

            {/* Subcategories */}
            <div className="subcategory-container">
              {subcategoriesMap[cat.id]?.map((sub) => {
                const subProducts = getProductsBySubcategory(sub.id);
                return (
                  <div key={sub.id} className="subcategory-section">
                    <div className="subcategory-header">
                      <h3 className="subcategory-title">
                        <span className="subcategory-indicator"></span>
                        {sub.name}
                        <span className="product-count">
                          {subProducts.length} items
                        </span>
                      </h3>
                    </div>

                    {/* Products */}
                    <div className="products-container">
                      <div className="product-grid">
                        {subProducts.map((product) => (
                          <div key={product.id} className="product-card">
                            {/* Image */}
                            <div className="product-image-container">
                              <img
                                src={
                                  product.image
                                    ? `${API_BASE}/image/${product.id}`
                                    : "https://via.placeholder.com/300x300?text=No+Image"
                                }
                                alt={product.name}
                                className="product-image"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/300x300?text=No+Image";
                                }}
                              />

                              {/* Overlay */}
                              <div className="product-overlay">
                                <button
                                  onClick={() => toggleFavorite(product.id)}
                                  className={`action-btn favorite-btn ${
                                    favorites.has(product.id) ? "active" : ""
                                  }`}
                                >
                                  ♥
                                </button>
                                <button className="action-btn view-btn">
                                  👁
                                </button>
                              </div>

                              {/* Badges */}
                              <div className="product-badges">
                                {product.discount && (
                                  <span className="discount-badge">
                                    -{product.discount}%
                                  </span>
                                )}
                                {!product.isAvailable && (
                                  <span className="stock-badge">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="product-info">
                              {product.brand && (
                                <p className="product-brand">{product.brand}</p>
                              )}
                              <h4 className="product-name">{product.name}</h4>
                              <div className="price-container">
                                <div className="price-info">
                                  <span className="current-price">
                                    {formatPrice(product.price || 0)}
                                  </span>
                                  {product.mrp &&
                                    product.mrp > product.price && (
                                      <span className="original-price">
                                        {formatPrice(product.mrp)}
                                      </span>
                                    )}
                                </div>
                                {product.unit && (
                                  <p className="price-unit">
                                    per {product.unit}
                                  </p>
                                )}
                              </div>
                              <div className="stock-status">
                                <div
                                  className={`stock-indicator ${
                                    product.isAvailable && product.stock > 0
                                      ? "in-stock"
                                      : "out-of-stock"
                                  }`}
                                >
                                  <div className="stock-dot"></div>
                                  {product.isAvailable && product.stock > 0
                                    ? `${product.stock} in stock`
                                    : "Out of stock"}
                                </div>
                              </div>
                              <button
                                disabled={
                                  !product.isAvailable || product.stock === 0
                                }
                                className="add-to-cart-btn"
                              >
                                {product.isAvailable && product.stock > 0
                                  ? "Add to Cart"
                                  : "Notify Me"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
