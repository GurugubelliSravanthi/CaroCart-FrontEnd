import axios from "axios";

const API_URL = "http://localhost:8084/orders"; // your OrderService backend base URL

const getAuthHeaders = () => {
  const token = localStorage.getItem("carocart_token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

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

// export all
export default {
  placeOrder,
  getMyOrders,
};
