// src/services/paymentService.js
import axios from "axios";

const API = "http://localhost:8086/api/payments";

const createOrder = (amount) => {
  return axios.post(`${API}/create-order`, null, {
    params: { amount }
  });
};

const verifyAndUpdatePayment = (payload) => {
  return axios.put(`${API}/verify-and-update`, payload);
};

export default {
  createOrder,
  verifyAndUpdatePayment,
};
