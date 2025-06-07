import axios from "axios";

const API_BASE = "http://localhost:8081";

// === USER APIs ===
export const userSignup = async (userData) => {
  // POST /users/signup expects user data in body
  return axios.post(`${API_BASE}/users/signup`, userData);
};

export const userLogin = async (loginData) => {
  // POST /users/login expects { email, password } in body
  return axios.post(`${API_BASE}/users/login`, loginData);
};

// === Password APIs ===
export const requestOTP = (email) => {
  // POST /users/forgot-password with { email } in body
  return axios.post(`${API_BASE}/users/forgot-password`, { email });
};

export const verifyOTP = (email, otp) => {
  // POST /users/verify-otp with { email, otp } in body
  return axios.post(`${API_BASE}/users/verify-otp`, { email, otp });
};

export const resetPassword = (email, newPassword) => {
  // POST /users/reset-password with { email, newPassword } in body
  return axios.post(`${API_BASE}/users/reset-password`, { email, newPassword });
};

// === PROFILE APIs ===
export const getUserProfile = (token) => {
  // GET /users/profile requires Authorization header with Bearer token
  return axios.get(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserProfile = (token, updatedUser) => {
  // PUT /users/profile requires Authorization header and updated user JSON body
  return axios.put(`${API_BASE}/users/profile`, updatedUser, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const uploadProfileImage = (token, file) => {
  // POST /users/profile/upload-image expects multipart/form-data with Authorization header
  const formData = new FormData();
  formData.append("profileImage", file);

  return axios.post(`${API_BASE}/users/profile/upload-image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProfileImage = (token) => {
  // GET /users/profile/image returns the image bytes with Authorization header
  return axios.get(`${API_BASE}/users/profile/image`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
};

// === VENDOR APIs ===
// Note: Vendor signup is a 2-step process (request OTP, verify OTP)
export const vendorRequestSignupOtp = async (vendorData) => {
  return axios.post(`${API_BASE}/vendors/signup/request-otp`, vendorData);
};

export const vendorVerifySignupOtp = async (email, otp) => {
  // Your backend expects email and otp as query params for vendor verify OTP
  return axios.post(`${API_BASE}/vendors/signup/verify-otp`, null, {
    params: { email, otp },
  });
};

export const vendorLogin = async (loginData) => {
  // Backend expects email and password as query params for vendor login
  const { email, password } = loginData;
  return axios.post(`${API_BASE}/vendors/login`, null, {
    params: { email, password },
  });
};

// === ADMIN APIs ===
export const adminLogin = async (loginData) => {
  // POST /admins/login with loginData in body
  return axios.post(`${API_BASE}/admins/login`, loginData);
};
