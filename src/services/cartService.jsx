import axios from "axios";

const CART_BASE_URL = "http://localhost:8083/cart"; // Replace 8083 with your actual CartService port if different

// ⬆️ Utility function to get auth token from localStorage (if needed)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const cartService = {
  // ✅ Get all cart items for a user
  getCartItems: async (userId) => {
    const response = await axios.get(`${CART_BASE_URL}/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // ✅ Add item to cart
  addToCart: async (userId, productId, quantity) => {
    const response = await axios.post(
      `${CART_BASE_URL}/add`,
      {
        userId,
        productId,
        quantity,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // ✅ Update cart item quantity
  updateCartItem: async (userId, productId, quantity) => {
    const response = await axios.put(
      `${CART_BASE_URL}/update`,
      {
        userId,
        productId,
        quantity,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // ✅ Remove item from cart
  removeCartItem: async (userId, productId) => {
    const response = await axios.delete(
      `${CART_BASE_URL}/remove/${userId}/${productId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // ✅ Clear all cart items for a user
  clearCart: async (userId) => {
    const response = await axios.delete(`${CART_BASE_URL}/clear/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

export default cartService;
