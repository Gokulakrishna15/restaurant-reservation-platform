import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`/restaurants/${id}`);
        // ✅ FIXED: Access response.data.data instead of response.data
        setRestaurant(response.data.data || response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/reviews/restaurant/${id}`);
        // ✅ Handle both response formats
        setReviews(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchRestaurant();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please write a review");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to leave a review");
        navigate("/login");
        return;
      }

      await axios.post(
        "/reviews",
        {
          restaurant: id,
          rating,
          comment: reviewText,
          photos: photoUrl ? [photoUrl] : [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      setPhotoUrl("");
      
      const [restaurantRes, reviewsRes] = await Promise.all([
        axios.get(`/restaurants/${id}`),
        axios.get(`/reviews/restaurant/${id}`)
      ]);
      // ✅ FIXED: Access nested data
      setRestaurant(restaurantRes.data.data || restaurantRes.data);
      setReviews(reviewsRes.data.data || reviewsRes.data);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Restaurant not found</h2>
        <button
          onClick={() => navigate("/restaurants")}
          className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  // ✅ FIXED: Ensure images array exists with fallback
  const images = restaurant.images && restaurant.images.length > 0 
    ? restaurant.images 
    : ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          {/* Main Image */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-4">
            <img
              src={images[selectedImage]}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";
              }}
            />
            
            {/* Image Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
                >
                  ←
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
                >
                  →
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === index
                    ? "border-orange-600 shadow-lg"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${restaurant.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {restaurant.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="flex items-center gap-2 text-gray-600">
                  📍 {restaurant.location}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  🍽 {restaurant.cuisine}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  💲 {restaurant.priceRange}
                </span>
                <span className="flex items-center gap-2 text-yellow-600 font-semibold">
                  ⭐ {restaurant.rating?.toFixed(1) || "0.0"} ({restaurant.totalReviews || 0} reviews)
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                {restaurant.description}
              </p>

              {restaurant.features && restaurant.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {restaurant.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                    >
                      ✨ {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>
              
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">
                          {review.user?.name || "Anonymous"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                            ⭐
                          </span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      {review.photos && review.photos.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {review.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt="Review"
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">✍️ Leave a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl transition ${
                          star <= rating ? "text-yellow-500" : "text-gray-300"
                        } hover:scale-110`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {rating ? `${rating}/5 stars` : "Select rating"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="4"
                    maxLength="500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {reviewText.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Reservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-2xl font-bold mb-4">Reserve Now</h3>
              <button
                onClick={() => navigate(`/reserve/${id}`)}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Make a Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;