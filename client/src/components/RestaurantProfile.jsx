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

  const fetchRestaurant = useCallback(async () => {
    try {
      const res = await axios.get(`/restaurants/${id}`);
      setRestaurant(res.data?.data || res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching restaurant:", err);
      setError("Failed to load restaurant details.");
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  if (error) return <p className="p-4 bg-red-900 text-red-300 border border-red-400 rounded">{error}</p>;
  if (!restaurant) return <p className="p-4 text-yellow-300">⌛ Loading...</p>;

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
          <p><span className="font-semibold">💲 Price Range:</span> {priceMap[restaurant.priceRange] || restaurant.priceRange}</p>
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
          alt={`Image of ${restaurant.name}`}
          className="w-full h-72 object-cover rounded-xl border-4 border-cyan-400 shadow-lg mb-6"
        />
      )}

      {/* Details */}
      <div className="bg-black border-2 border-purple-500 rounded-xl shadow-lg p-6 mb-8 text-cyan-300">
        <p className="mb-2"><strong>🕒 Hours:</strong> {restaurant.hours}</p>
        <p className="mb-2"><strong>📞 Contact:</strong> {restaurant.contact}</p>
        <p className="mb-2"><strong>🥗 Dietary Options:</strong> {restaurant.dietaryOptions?.join(", ") || "None"}</p>
        <p className="mb-2"><strong>🎶 Ambiance:</strong> {restaurant.ambiance?.join(", ") || "None"}</p>
      </div>

      {/* Menu */}
      <div className="bg-black border-2 border-pink-400 rounded-xl shadow-lg p-6 mb-8 text-green-300">
        <h2 className="text-xl font-bold mb-3 text-pink-400 uppercase">Menu</h2>
        {restaurant.menu?.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-yellow-300">
            {restaurant.menu.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : (
          <p className="text-cyan-300">No menu items available.</p>
        )}
      </div>

      {/* Reviews */}
      <div className="bg-black border-2 border-cyan-400 rounded-xl shadow-lg p-6 mb-8 text-green-300">
        <h2 className="text-xl font-bold mb-3 text-pink-400 uppercase">Reviews</h2>
        {restaurant.reviews?.length > 0 ? (
          <div className="space-y-4">
            {restaurant.reviews.map((review) => (
              <div key={review._id} className="border-2 border-purple-500 rounded-lg p-4 shadow-md hover:shadow-neon transition">
                <p className="font-semibold text-yellow-300">{review.user?.name || "Anonymous"}</p>
                <p className="text-cyan-300">{review.comment}</p>
                <p className="text-pink-400">⭐ {review.rating}</p>
                {review.ownerResponse && (
                  <p className="text-sm text-green-300 mt-1"><strong>Owner:</strong> {review.ownerResponse}</p>
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
          <p className="text-cyan-300">No reviews yet.</p>
        )}
      </div>

      {/* Reservation Button */}
      <div className="flex justify-center">
        <button
          className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition"
          onClick={() => navigate(`/reserve/${restaurant._id}`)}
        >
          Reserve Now
        </button>
      </div>

      {/* Review Form */}
      {restaurant.hasReservation ? (
        <div className="mt-8">
          <ReviewForm restaurantId={restaurant._id} onReviewSubmitted={fetchRestaurant} />
        </div>
      ) : (
        <p className="text-red-400 mt-6 text-center">
          ⚠️ You must reserve before leaving a review.
        </p>
      )}

      {/* Retro Proof Banner */}
      <div className="text-xs text-yellow-400 text-center mt-8 uppercase tracking-widest">
      </div>

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-6">
      </footer>
    </div>
  );
};

export default RestaurantProfile;