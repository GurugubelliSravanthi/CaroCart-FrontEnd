import axios from "axios";

const PRODUCT_API_BASE = "http://localhost:8082";

// For multipart/form-data POST/PUT
export const addProduct = (formData, token) => {
  return axios.post(`${PRODUCT_API_BASE}/products/admin/add`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProduct = (productId, formData, token) => {
  return axios.put(`${PRODUCT_API_BASE}/products/admin/update/${productId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
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

// User: Get products by subcategory ID
export const getProductsBySubCategory = (subCategoryId) => {
  return axios.get(`${PRODUCT_API_BASE}/products/subcategory/${subCategoryId}`);
};
