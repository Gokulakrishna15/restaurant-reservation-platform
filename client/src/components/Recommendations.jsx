import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Recommendations = ({ userToken }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/restaurants/recommendations/me", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        // Adjust depending on backend response shape
        const data = res.data?.data || res.data;
        setRestaurants(data || []);
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

    if (userToken) {
      fetchRecommendations();
    } else {
      setError("⚠️ You must be logged in to see recommendations.");
      setLoading(false);
    }
  }, [userToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-6 font-mono text-green-300">
      {/* Header */}
      <div className="bg-black border-4 border-pink-500 rounded-xl p-6 mb-6 shadow-lg text-center">
        <h3 className="text-2xl font-extrabold tracking-widest text-pink-400 uppercase">
          🎯 Recommended for You
        </h3>
        <p className="mt-2 text-cyan-300 text-sm">
          Hand‑picked spots based on your taste.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-yellow-300">⌛ Loading recommendations...</p>
      ) : error ? (
        <p className="bg-red-900 text-red-300 p-3 rounded border border-red-400">
          {error}
        </p>
      ) : restaurants.length === 0 ? (
        <p className="text-cyan-300 text-center">
          No recommendations available.
        </p>
      ) : (
        <div className="space-y-4">
          {restaurants.map((r) => (
            <div
              key={r._id}
              onClick={() => navigate(`/restaurants/${r._id}`)}
              className="cursor-pointer border-2 border-cyan-400 bg-black rounded-xl p-4 shadow-lg hover:shadow-neon transition"
            >
              <p className="font-bold text-pink-400 text-lg">{r.name}</p>
              <p className="text-yellow-300">
                {r.cuisine} — {r.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;