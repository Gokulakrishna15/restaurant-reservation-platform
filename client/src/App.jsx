import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Signup from "./components/Signup";
import RestaurantList from "./components/RestaurantList";
import RestaurantProfile from "./components/RestaurantProfile";
import ReservationForm from "./components/ReservationForm";
import ReservationList from "./components/ReservationList";
import ImageUpload from "./components/ImageUpload";
import AdminDashboard from "./components/AdminDashboard";
import AdminReservations from "./components/AdminReservations";
import AdminReviews from "./components/AdminReviews";
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
        {/* Global Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/restaurants/:id" element={<RestaurantProfile />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />

            {/* Protected Routes */}
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
            <Route
              path="/upload"
              element={
                <PrivateRoute role="admin">
                  <ImageUpload />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
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

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}