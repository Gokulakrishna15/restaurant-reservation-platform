import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-center">
      <h1 className="text-5xl font-extrabold mb-4">🍴 FoodieHub</h1>
      <p className="text-lg mb-8 max-w-xl">
        Discover, filter, and book your favorite restaurants — anytime, anywhere.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/restaurants")}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
        >
          Explore Restaurants
        </button>
        <button
          onClick={() => navigate("/my-reservations")}
          className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow hover:bg-yellow-500 transition"
        >
          My Reservations
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
