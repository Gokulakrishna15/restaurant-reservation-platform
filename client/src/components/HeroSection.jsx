import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const HeroSection = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // ✅ Fetch sample restaurants to show on homepage
    const fetchSampleRestaurants = async () => {
      try {
        const res = await axios.get("/restaurants");
        const data = res.data.data || res.data;
        setRestaurants(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSampleRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white text-center px-4">
        <h1 className="text-6xl font-extrabold mb-4 text-pink-400 tracking-widest uppercase animate-pulse">
          🍴 FoodieHub
        </h1>
        <p className="text-xl mb-8 max-w-2xl text-cyan-300">
          Discover amazing restaurants, make reservations, and enjoy unforgettable dining experiences!
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          {!token ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-pink-600 hover:to-purple-800 transition"
              >
                Login to Explore
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-cyan-500 to-green-600 text-black px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-cyan-600 hover:to-green-700 transition"
              >
                Sign Up Now
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/restaurants")}
                className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-pink-600 hover:to-purple-800 transition"
              >
                Browse Restaurants
              </button>
              <button
                onClick={() => navigate("/my-reservations")}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-yellow-600 hover:to-orange-700 transition"
              >
                My Reservations
              </button>
            </>
          )}
        </div>
      </div>

      {/* Featured Restaurants Preview */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center text-pink-400 mb-8 uppercase tracking-widest">
          ✨ Featured Restaurants
        </h2>

        {loading ? (
          <div className="text-center text-cyan-300">
            <p>Loading restaurants...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center text-yellow-300">
            <p>No restaurants available yet. Please run: node seed.js</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-black border-4 border-pink-500 rounded-xl overflow-hidden shadow-lg hover:shadow-neon transition cursor-pointer"
                onClick={() => token ? navigate(`/restaurants/${restaurant._id}`) : navigate("/login")}
              >
                <img
                  src={restaurant.images?.[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-pink-400 mb-2">{restaurant.name}</h3>
                  <p className="text-cyan-300 text-sm mb-2">{restaurant.description?.slice(0, 100)}...</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-yellow-300">🍽 {restaurant.cuisine}</span>
                    <span className="text-green-300">📍 {restaurant.location}</span>
                  </div>
                  <div className="mt-3 text-center">
                    <button className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-4 py-2 rounded-lg font-bold hover:from-pink-600 hover:to-purple-800 transition">
                      {token ? "View Details" : "Login to Book"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {restaurants.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => token ? navigate("/restaurants") : navigate("/login")}
              className="bg-cyan-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-cyan-600 transition"
            >
              View All Restaurants →
            </button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-black border-2 border-cyan-400 rounded-xl p-6">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-pink-400 mb-2">Search & Filter</h3>
            <p className="text-cyan-300 text-sm">Find restaurants by cuisine, location, and features</p>
          </div>
          <div className="bg-black border-2 border-purple-400 rounded-xl p-6">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-pink-400 mb-2">Easy Reservations</h3>
            <p className="text-cyan-300 text-sm">Book tables instantly with real-time availability</p>
          </div>
          <div className="bg-black border-2 border-yellow-400 rounded-xl p-6">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-pink-400 mb-2">Secure Payments</h3>
            <p className="text-cyan-300 text-sm">Pay safely with Stripe integration</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-green-400 text-sm py-6 border-t-2 border-pink-500">
        © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
      </footer>
    </div>
  );
};

export default HeroSection;