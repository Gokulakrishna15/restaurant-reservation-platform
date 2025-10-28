// client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://restaurant-reservation-platform-cefo.onrender.com/api', // ✅ LIVE backend
});

// 🏨 Restaurants
export const getRestaurants = () => API.get('/restaurants');

// 📅 Reservations
export const createReservation = (data) => API.post('/reservations', data);
export const getReservations = () => API.get('/reservations');
export const updateReservation = (id, data) => API.put(`/reservations/${id}`, data);
export const deleteReservation = (id) => API.delete(`/reservations/${id}`);

// 📝 Reviews
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// 💳 Payments (Stripe)
export const initiatePayment = async () => {
  const res = await API.post('/payments/create-checkout-session');
  return res.data.url;
};