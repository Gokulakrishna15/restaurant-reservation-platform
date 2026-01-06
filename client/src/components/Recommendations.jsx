import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Recommendations = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("⚠️ You must be logged in to see recommendations.");
        setLoading(false);
        return;
      }

      try {
        // ✅ Fixed: Added Authorization header
        const res = await axios.get("/restaurants/recommendations/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data?.data || res.data;
        setRestaurants(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        console.error("Recommendation error:", err.response || err);
        setError(
          err.response?.data?.error || "❌ Failed to load recommendations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-6 font-mono text-green-300">
      {/* Header */}
      <div className="bg-black border-4 border-pink-500 rounded-xl p-6 mb-6 shadow-lg text-center">
        <h3 className="text-3xl font-extrabold tracking-widest text-pink-400 uppercase">
          🎯 Recommended for You
        </h3>
        <p className="mt-2 text-cyan-300 text-sm">
          Top-rated restaurants hand-picked just for you
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-yellow-300">⌛ Loading recommendations...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900 text-red-300 p-4 rounded-lg border-2 border-red-400 text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition"
          >
            Login to See Recommendations
          </button>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="bg-black border-2 border-cyan-400 rounded-xl p-8 text-center">
          <p className="text-cyan-300 text-lg mb-4">
            No recommendations available yet.
          </p>
          <p className="text-yellow-300 text-sm mb-6">
            Make some reservations and leave reviews to get personalized suggestions!
          </p>
          <button
            onClick={() => navigate("/restaurants")}
            className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-6 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-800 transition"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((r) => (
            <div
              key={r._id}
              onClick={() => navigate(`/restaurants/${r._id}`)}
              className="cursor-pointer border-4 border-cyan-400 bg-black rounded-xl p-6 shadow-lg hover:border-pink-400 hover:shadow-neon transition-all transform hover:scale-105"
            >
              {/* Restaurant Image */}
              {r.images && r.images[0] && (
                <img
                  src={r.images[0]}
                  alt={r.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 border-2 border-pink-400"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";
                  }}
                />
              )}

              {/* Restaurant Info */}
              <div className="space-y-2">
                <p className="font-bold text-pink-400 text-xl">{r.name}</p>
                <p className="text-cyan-300 text-sm">
                  🍽 {r.cuisine} • 📍 {r.location}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-300 font-semibold">
                    ⭐ {r.rating?.toFixed(1) || "0.0"} ({r.totalReviews || 0} reviews)
                  </span>
                  <span className="text-green-300 font-bold">{r.priceRange}</span>
                </div>
                <p className="text-green-300 text-sm line-clamp-2">
                  {r.description}
                </p>
              </div>

              {/* View Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-700 text-white py-2 rounded-lg font-bold hover:from-pink-600 hover:to-purple-800 transition">
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-8">
        © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
      </footer>
    </div>
  );
};

export default Recommendations;