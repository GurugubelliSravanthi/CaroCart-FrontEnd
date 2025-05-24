import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";

const API_BASE = "http://localhost:8082/products";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE}/all`);
      setProducts(res.data);

      // Initialize quantities with default 1
      const initialQuantities = {};
      res.data.forEach((p) => {
        initialQuantities[p.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[productId] || 1) + delta);
      return { ...prev, [productId]: newQty };
    });
  };

  // Group products by Category and SubCategory
  const groupedByCategory = products.reduce((acc, product) => {
    const category = product.subCategory?.category || {
      id: "uncat",
      name: "Uncategorized",
    };
    const subCategory = product.subCategory || {
      id: "uncat",
      name: "Uncategorized",
    };

    if (!acc[category.id]) {
      acc[category.id] = { categoryName: category.name, subCategories: {} };
    }

    if (!acc[category.id].subCategories[subCategory.id]) {
      acc[category.id].subCategories[subCategory.id] = {
        subCategoryName: subCategory.name,
        products: [],
      };
    }

    acc[category.id].subCategories[subCategory.id].products.push(product);

    return acc;
  }, {});

  const getStockStatusClass = (stock) => {
    if (stock > 10) return "in-stock";
    if (stock > 0) return "low-stock";
    return "out-of-stock";
  };

  if (isLoading) {
    return (
      <div className="product-list-container">
        <div className="loading-spinner">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2>Our Products</h2>
      {products.length === 0 ? (
        <p className="no-products">No products available</p>
      ) : (
        Object.values(groupedByCategory).map((category) => (
          <div key={category.categoryName} className="category-section">
            <h2>{category.categoryName}</h2>
            {Object.values(category.subCategories).map((subCat) => (
              <div key={subCat.subCategoryName}>
                <h3>{subCat.subCategoryName}</h3>
                <div className="products-grid">
                  {subCat.products.map((p) => (
                    <div key={p.id} className="product-card">
                      <div className="product-image-container">
                        <img
                          src={
                            p.image
                              ? `${API_BASE}/image/${p.id}`
                              : "/placeholder-product.jpg"
                          }
                          alt={p.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = "/placeholder-product.jpg";
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h4 className="product-name">{p.name}</h4>
                        <p className="product-description">
                          {p.description || "No description available"}
                        </p>
                        <p className="product-price">
                          ₹{p.price.toLocaleString()}
                        </p>
                        <p
                          className={`product-stock ${getStockStatusClass(
                            p.stock
                          )}`}
                        >
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </p>
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(p.id, -1)}
                            disabled={quantities[p.id] <= 1}
                          >
                            -
                          </button>
                          <span className="quantity-display">
                            {quantities[p.id] || 1}
                          </span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(p.id, 1)}
                            disabled={
                              p.stock <= 0 || quantities[p.id] >= p.stock
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
