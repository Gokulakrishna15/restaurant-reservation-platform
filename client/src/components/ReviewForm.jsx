import { useState, useEffect } from "react";
import axios from "../services/api";

const ReviewForm = ({ restaurantId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({ rating: 0, comment: "" });
  const [hasReservation, setHasReservation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkReservation = async () => {
      try {
        const res = await axios.get("/reservations/my", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const match = res.data.find(
          (r) =>
            r.restaurant?._id?.toString() === restaurantId.toString() ||
            r.restaurant?.toString() === restaurantId.toString()
        );
        setHasReservation(!!match);
      } catch (err) {
        console.error("Error checking reservation:", err);
        setHasReservation(false);
      } finally {
        setLoading(false);
      }
    };

    checkReservation();
  }, [restaurantId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (val) => {
    setFormData({ ...formData, rating: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        "/reviews",
        { ...formData, restaurant: restaurantId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setSuccess("✅ Review submitted!");
      setFormData({ rating: 0, comment: "" });
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      console.error("Review submission failed:", err);
      setError(err.response?.data?.error || "❌ Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Checking reservation status...</p>;

  if (!hasReservation) {
    return (
      <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-sm text-gray-700">
          ⚠️ You must have a reservation at this restaurant to leave a review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-6 bg-white shadow rounded-xl">
      <h3 className="text-xl font-bold text-blue-700 mb-4">Leave a Review</h3>

      {/* Star Rating Selector */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            type="button"
            key={val}
            onClick={() => handleRatingClick(val)}
            className={`text-2xl ${
              formData.rating >= val ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-500 transition`}
          >
            ⭐
          </button>
        ))}
        <span className="text-sm text-gray-600 ml-2">
          {formData.rating ? `${formData.rating}/5` : "Select rating"}
        </span>
      </div>

      {/* Comment */}
      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        placeholder="Share your experience..."
        className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
        required
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-800 transition disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>

      {/* Feedback */}
      {error && <p className="text-red-600 mt-3">{error}</p>}
      {success && <p className="text-green-600 mt-3">{success}</p>}
    </form>
  );
};

export default ReviewForm;
