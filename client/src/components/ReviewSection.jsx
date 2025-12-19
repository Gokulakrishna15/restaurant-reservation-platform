import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://restaurant-reservation-platform-cefo.onrender.com/api";

const ReviewSection = ({ restaurantId, userToken }) => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ comment: "", rating: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/reviews/${restaurantId}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await axios.post(
        `${API_BASE}/reviews`,
        {
          restaurant: restaurantId,
          comment: form.comment,
          rating: form.rating,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setForm({ comment: "", rating: 0 });
      setSuccess("✅ Review submitted!");
      // Refresh reviews
      const res = await axios.get(`${API_BASE}/reviews/${restaurantId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("❌ Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h3 className="text-2xl font-bold text-blue-700 mb-4">⭐ Customer Reviews</h3>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full border rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-400"
          placeholder="Share your experience..."
          required
        />

        {/* Star Rating Selector */}
        <div className="flex items-center gap-2 mb-3">
          <label className="font-medium text-gray-700">Rating:</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setForm({ ...form, rating: val })}
                className={`text-2xl ${
                  form.rating >= val ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-500 transition`}
              >
                ⭐
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {form.rating ? `${form.rating}/5` : "Select rating"}
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>

      {/* Reviews List */}
      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet. Be the first to share!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {r.user?.name ? r.user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {r.user?.name || "Anonymous"}
                  </p>
                  {r.createdAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <p className="text-yellow-500 mb-2">
                {"⭐".repeat(r.rating)}{" "}
                <span className="text-gray-600 text-sm">({r.rating}/5)</span>
              </p>

              {/* Comment */}
              <p className="text-gray-700 mb-2">{r.comment}</p>

              {/* Owner Response */}
              {r.ownerResponse && (
                <div className="bg-gray-100 rounded p-2 text-sm text-gray-600">
                  <strong>Owner Response:</strong> {r.ownerResponse}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
