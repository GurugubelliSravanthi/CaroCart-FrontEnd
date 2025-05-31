import axios from "axios";

const CART_BASE_URL = "http://localhost:8083/cart";

// Utility function to get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("carocart_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const cartService = {
  // ✅ Get cart items for current user
  getCartItems: async () => {
    const response = await axios.get(`${CART_BASE_URL}/get`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  // ✅ Add item to cart
  addToCart: async (productId, quantity) => {
    const response = await axios.post(
      `${CART_BASE_URL}/add`,
      {
        productId,
        quantity,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // ✅ Update item quantity
  updateCartItem: async (productId, quantity) => {
    const response = await axios.put(
      `${CART_BASE_URL}/update`,
      {
        productId,
        quantity,
      },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // ✅ Remove item
  removeCartItem: async (productId) => {
    const response = await axios.delete(
      `${CART_BASE_URL}/remove/${productId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  },

  // ✅ Clear all items
  clearCart: async () => {
    const response = await axios.delete(`${CART_BASE_URL}/clear`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};

export default cartService;
