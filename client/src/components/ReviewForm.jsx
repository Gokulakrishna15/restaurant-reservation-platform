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
      await axios.post(
        "/reviews",
        { 
          ...formData, 
          restaurant: restaurantId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("✅ Review submitted successfully!");
      setFormData({ rating: 0, comment: "", photo: "" });
      
      setTimeout(() => {
        if (onReviewSubmitted) onReviewSubmitted();
      }, 1500);
    } catch (err) {
      console.error("Review submission failed:", err);
      setError(err.response?.data?.error || "❌ Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="mt-6 p-4 bg-yellow-900 border-2 border-yellow-500 rounded text-yellow-300 text-sm">
        ⚠️ Please <a href="/login" className="underline font-bold">login</a> to leave a review.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-6 bg-black border-2 border-cyan-400 rounded-xl">
      <h3 className="text-xl font-bold text-pink-400 mb-4 uppercase">✍️ Leave a Review</h3>

      {/* Star Rating */}
      <div className="mb-5">
        <label className="block text-cyan-300 mb-2 font-semibold">Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              type="button"
              key={val}
              onClick={() => handleRatingClick(val)}
              className={`text-3xl transition ${
                formData.rating >= val ? "text-yellow-400 scale-110" : "text-gray-600"
              } hover:text-yellow-300`}
            >
              ⭐
            </button>
          ))}
          <span className="text-sm text-cyan-300 ml-4 font-semibold">
            {formData.rating ? `${formData.rating}/5 stars` : "Select rating"}
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-5">
        <label className="block text-cyan-300 mb-2 font-semibold">Your Review</label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your dining experience... (max 500 characters)"
          maxLength="500"
          className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 h-28 resize-none"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          {formData.comment.length}/500 characters
        </p>
      </div>

      {/* Photo URL (optional) */}
      <div className="mb-5">
        <label className="block text-cyan-300 mb-2 font-semibold">Photo URL (Optional)</label>
        <input
          type="url"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
          className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        {formData.photo && (
          <img 
            src={formData.photo} 
            alt="preview" 
            className="mt-2 h-20 w-20 object-cover rounded border border-pink-400"
            onError={() => setError("Invalid image URL")}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-900 text-red-300 p-3 rounded border border-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-900 text-green-300 p-3 rounded border border-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !formData.rating || !formData.comment.trim()}
        className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "⌛ Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;