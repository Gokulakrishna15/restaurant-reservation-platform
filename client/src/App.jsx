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
import AdminReservations from './components/AdminReservations';
import AdminReviews from './components/AdminReviews';
import PrivateRoute from './components/PrivateRoute'; // ✅ Import wrapper

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantProfile />} />
        <Route path="/review/:restaurantId" element={<ReviewForm />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/reserve"
          element={
            <PrivateRoute>
              <ReservationForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <PrivateRoute>
              <ReservationList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <PrivateRoute>
              <AdminReservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <PrivateRoute>
              <AdminReviews />
            </PrivateRoute>
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <ProtectedApp />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}