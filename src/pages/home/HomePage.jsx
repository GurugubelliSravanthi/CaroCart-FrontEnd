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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoryRes, productRes] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);
      setCategories(categoryRes.data);
      setProducts(productRes.data);

      const subMap = {};
      await Promise.all(
        categoryRes.data.map(async (cat) => {
          const subRes = await getSubCategoriesByCategoryId(cat.id);
          subMap[cat.id] = subRes.data;
        })
      );
      setSubcategoriesMap(subMap);
    } catch (err) {
      console.error("Failed to load homepage data", err);
    }
  };

  const getProductsBySubcategory = (subCategoryId) =>
    products.filter((p) => p.subCategory?.id === subCategoryId);

  return (
    <div className="home-container">
      <h2 className="home-title">CaroCart - All Products</h2>

      {categories.map((cat) => (
        <div key={cat.id} className="category-section">
          <h2 className="category-title">{cat.name}</h2>

          <div className="subcategory-container">
            {subcategoriesMap[cat.id]?.map((sub) => {
              const subProducts = getProductsBySubcategory(sub.id);
              return (
                <div key={sub.id} className="subcategory-section">
                  <h3 className="subcategory-title">{sub.name}</h3>

                  {subProducts.length === 0 ? (
                    <p>No products in this subcategory.</p>
                  ) : (
                    <div className="product-grid">
                      {subProducts.map((product) => (
                        <div key={product.id} className="product-card">
                          <img
                            src={
                              product.image
                                ? `${API_BASE}/image/${product.id}`
                                : "https://via.placeholder.com/150?text=No+Image"
                            }
                            alt={product.name}
                            className="product-image"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                          <div className="product-info">
                            <h3>{product.name}</h3>
                            {product.brand && (
                              <p className="brand">{product.brand}</p>
                            )}
                            <p className="price">
                              ₹{product.price?.toLocaleString() || 0}
                              {product.mrp && (
                                <span className="mrp"> ₹{product.mrp}</span>
                              )}
                            </p>
                            {product.discount && (
                              <p className="discount">
                                Save {product.discount}%{" "}
                                {product.unit && `(${product.unit})`}
                              </p>
                            )}
                            <p className="stock">
                              {product.isAvailable && product.stock > 0
                                ? `In Stock: ${product.stock}`
                                : "Out of Stock"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
