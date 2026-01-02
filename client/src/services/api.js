import axios from "axios";

// ✅ FIXED: Changed VITE_API_BASE to VITE_API_URL to match your .env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://restaurant-reservation-platform-cefo.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// 🔐 Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Error interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

// Register new user
export const registerUser = async (data) => {
  try {
    return await API.post("/auth/register", data);
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// Login user
export const loginUser = async (data) => {
  try {
    return API.post("/auth/login", data);
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// Get user profile
export const getUserProfile = async (token) => {
  try {
    return API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// ==================== RESTAURANT ENDPOINTS ====================

// Get all restaurants
export const getRestaurants = () => API.get("/restaurants");

// Get restaurant by ID
export const getRestaurantById = (id) => API.get(`/restaurants/${id}`);

// Search restaurants
export const searchRestaurants = (params) => API.get("/restaurants/search", { params });

// ==================== RESERVATION ENDPOINTS ====================

// Create reservation
export const createReservation = (data) => API.post("/reservations", data);

// Get user's reservations
export const getReservations = () => API.get("/reservations/my");

// Update reservation
export const updateReservation = (id, data) => API.put(`/reservations/${id}`, data);

// Delete reservation
export const deleteReservation = (id) => API.delete(`/reservations/${id}`);

// ==================== REVIEW ENDPOINTS ====================

// Create review
export const createReview = (data) => API.post("/reviews", data);

// Update review
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);

// Delete review
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// ==================== PAYMENT ENDPOINTS ====================

// Create Stripe checkout session
export const createCheckoutSession = async (reservationId) => {
  try {
    const res = await API.post("/payments/create-checkout-session", { reservationId });
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// Confirm payment
export const confirmPayment = async (reservationId) => {
  try {
    const res = await API.post("/payments/confirm-payment", { reservationId });
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

export default API;