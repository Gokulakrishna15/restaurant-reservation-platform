import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import ReviewForm from "./ReviewForm";

const RestaurantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

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

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`/reviews/restaurant/${id}`);
      const data = res.data?.data || res.data;
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurant();
    fetchReviews();
  }, [fetchRestaurant, fetchReviews]);

  // ✅ DELETE REVIEW FUNCTION
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(reviewId);
    try {
      await axios.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccessMessage("✅ Review deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Refresh both restaurant data and reviews
      await fetchReviews();
      await fetchRestaurant();
    } catch (err) {
      console.error("Delete review error:", err);
      alert(err.response?.data?.error || "❌ Failed to delete review. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-yellow-300 font-mono text-lg">⌛ Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 p-4">
        <div className="bg-red-900 text-red-300 p-8 rounded-xl border-4 border-red-400 max-w-md text-center">
          <p className="font-bold text-2xl mb-4">❌ Error</p>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 p-4">
        <div className="text-center">
          <p className="text-red-300 font-mono text-xl mb-4">Restaurant not found</p>
          <button
            onClick={() => navigate("/restaurants")}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 px-4 py-8 font-mono text-green-300">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-900 text-green-300 p-4 rounded-lg border-2 border-green-400 shadow-lg z-50 animate-pulse">
          {successMessage}
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-black border-4 border-pink-500 rounded-2xl p-8 text-green-300 shadow-lg mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-pink-400 tracking-widest uppercase">
          {restaurant.name}
        </h1>
        <p className="text-lg text-cyan-300 mb-4">{restaurant.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-yellow-300">
          <p><span className="font-semibold">📍 Location:</span> {restaurant.location}</p>
          <p><span className="font-semibold">🍽 Cuisine:</span> {restaurant.cuisine}</p>
          <p><span className="font-semibold">💲 Price:</span> {restaurant.priceRange}</p>
          <p><span className="font-semibold">⭐ Rating:</span> {restaurant.rating?.toFixed(1) || "0.0"} / 5</p>
          <p><span className="font-semibold">📝 Reviews:</span> {restaurant.totalReviews || reviews.length}</p>
          {restaurant.features?.length > 0 && (
            <p className="col-span-2 md:col-span-3">
              <span className="font-semibold">✨ Features:</span> {restaurant.features.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      {restaurant.images && restaurant.images.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurant.images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${restaurant.name} ${index + 1}`}
                className="w-full h-64 object-cover rounded-xl border-4 border-cyan-400 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";
                }}
                onClick={() => window.open(image, "_blank")}
              />
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      {(restaurant.hours || restaurant.contact || restaurant.dietaryOptions?.length > 0 || restaurant.ambiance?.length > 0) && (
        <div className="bg-black border-2 border-purple-500 rounded-xl shadow-lg p-6 mb-8 text-cyan-300">
          <h2 className="text-xl font-bold text-pink-400 mb-4 uppercase">📋 Details</h2>
          {restaurant.hours && <p className="mb-2"><strong>🕒 Hours:</strong> {restaurant.hours}</p>}
          {restaurant.contact && <p className="mb-2"><strong>📞 Contact:</strong> {restaurant.contact}</p>}
          {restaurant.dietaryOptions?.length > 0 && (
            <p className="mb-2"><strong>🥗 Dietary Options:</strong> {restaurant.dietaryOptions.join(", ")}</p>
          )}
          {restaurant.ambiance?.length > 0 && (
            <p className="mb-2"><strong>🎶 Ambiance:</strong> {restaurant.ambiance.join(", ")}</p>
          )}
        </div>
      )}

      {/* Menu */}
      {restaurant.menu?.length > 0 && (
        <div className="bg-black border-2 border-pink-400 rounded-xl shadow-lg p-6 mb-8 text-green-300">
          <h2 className="text-xl font-bold mb-4 text-pink-400 uppercase">🍽 Menu</h2>
          <ul className="list-disc pl-5 space-y-1 text-yellow-300">
            {restaurant.menu.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-black border-2 border-cyan-400 rounded-xl shadow-lg p-6 mb-8 text-green-300">
        <h2 className="text-2xl font-bold mb-6 text-pink-400 uppercase">⭐ Customer Reviews ({reviews.length})</h2>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => {
              // ✅ Check if this review belongs to current user
              const isOwnReview = currentUser?.id === review.user?._id;
              
              return (
                <div 
                  key={review._id} 
                  className="border-2 border-purple-500 rounded-lg p-5 shadow-md bg-black hover:border-pink-400 transition"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-yellow-300 text-lg">
                        {review.user?.name || "Anonymous"}
                        {isOwnReview && (
                          <span className="ml-2 text-xs bg-cyan-600 text-white px-2 py-1 rounded font-bold">
                            YOU
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-pink-400 text-xl">
                          {"⭐".repeat(review.rating)}
                        </span>
                        <span className="text-sm text-gray-400">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    
                    {/* ✅ DELETE BUTTON - Only show for own reviews */}
                    {isOwnReview && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        disabled={deleteLoading === review._id}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete your review"
                      >
                        {deleteLoading === review._id ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin">⌛</span>
                            Deleting...
                          </span>
                        ) : (
                          <>🗑 Delete</>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Review Comment */}
                  <p className="text-cyan-300 mb-3 leading-relaxed">{review.comment}</p>

                  {/* Review Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="h-24 w-24 object-cover rounded border-2 border-pink-400 hover:scale-110 transition-transform cursor-pointer"
                          onClick={() => window.open(photo, "_blank")}
                        />
                      ))}
                    </div>
                  )}

                  {/* Owner Response */}
                  {review.ownerResponse?.text && (
                    <div className="bg-purple-900 border-l-4 border-green-400 rounded p-3 mt-3">
                      <p className="text-sm font-bold text-green-300 mb-1">
                        💬 Restaurant Response:
                      </p>
                      <p className="text-green-300 text-sm">{review.ownerResponse.text}</p>
                      {review.ownerResponse.respondedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Responded on {new Date(review.ownerResponse.respondedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Review Date */}
                  {review.createdAt && (
                    <p className="text-xs text-gray-500 mt-3">
                      Posted on {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-cyan-300 text-lg mb-2">No reviews yet</p>
            <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Reservation Button & Review Form */}
      {token ? (
        <>
          <div className="flex justify-center mb-8">
            <button
              className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-pink-600 hover:to-purple-800 transition-all transform hover:scale-105"
              onClick={() => navigate(`/reserve/${restaurant._id}`)}
            >
              📅 Make a Reservation
            </button>
          </div>

          {/* Review Form */}
          <ReviewForm 
            restaurantId={restaurant._id} 
            onReviewSubmitted={() => {
              fetchReviews();
              fetchRestaurant();
            }} 
          />
        </>
      ) : (
        <div className="bg-yellow-900 border-2 border-yellow-500 rounded-lg p-6 text-center">
          <p className="text-yellow-300 text-lg mb-4">
            ⚠️ Please login to make reservations and leave reviews
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-cyan-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-8 pt-8 border-t border-gray-700">
        © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
      </footer>
    </div>
  );
};

export default RestaurantProfile;