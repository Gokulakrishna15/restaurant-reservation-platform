import axios from "axios";

const API = import.meta.env.VITE_API_BASE || "https://restaurant-reservation-platform-cefo.onrender.com/api";

const apiClient = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

// Helper for auth headers
const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Register new user
export const registerUser = async (data) => {
  try {
    return await apiClient.post("/auth/register", data);
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// Login user
export const loginUser = async (data) => {
  try {
    return await apiClient.post("/auth/login", data);
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// Get user profile
export const getUserProfile = async (token) => {
  try {
    return await apiClient.get("/auth/me", authHeaders(token));
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// Optional: Refresh token
export const refreshToken = async (refreshToken) => {
  try {
    return await apiClient.post("/auth/refresh", { refreshToken });
  } catch (err) {
    throw err.response?.data || err.message;
  }
};