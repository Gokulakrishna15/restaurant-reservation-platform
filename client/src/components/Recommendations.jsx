import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Recommendations = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
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
        // ✅ Fetch user's past reservations and reviews to understand preferences
        const [recommendationsRes, reservationsRes, reviewsRes] = await Promise.all([
          axios.get("/restaurants/recommendations/me", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("/reservations/my", {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { data: [] } })),
          axios.get("/reviews/my-reviews", {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { data: [] } }))
        ]);

        const recommendedRestaurants = recommendationsRes.data?.data || recommendationsRes.data || [];
        const userReservations = reservationsRes.data?.data || [];
        const userReviews = reviewsRes.data?.data || [];

        // ✅ Extract user preferences from past activity
        const preferences = {
          favoriteCuisines: [...new Set(
            userReservations
              .map(r => r.restaurant?.cuisine)
              .filter(Boolean)
          )],
          favoriteLocations: [...new Set(
            userReservations
              .map(r => r.restaurant?.location)
              .filter(Boolean)
          )],
          highRatedRestaurants: userReviews
            .filter(r => r.rating >= 4)
            .map(r => r.restaurant),
          totalReservations: userReservations.length,
          totalReviews: userReviews.length,
        };

        setUserPreferences(preferences);
        setRestaurants(Array.isArray(recommendedRestaurants) ? recommendedRestaurants : []);
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
          Personalized suggestions based on your dining history
        </p>
      </div>

      {/* User Preferences Insight */}
      {userPreferences && !loading && (
        <div className="bg-black border-2 border-cyan-400 rounded-xl p-6 mb-6 shadow-lg">
          <h4 className="text-xl font-bold text-pink-400 mb-4">📊 Your Dining Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-500">
              <p className="text-cyan-300 font-semibold mb-2">🍽 Favorite Cuisines:</p>
              {userPreferences.favoriteCuisines.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userPreferences.favoriteCuisines.map((cuisine, i) => (
                    <span key={i} className="bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {cuisine}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-yellow-300 text-xs">No preferences yet - explore more!</p>
              )}
            </div>

            <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-500">
              <p className="text-cyan-300 font-semibold mb-2">📍 Favorite Locations:</p>
              {userPreferences.favoriteLocations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userPreferences.favoriteLocations.map((location, i) => (
                    <span key={i} className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {location}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-yellow-300 text-xs">Try restaurants in different areas!</p>
              )}
            </div>

            <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-500">
              <p className="text-cyan-300 font-semibold mb-2">📅 Activity:</p>
              <p className="text-green-300">
                {userPreferences.totalReservations} reservation{userPreferences.totalReservations !== 1 ? 's' : ''} 
                {' • '}
                {userPreferences.totalReviews} review{userPreferences.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-500">
              <p className="text-cyan-300 font-semibold mb-2">⭐ Recommendation Quality:</p>
              <p className="text-yellow-300">
                {userPreferences.totalReservations > 0 
                  ? `Based on ${userPreferences.totalReservations} past visit${userPreferences.totalReservations > 1 ? 's' : ''}`
                  : "Make more reservations for better suggestions!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-yellow-300">⌛ Analyzing your preferences...</p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/restaurants")}
              className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-6 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-800 transition"
            >
              🍽 Browse Restaurants
            </button>
            <button
              onClick={() => navigate("/my-reservations")}
              className="bg-gradient-to-r from-cyan-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:from-cyan-600 hover:to-green-700 transition"
            >
              📅 View My Reservations
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 text-center">
            <p className="text-cyan-300 text-sm">
              🎯 Showing <span className="font-bold text-pink-400">{restaurants.length}</span> top-rated restaurants
              {userPreferences?.favoriteCuisines.length > 0 && (
                <span> matching your preferences</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r, index) => {
              // ✅ Check if matches user preferences
              const matchesCuisine = userPreferences?.favoriteCuisines.includes(r.cuisine);
              const matchesLocation = userPreferences?.favoriteLocations.includes(r.location);
              const isHighRated = r.rating >= 4.5;

              return (
                <div
                  key={r._id}
                  onClick={() => navigate(`/restaurants/${r._id}`)}
                  className="cursor-pointer border-4 border-cyan-400 bg-black rounded-xl p-6 shadow-lg hover:border-pink-400 hover:shadow-neon transition-all transform hover:scale-105 relative"
                >
                  {/* Recommendation Badge */}
                  {index === 0 && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      🏆 TOP PICK
                    </div>
                  )}

                  {/* Match Indicators */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {matchesCuisine && (
                      <span className="bg-pink-600 text-white px-2 py-1 rounded text-xs font-bold">
                        ❤️ Your Cuisine
                      </span>
                    )}
                    {matchesLocation && (
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                        📍 Your Area
                      </span>
                    )}
                    {isHighRated && (
                      <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-bold">
                        ⭐ Highly Rated
                      </span>
                    )}
                  </div>

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

                    {/* Features */}
                    {r.features && r.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.features.slice(0, 3).map((feature, i) => (
                          <span key={i} className="bg-purple-800 text-purple-200 px-2 py-1 rounded text-xs">
                            ✨ {feature}
                          </span>
                        ))}
                        {r.features.length > 3 && (
                          <span className="text-xs text-gray-400">+{r.features.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* View Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-700 text-white py-2 rounded-lg font-bold hover:from-pink-600 hover:to-purple-800 transition">
                    View Details & Reserve →
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Info Box */}
      {!loading && restaurants.length > 0 && (
        <div className="mt-8 bg-purple-900 bg-opacity-30 border-2 border-purple-500 rounded-xl p-6 text-center">
          <p className="text-cyan-300 text-sm">
            💡 <strong>Pro Tip:</strong> The more you dine and review, the better our recommendations become!
            Keep exploring to discover your perfect restaurants.
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-8 pt-8 border-t border-gray-700">
        © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
      </footer>
    </div>
  );
};

export default Recommendations;