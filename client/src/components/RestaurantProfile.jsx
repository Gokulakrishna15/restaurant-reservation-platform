import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import ReviewForm from "./ReviewForm";

const priceMap = { low: "₹", medium: "₹₹", high: "₹₹₹" };

const RestaurantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/restaurants/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setRestaurant(res.data?.data || res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching restaurant:", err);
      setError("Failed to load restaurant details.");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  if (loading) return <p className="p-4 text-yellow-300">⌛ Loading...</p>;
  if (error) return <p className="p-4 bg-red-900 text-red-300 border border-red-400 rounded">{error}</p>;
  if (!restaurant) return <p className="p-4 text-red-300">Restaurant not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 px-4 py-8 font-mono text-green-300">
      {/* Hero Banner */}
      <div className="bg-black border-4 border-pink-500 rounded-2xl p-8 text-green-300 shadow-lg mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-pink-400 tracking-widest uppercase">
          {restaurant.name}
        </h1>
        <p className="text-lg text-cyan-300 mb-4">{restaurant.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-yellow-300">
          <p><span className="font-semibold">📍 Location:</span> {restaurant.location}</p>
          <p><span className="font-semibold">🍽 Cuisine:</span> {restaurant.cuisine}</p>
          <p><span className="font-semibold">💲 Price:</span> {priceMap[restaurant.priceRange] || restaurant.priceRange}</p>
          {restaurant.features?.length > 0 && (
            <p className="col-span-2 md:col-span-3">
              <span className="font-semibold">✨ Features:</span> {restaurant.features.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Image */}
      {restaurant.imageUrl && (
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-72 object-cover rounded-xl border-4 border-cyan-400 shadow-lg mb-6"
        />
      )}

      {/* Details */}
      {(restaurant.hours || restaurant.contact) && (
        <div className="bg-black border-2 border-purple-500 rounded-xl shadow-lg p-6 mb-8 text-cyan-300">
          {restaurant.hours && <p className="mb-2"><strong>🕒 Hours:</strong> {restaurant.hours}</p>}
          {restaurant.contact && <p className="mb-2"><strong>📞 Contact:</strong> {restaurant.contact}</p>}
          {restaurant.dietaryOptions?.length > 0 && (
            <p className="mb-2"><strong>🥗 Dietary:</strong> {restaurant.dietaryOptions.join(", ")}</p>
          )}
          {restaurant.ambiance?.length > 0 && (
            <p className="mb-2"><strong>🎶 Ambiance:</strong> {restaurant.ambiance.join(", ")}</p>
          )}
        </div>
      )}

      {/* Menu */}
      {restaurant.menu?.length > 0 && (
        <div className="bg-black border-2 border-pink-400 rounded-xl shadow-lg p-6 mb-8 text-green-300">
          <h2 className="text-xl font-bold mb-3 text-pink-400 uppercase">Menu</h2>
          <ul className="list-disc pl-5 space-y-1 text-yellow-300">
            {restaurant.menu.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-black border-2 border-cyan-400 rounded-xl shadow-lg p-6 mb-8 text-green-300">
        <h2 className="text-xl font-bold mb-3 text-pink-400 uppercase">Reviews ({restaurant.reviews?.length || 0})</h2>
        {restaurant.reviews?.length > 0 ? (
          <div className="space-y-4">
            {restaurant.reviews.map((review) => (
              <div key={review._id} className="border-2 border-purple-500 rounded-lg p-4 shadow-md">
                <p className="font-semibold text-yellow-300">{review.user?.name || "Anonymous"}</p>
                <p className="text-pink-400">⭐ {review.rating}/5</p>
                <p className="text-cyan-300 mt-1">{review.comment}</p>
                {review.photo && (
                  <img 
                    src={review.photo} 
                    alt="review" 
                    className="mt-2 h-32 w-32 object-cover rounded"
                  />
                )}
                {review.ownerResponse?.text && (
                  <p className="text-sm text-green-300 mt-2"><strong>Owner Response:</strong> {review.ownerResponse.text}</p>
                )}
                {review.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cyan-300">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Reservation Button */}
      {token ? (
        <>
          <div className="flex justify-center mb-8">
            <button
              className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition"
              onClick={() => navigate(`/reserve/${restaurant._id}`)}
            >
              Reserve Now
            </button>
          </div>

          {/* Review Form */}
          <ReviewForm restaurantId={restaurant._id} onReviewSubmitted={fetchRestaurant} />
        </>
      ) : (
        <p className="text-red-400 text-center text-lg mb-8">
          ⚠️ Please <a href="/login" className="underline hover:text-red-300">login</a> to make reservations and leave reviews.
        </p>
      )}

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-8">
        © 2025 FoodieHub
      </footer>
    </div>
  );
};

export default RestaurantProfile;