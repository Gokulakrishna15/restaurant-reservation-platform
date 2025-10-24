import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RestaurantList from './RestaurantList';
import ReservationForm from './ReservationForm';
import ReservationList from './ReservationList';
import ImageUpload from './ImageUpload';
import AdminDashboard from './AdminDashboard';
import PrivateRoute from './PrivateRoute';

export default function ProtectedApp() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-blue-700">
        Restaurant Reservation Platform
      </h1>
      <Routes>
        <Route
          path="/*" // ✅ Matches App.jsx route
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