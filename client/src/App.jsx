import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedApp from './components/ProtectedApp';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import RestaurantList from './components/RestaurantList';
import RestaurantProfile from './components/RestaurantProfile';
import ReviewForm from './components/ReviewForm';
import AdminDashboard from './components/AdminDashboard';
import AdminReservations from './components/AdminReservations'; // ✅ NEW
import AdminReviews from './components/AdminReviews'; // ✅ NEW

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantProfile />} />
        <Route path="/reserve" element={<ReservationForm />} />
        <Route path="/review/:restaurantId" element={<ReviewForm />} />

        {/* Protected Routes */}
        <Route path="/my-reservations" element={<ReservationList />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reservations" element={<AdminReservations />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/*" element={<ProtectedApp />} />
      </Routes>
    </Router>
  );
}