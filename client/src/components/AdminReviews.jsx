import React, { useEffect, useState } from "react";
import axios from "../services/api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/reviews", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("❌ Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setSuccess("✅ Review deleted.");
    } catch (err) {
      console.error("Delete failed:", err);
      setError("❌ Failed to delete review.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 mb-6 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold">🛠 Moderate Reviews</h1>
        <p className="mt-2 text-sm opacity-90">
          View, manage, and delete customer reviews across restaurants.
        </p>
      </div>

      {/* Feedback */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">No reviews found.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border rounded-xl shadow-sm bg-white p-6 hover:shadow-md transition"
            >
              {/* User + Restaurant */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    👤 {r.user?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600">
                    🍴 {r.restaurant?.name || "Unknown Restaurant"}
                  </p>
                </div>
                <p className="text-yellow-500 font-bold">
                  {"⭐".repeat(r.rating)}{" "}
                  <span className="text-gray-600 text-sm">({r.rating}/5)</span>
                </p>
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-3">{r.comment}</p>

              {/* Owner Response */}
              {r.ownerResponse && (
                <div className="bg-gray-100 rounded p-3 text-sm text-gray-600 mb-3">
                  <strong>Owner Response:</strong> {r.ownerResponse}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(r._id)}
                  className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-red-600 hover:to-red-800 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
