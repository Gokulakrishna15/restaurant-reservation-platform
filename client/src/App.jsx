import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup';
import RestaurantList from './components/RestaurantList';
import RestaurantProfile from './components/RestaurantProfile';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import ImageUpload from './components/ImageUpload';
import AdminDashboard from './components/AdminDashboard';
import AdminReservations from './components/AdminReservations';
import AdminReviews from './components/AdminReviews';
import PrivateRoute from './components/PrivateRoute';
import Recommendations from './components/Recommendations';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentCancel from './components/PaymentCancel';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restaurants/:id" element={<RestaurantProfile />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />

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
          path="/restaurants"
          element={
            <PrivateRoute>
              <RestaurantList />
            </PrivateRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <PrivateRoute>
              <Recommendations />
            </PrivateRoute>
          }
        />
        <Route
          path="/reserve/:id"
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

        {/* Catch-all route for 404 */}
        <Route path="*" element={<p className="p-6 text-red-600">Page not found</p>} />
      </Routes>
    </Router>
  );
}