import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update to deployed URL when ready
});

// 🏨 Restaurants
export const getRestaurants = () => API.get('/restaurants');

// 📅 Reservations
export const createReservation = (data) => API.post('/reservations', data);
export const getReservations = () => API.get('/reservations');
export const updateReservation = (id, data) => API.put(`/reservations/${id}`, data);
export const deleteReservation = (id) => API.delete(`/reservations/${id}`);

// 📝 Reviews (for future steps)
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// 💳 Payments (for Stripe integration)
export const initiatePayment = async () => {
  const res = await API.post('/payment');
  return res.data.url;
};