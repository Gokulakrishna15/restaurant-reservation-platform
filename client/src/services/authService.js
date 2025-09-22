import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'https://restaurant-reservation-platform-cefo.onrender.com/api';

export const registerUser = async (data) => {
  return axios.post(`${API}/auth/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API}/auth/login`, data);
};

export const getUserProfile = async (token) => {
  return axios.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
