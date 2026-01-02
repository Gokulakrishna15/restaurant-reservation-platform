import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ If no token, redirect to login
  if (!token || !user || !user.email) {
    return <Navigate to="/login" replace />;
  }

  // ✅ FIXED: Changed requiredRole to role to match App.jsx usage
  if (role && user.role !== role) {
    // If user is not admin but trying to access admin route, redirect to home
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, render the protected component
  return children;
}