import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8082/products";

const ProductList = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Product List</h2>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>
                <b>Price:</b> ₹{p.price}
              </p>
              <p>
                <b>Quantity Available:</b> {p.quantity}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
