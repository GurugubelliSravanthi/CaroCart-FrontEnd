// src/services/authService.js
import axios from "axios";

const API_BASE = "http://localhost:8081";

// === USER APIs ===
export const userSignup = async (userData) => {
  return axios.post(`${API_BASE}/users/signup`, userData);
};

export const userLogin = async (loginData) => {
  return axios.post(`${API_BASE}/users/login`, loginData);
};

// === VENDOR APIs ===
// Note: Vendor signup is a 2-step process (request OTP, verify OTP)
export const vendorRequestSignupOtp = async (vendorData) => {
  return axios.post(`${API_BASE}/vendors/signup/request-otp`, vendorData);
};

export const vendorVerifySignupOtp = async (email, otp) => {
  return axios.post(`${API_BASE}/vendors/signup/verify-otp`, null, {
    params: { email, otp },
  });
};

export const vendorLogin = async (loginData) => {
  // Backend expects email and password as query params
  const { email, password } = loginData;
  return axios.post(`${API_BASE}/vendors/login`, null, {
    params: { email, password },
  });
};

// === ADMIN APIs ===

export const adminLogin = async (loginData) => {
  return axios.post(`${API_BASE}/admins/login`, loginData);
};
