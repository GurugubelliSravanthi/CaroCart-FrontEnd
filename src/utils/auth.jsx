// src/utils/auth.js

// Save JWT token to localStorage
export const saveToken = (token) => {
  localStorage.setItem("carocart_token", token);
};

// Get JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem("carocart_token");
};

// Remove token (logout)
export const removeToken = () => {
  localStorage.removeItem("carocart_token");
};

// Helper to decode JWT payload
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// Check if user is logged in and token is not expired
export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;

  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return false;

  // exp is in seconds, current time in seconds
  const now = Date.now() / 1000;
  return decoded.exp > now;
};
