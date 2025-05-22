import axios from "axios";

const PRODUCT_API_BASE = "http://localhost:8082";

// Admin: Add a new product
export const addProduct = (productData, token) => {
  return axios.post(`${PRODUCT_API_BASE}/products/admin/add`, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin: Update product
export const updateProduct = (productId, updatedData, token) => {
  return axios.put(
    `${PRODUCT_API_BASE}/products/admin/update/${productId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Admin: Delete product
export const deleteProduct = (productId, token) => {
  return axios.delete(
    `${PRODUCT_API_BASE}/products/admin/delete/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// User: Get all products
export const getAllProducts = () => {
  return axios.get(`${PRODUCT_API_BASE}/products/all`);
};

// User: Get product by ID
export const getProductById = (productId) => {
  return axios.get(`${PRODUCT_API_BASE}/products/${productId}`);
};
