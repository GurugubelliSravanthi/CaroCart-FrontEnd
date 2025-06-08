import axios from "axios";

const API_BASE = "http://localhost:8081";

// ==========================
// ======== USER APIs =======
// ==========================

// User Signup
export const userSignup = async (userData) => {
  return axios.post(`${API_BASE}/users/signup`, userData);
};

// User Login - returns JWT token as plain text
export const userLogin = async (loginData) => {
  return axios.post(`${API_BASE}/users/login`, loginData);
};

// Get User Profile
export const getUserProfile = (token) => {
  return axios.get(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update User Profile
export const updateUserProfile = (token, updatedUser) => {
  return axios.put(`${API_BASE}/users/profile`, updatedUser, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Upload Profile Image
export const uploadProfileImage = (token, file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  return axios.post(`${API_BASE}/users/profile/upload-image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get Profile Image
export const getProfileImage = (token) => {
  return axios.get(`${API_BASE}/users/profile/image`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
};

// Request OTP for Forgot Password
export const requestOTP = (email) => {
  return axios.post(`${API_BASE}/users/forgot-password`, { email });
};

// Verify OTP
export const verifyOTP = (email, otp) => {
  return axios.post(`${API_BASE}/users/verify-otp`, { email, otp });
};

// Reset Password after OTP Verification
export const resetPassword = (email, newPassword) => {
  return axios.post(`${API_BASE}/users/reset-password`, { email, newPassword });
};

// Get Minimal User Info (for other services)
export const getCurrentUserDTO = (token) => {
  return axios.get(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ============================
// ======== ADMIN APIs ========
// ============================

// Admin: Get all users
export const getAllUsers = (token) => {
  return axios.get(`${API_BASE}/users/admin/users/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin: Update user by ID
export const updateUserByAdmin = (userId, updatedUser, token) => {
  return axios.put(`${API_BASE}/users/admin/users/${userId}`, updatedUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin: Delete user by ID
export const deleteUserByAdmin = (userId, token) => {
  return axios.delete(`${API_BASE}/users/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Admin Signup
export const adminSignup = (adminData) => {
  return axios.post(`${API_BASE}/admins/signup`, adminData);
};

// Admin Login - returns JWT + role
export const adminLogin = (loginData) => {
  return axios.post(`${API_BASE}/admins/login`, loginData);
};

// Get current admin details
export const getCurrentAdmin = (token) => {
  return axios.get(`${API_BASE}/admins/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
