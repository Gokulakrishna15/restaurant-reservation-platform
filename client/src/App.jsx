import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RestaurantList from './components/RestaurantList';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import ImageUpload from './components/ImageUpload';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';

function ProtectedApp() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-blue-700">
        Restaurant Reservation Platform
      </h1>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <RestaurantList />
                <ReservationForm />
                <ReservationList />
                <ImageUpload />
                <AdminDashboard />
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<ProtectedApp />} />
      </Routes>
    </Router>
  );
}