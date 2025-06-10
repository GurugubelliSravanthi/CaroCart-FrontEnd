import axios from "axios";

const API_URL = "http://localhost:8084/orders";

const getAuthHeaders = () => {
  const token = localStorage.getItem("carocart_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ===========================
// USER APIs
// ===========================

const placeOrder = async (orderRequest) => {
  const headers = getAuthHeaders();
  const response = await axios.post(`${API_URL}/place`, orderRequest, {
    headers,
  });
  return response.data;
};

const getMyOrders = async () => {
  const headers = getAuthHeaders();
  const response = await axios.get(`${API_URL}/my`, { headers });
  return response.data;
};

const getMyOrderById = async (orderId) => {
  const headers = getAuthHeaders();
  const response = await axios.get(`${API_URL}/${orderId}`, { headers });
  return response.data;
};

const cancelOrder = async (orderId) => {
  const headers = getAuthHeaders();
  const response = await axios.delete(`${API_URL}/cancel/${orderId}`, {
    headers,
  });
  return response.data;
};

// ===========================
// ADMIN APIs
// ===========================

const getAllOrders = async () => {
  const headers = getAuthHeaders();
  const response = await axios.get(`${API_URL}/admin/orders`, { headers });
  return response.data;
};

const getOrderByIdForAdmin = async (orderId) => {
  const headers = getAuthHeaders();
  const response = await axios.get(`${API_URL}/admin/orders/${orderId}`, {
    headers,
  });
  return response.data;
};

const cancelOrderByAdmin = async (orderId) => {
  if (!orderId) {
    console.error("cancelOrderByAdmin called with invalid orderId");
    throw new Error("Invalid orderId");
  }

  const headers = getAuthHeaders();
  const response = await axios.put(
    `${API_URL}/admin/orders/${orderId}/cancel`,
    {},
    { headers }
  );
  return response.data;
};


// ===========================
// DEBUG (optional)
// ===========================

const debugToken = async () => {
  const headers = getAuthHeaders();
  const response = await axios.get(`${API_URL}/debug/token`, { headers });
  return response.data;
};

// ===========================
// Export all
// ===========================

export default {
  // user
  placeOrder,
  getMyOrders,
  getMyOrderById,
  cancelOrder,

  // admin
  getAllOrders,
  getOrderByIdForAdmin,
  cancelOrderByAdmin,

  // debug
  debugToken,
};
