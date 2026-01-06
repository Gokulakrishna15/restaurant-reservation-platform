import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Signup from "./components/Signup";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./components/RestaurantDetail";
import ReservationForm from "./components/ReservationForm";
import ReservationList from "./components/ReservationList";
import ImageUpload from "./components/ImageUpload";
import AdminDashboard from "./components/AdminDashboard";
import AdminReservations from "./components/AdminReservations";
import AdminReviews from "./components/AdminReviews";
import RestaurantOwnerDashboard from "./components/RestaurantOwnerDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Recommendations from "./components/Recommendations";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentCancel";
import NotFound from "./components/NotFound";
import HeroSection from "./components/HeroSection";

// ✅ Wrapper page to inject restaurantId from URL
import { useParams } from "react-router-dom";
const ReservePage = () => {
  const { id } = useParams();
  return <ReservationForm restaurantId={id} />;
};

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Payment Routes */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />

            {/* User Routes - Protected */}
            <Route
              path="/restaurants"
              element={
                <PrivateRoute>
                  <RestaurantList />
                </PrivateRoute>
              }
            />
            <Route
              path="/restaurants/:id"
              element={
                <PrivateRoute>
                  <RestaurantDetail />
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
                  <ReservePage />
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

            {/* ✅ Restaurant Owner Routes */}
            <Route
              path="/my-restaurants"
              element={
                <PrivateRoute role="restaurant_owner">
                  <RestaurantOwnerDashboard />
                </PrivateRoute>
              }
            />

            {/* Admin Routes - Separate from user routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/reservations"
              element={
                <PrivateRoute role="admin">
                  <AdminReservations />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <PrivateRoute role="admin">
                  <AdminReviews />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/upload"
              element={
                <PrivateRoute role="admin">
                  <ImageUpload />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}