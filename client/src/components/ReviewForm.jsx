import { useState } from "react";
import axios from "../services/api";

const ReviewForm = ({ restaurantId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({ 
    rating: 0, 
    comment: "", 
    photo: "" 
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingClick = (val) => {
    setFormData({ ...formData, rating: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!formData.rating) {
      setError("Please select a rating");
      setSubmitting(false);
      return;
    }

    if (!formData.comment.trim()) {
      setError("Please write a comment");
      setSubmitting(false);
      return;
    }

    try {
      // ✅ FIXED: Convert photo string to photos array to match Review model
      await axios.post(
        "/reviews",
        { 
          restaurant: restaurantId,
          rating: formData.rating,
          comment: formData.comment,
          photos: formData.photo ? [formData.photo] : [] // ✅ Array format
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("✅ Review submitted successfully!");
      setFormData({ rating: 0, comment: "", photo: "" });
      
      // ✅ Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
        if (onReviewSubmitted) onReviewSubmitted();
      }, 3000);
    } catch (err) {
      console.error("Review submission failed:", err);
      setError(err.response?.data?.error || "❌ Failed to submit review. You must have a confirmed reservation to review this restaurant.");
      
      // ✅ Auto-hide error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="mt-6 p-4 bg-yellow-900 border-2 border-yellow-500 rounded-lg text-yellow-300 text-sm shadow-lg">
        <p className="font-bold mb-2">⚠️ Login Required</p>
        <p>
          Please{" "}
          <a href="/login" className="underline font-bold hover:text-yellow-100 transition">
            login
          </a>{" "}
          to leave a review.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-black border-4 border-cyan-400 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-pink-400 mb-6 uppercase tracking-widest">
        ✍️ Leave a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-cyan-300 mb-3 font-semibold text-lg">
            Rating <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => handleRatingClick(val)}
                className={`text-4xl transition-all duration-200 ${
                  formData.rating >= val 
                    ? "text-yellow-400 scale-125 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" 
                    : "text-gray-600 hover:text-gray-400"
                }`}
                aria-label={`Rate ${val} stars`}
              >
                ⭐
              </button>
            ))}
          </div>
          <p className="text-sm text-cyan-300 mt-2 font-semibold">
            {formData.rating ? (
              <>
                {formData.rating}/5 stars - {
                  formData.rating === 5 ? "Excellent!" :
                  formData.rating === 4 ? "Very Good" :
                  formData.rating === 3 ? "Good" :
                  formData.rating === 2 ? "Fair" : "Poor"
                }
              </>
            ) : (
              "Click to select rating"
            )}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-cyan-300 mb-3 font-semibold text-lg">
            Your Review <span className="text-red-400">*</span>
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Share your dining experience... Tell us what you loved (or didn't love) about the food, service, and ambiance."
            maxLength="500"
            className="w-full p-4 border-2 border-pink-400 bg-black text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 h-32 resize-none transition"
            required
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-400">
              {formData.comment.length}/500 characters
            </p>
            {formData.comment.length > 450 && (
              <p className="text-xs text-yellow-400 animate-pulse">
                ⚠️ Approaching character limit
              </p>
            )}
          </div>
        </div>

        {/* Photo URL (optional) */}
        <div>
          <label className="block text-cyan-300 mb-3 font-semibold text-lg">
            Photo URL <span className="text-gray-400 text-sm">(Optional)</span>
          </label>
          <input
            type="url"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="https://example.com/your-photo.jpg"
            className="w-full p-4 border-2 border-pink-400 bg-black text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          />
          {formData.photo && (
            <div className="mt-4">
              <p className="text-sm text-cyan-300 mb-2">Preview:</p>
              <img 
                src={formData.photo} 
                alt="Review preview" 
                className="h-32 w-32 object-cover rounded-lg border-2 border-pink-400 shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  setError("❌ Invalid image URL. Please check the link.");
                }}
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-red-300 p-4 rounded-lg border-2 border-red-400 text-sm animate-pulse shadow-lg">
            <p className="font-bold mb-1">⚠️ Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900 text-green-300 p-4 rounded-lg border-2 border-green-400 text-sm animate-pulse shadow-lg">
            <p className="font-bold mb-1">✅ Success</p>
            <p>{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !formData.rating || !formData.comment.trim()}
          className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 transform hover:scale-[1.02] active:scale-95"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⌛</span>
              Submitting Review...
            </span>
          ) : (
            "Submit Review"
          )}
        </button>

        {/* Info Text */}
        <p className="text-xs text-gray-400 text-center mt-4">
          💡 Tip: You can only review restaurants where you have a confirmed reservation.
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;