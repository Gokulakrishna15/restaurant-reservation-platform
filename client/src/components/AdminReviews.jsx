import React, { useEffect, useState, useCallback } from "react";
import axios from "../services/api";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [respondingId, setRespondingId] = useState(null);
  const [responseText, setResponseText] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Wrap fetchReviews with useCallback
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("❌ Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [token]); // ✅ token is dependency

  // ✅ Now fetchReviews is in dependency array
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setSuccess("✅ Review deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      setError("❌ Failed to delete review.");
    }
  };

  const handleRespond = async (id) => {
    if (!responseText.trim()) {
      setError("❌ Response cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `/reviews/${id}/respond`,
        { text: responseText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRespondingId(null);
      setResponseText("");
      setSuccess("✅ Response added successfully.");
      fetchReviews();
    } catch (err) {
      console.error("Response failed:", err);
      setError("❌ Failed to add response.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-8 font-mono text-green-300">
      {/* Header */}
      <div className="bg-black border-4 border-pink-500 rounded-xl p-6 mb-8 shadow-lg text-center">
        <h2 className="text-3xl font-extrabold tracking-widest text-pink-400 uppercase">
          ⭐ Moderate Reviews
        </h2>
        <p className="mt-2 text-cyan-300 text-sm">
          View, respond to, and delete customer reviews.
        </p>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="bg-red-900 text-red-300 p-4 rounded-lg mb-6 border-2 border-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900 text-green-300 p-4 rounded-lg mb-6 border-2 border-green-400">
          {success}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <p className="text-yellow-300 text-center">⌛ Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="bg-black border-2 border-cyan-400 rounded-xl p-6 shadow text-center">
          <p className="text-pink-400">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border-2 border-purple-500 rounded-xl bg-black p-6 shadow-lg hover:shadow-neon transition"
            >
              {/* User + Restaurant + Rating */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-pink-400 text-lg">
                    {r.restaurant?.name || "Unknown Restaurant"}
                  </p>
                  <p className="text-sm text-cyan-300">
                    👤 By: {r.user?.name || "Anonymous"} ({r.user?.email || "N/A"})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold text-xl">
                    {"⭐".repeat(r.rating)}
                  </p>
                  <p className="text-xs text-gray-400">{r.rating}/5 stars</p>
                </div>
              </div>

              {/* Comment */}
              <p className="text-cyan-300 mb-4 border-l-4 border-pink-400 pl-4">
                "{r.comment}"
              </p>

              {/* Photo */}
              {r.photo && (
                <div className="mb-4">
                  <img
                    src={r.photo}
                    alt="review"
                    className="h-32 w-32 object-cover rounded border-2 border-pink-400"
                  />
                </div>
              )}

              {/* Owner Response */}
              {r.ownerResponse?.text ? (
                <div className="bg-purple-900 rounded-lg p-4 mb-4 border-l-4 border-green-400">
                  <p className="text-sm text-green-300">
                    <strong>✅ Owner Response:</strong>
                  </p>
                  <p className="text-green-300 text-sm mt-1">{r.ownerResponse.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.ownerResponse.respondedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-purple-900 rounded-lg p-4 mb-4 border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-300">
                    ⚠️ No response yet
                  </p>
                </div>
              )}

              {/* Response Form */}
              {respondingId === r._id ? (
                <div className="space-y-2 mb-4">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response..."
                    className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 h-20"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespond(r._id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      ✅ Submit Response
                    </button>
                    <button
                      onClick={() => {
                        setRespondingId(null);
                        setResponseText("");
                      }}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {!r.ownerResponse?.text && (
                    <button
                      onClick={() => setRespondingId(r._id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      💬 Respond
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}

              {/* Metadata */}
              <p className="text-xs text-gray-500 mt-3">
                Posted: {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-8">
        © 2025 FoodieHub
      </footer>
    </div>
  );
};

export default AdminReviews;