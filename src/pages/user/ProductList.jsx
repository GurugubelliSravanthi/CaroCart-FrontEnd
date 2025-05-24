import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8082/products";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all`);
      setProducts(res.data);

      // Initialize quantities
      const initialQuantities = {};
      res.data.forEach((p) => {
        initialQuantities[p.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[productId] || 1) + delta);
      return { ...prev, [productId]: newQty };
    });
  };

  // Group products by category
  const groupedByCategory = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Products</h2>
      {Object.keys(groupedByCategory).length === 0 ? (
        <p>No products available</p>
      ) : (
        Object.entries(groupedByCategory).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 40 }}>
            <h3>{category}</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 20,
              }}
            >
              {items.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <p>
                    <b>Price:</b> ₹{p.price}
                  </p>
                  <p>
                    <b>Stock:</b> {p.stock}
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <button onClick={() => handleQuantityChange(p.id, -1)}>
                      -
                    </button>
                    <span>{quantities[p.id] || 1}</span>
                    <button onClick={() => handleQuantityChange(p.id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;
