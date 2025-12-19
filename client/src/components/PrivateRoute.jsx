import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ If no token, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If a role is required and user doesn't match, redirect
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, render the protected component
  return children;
}