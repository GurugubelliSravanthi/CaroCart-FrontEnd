import axios from "axios";

const CATEGORY_API_BASE = "http://localhost:8082/categories";

// Admin: Add a new category
export const addCategory = (categoryData, token) => {
  return axios.post(`${CATEGORY_API_BASE}/admin/add`, categoryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin: Add a new subcategory
export const addSubCategory = (subCategoryData, token) => {
  return axios.post(
    `${CATEGORY_API_BASE}/admin/subcategory/add`,
    subCategoryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// User: Get all categories
export const getAllCategories = () => {
  return axios.get(CATEGORY_API_BASE);
};

export const getSubCategoriesByCategoryId = (categoryId) => {
  return axios.get(`${CATEGORY_API_BASE}/${categoryId}/subcategories`);
};
  
