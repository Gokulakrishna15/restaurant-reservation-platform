import { useState, useEffect } from "react";
import axios from "../services/api";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ comment: "", rating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/reviews", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Fetch reviews error:", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEdit = (review) => {
    setEditingId(review._id);
    setFormData({ comment: review.comment, rating: review.rating });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/reviews/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditingId(null);
      setSuccess("✅ Review updated successfully.");
      fetchReviews();
    } catch (err) {
      console.error("Update review error:", err);
      setError("Failed to update review.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess("✅ Review deleted.");
      fetchReviews();
    } catch (err) {
      console.error("Delete review error:", err);
      setError("Failed to delete review.");
    }
  };

  const handleOwnerReply = async (id, replyText) => {
    try {
      await axios.put(
        `/reviews/${id}/reply`,
        { ownerResponse: replyText },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSuccess("✅ Owner response added.");
      fetchReviews();
    } catch (err) {
      console.error("Owner reply error:", err);
      setError("Failed to add owner response.");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">User Reviews</h2>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">No reviews found.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev._id} className="border p-4 mb-4 rounded shadow bg-white">
            {editingId === rev._id ? (
              <div className="space-y-2">
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Restaurant:</strong> {rev.restaurant?.name || "N/A"}
                </p>
                <p>
                  <strong>Rating:</strong> {rev.rating}
                </p>
                <p>{rev.comment}</p>
                {rev.ownerResponse && (
                  <p className="text-sm text-gray-600">
                    <strong>Owner Response:</strong> {rev.ownerResponse}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(rev)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Reply as owner..."
                    className="flex-1 border px-2 py-1 rounded"
                    onChange={(e) => setFormData({ ...formData, ownerResponse: e.target.value })}
                  />
                  <button
                    onClick={() => handleOwnerReply(rev._id, formData.ownerResponse)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {success && <p className="text-green-600 mt-3">{success}</p>}
    </div>
  );
};

export default ReviewList;