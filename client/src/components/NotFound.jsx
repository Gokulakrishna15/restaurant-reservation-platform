// client/src/components/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Page Not Found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Go Home
      </Link>
    </div>
  );
}
