import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import RestaurantList from './components/RestaurantList';
import RestaurantProfile from './components/RestaurantProfile';
import ReviewForm from './components/ReviewForm';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import ImageUpload from './components/ImageUpload';
import AdminDashboard from './components/AdminDashboard';
import AdminReservations from './components/AdminReservations';
import AdminReviews from './components/AdminReviews';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restaurants/:id" element={<RestaurantProfile />} />
        <Route path="/review/:restaurantId" element={<ReviewForm />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <RestaurantList />
            </PrivateRoute>
          }
        />
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
          path="/upload"
          element={
            <PrivateRoute>
              <ImageUpload />
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
      </Routes>
    </Router>
  );
}