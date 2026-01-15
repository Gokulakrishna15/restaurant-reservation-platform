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
  
  // ✅ NEW: Edit review state
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({ rating: 0, comment: "", photo: "" });
  const [updateLoading, setUpdateLoading] = useState(false);

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

  // ✅ NEW: Start editing a review
  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditFormData({
      rating: review.rating,
      comment: review.comment,
      photo: review.photos?.[0] || "",
    });
  };

  // ✅ NEW: Cancel editing
  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditFormData({ rating: 0, comment: "", photo: "" });
  };

  // ✅ NEW: Update review
  const handleUpdateReview = async (reviewId) => {
    if (!editFormData.rating) {
      alert("Please select a rating");
      return;
    }

    if (!editFormData.comment.trim()) {
      alert("Please write a comment");
      return;
    }

    setUpdateLoading(true);
    try {
      await axios.put(
        `/reviews/${reviewId}`,
        {
          rating: editFormData.rating,
          comment: editFormData.comment,
          photos: editFormData.photo ? [editFormData.photo] : [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("✅ Review updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setEditingReview(null);
      setEditFormData({ rating: 0, comment: "", photo: "" });

      await fetchReviews();
      await fetchRestaurant();
    } catch (err) {
      console.error("Update review error:", err);
      alert(err.response?.data?.error || "❌ Failed to update review. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

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

      {/* Reviews Section */}
      <div className="bg-black border-2 border-cyan-400 rounded-xl shadow-lg p-6 mb-8 text-green-300">
        <h2 className="text-2xl font-bold mb-6 text-pink-400 uppercase">⭐ Customer Reviews ({reviews.length})</h2>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => {
              const isOwnReview = currentUser?.id === review.user?._id;
              const isEditing = editingReview === review._id;

              return (
                <div
                  key={review._id}
                  className="border-2 border-purple-500 rounded-lg p-5 shadow-md bg-black hover:border-pink-400 transition"
                >
                  {isEditing ? (
                    // ✅ EDIT MODE
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-pink-400 mb-3">✏️ Edit Your Review</h3>

                      {/* Star Rating */}
                      <div>
                        <label className="block text-cyan-300 mb-2 font-semibold">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditFormData({ ...editFormData, rating: star })}
                              className={`text-3xl transition ${
                                star <= editFormData.rating ? "text-yellow-400 scale-125" : "text-gray-600"
                              }`}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                        <p className="text-sm text-cyan-300 mt-1">
                          {editFormData.rating}/5 stars
                        </p>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-cyan-300 mb-2 font-semibold">Your Review</label>
                        <textarea
                          value={editFormData.comment}
                          onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
                          className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 h-32 resize-none"
                          maxLength="500"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {editFormData.comment.length}/500 characters
                        </p>
                      </div>

                      {/* Photo URL */}
                      <div>
                        <label className="block text-cyan-300 mb-2 font-semibold">Photo URL (Optional)</label>
                        <input
                          type="url"
                          value={editFormData.photo}
                          onChange={(e) => setEditFormData({ ...editFormData, photo: e.target.value })}
                          className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateReview(review._id)}
                          disabled={updateLoading}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {updateLoading ? "⌛ Saving..." : "✅ Save Changes"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={updateLoading}
                          className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ✅ DISPLAY MODE
                    <>
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
                            <span className="text-sm text-gray-400">{review.rating}/5</span>
                          </div>
                        </div>

                        {/* ✅ EDIT & DELETE BUTTONS - Only for own reviews */}
                        {isOwnReview && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                              title="Edit your review"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              disabled={deleteLoading === review._id}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition disabled:opacity-50"
                              title="Delete your review"
                            >
                              {deleteLoading === review._id ? "⌛" : "🗑 Delete"}
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-cyan-300 mb-3 leading-relaxed">{review.comment}</p>

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

                      {review.createdAt && (
                        <p className="text-xs text-gray-500 mt-3">
                          Posted on {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </>
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

      <footer className="text-center text-green-400 text-xs mt-8 pt-8 border-t border-gray-700">
        © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
      </footer>
    </div>
  );
};

export default RestaurantProfile;