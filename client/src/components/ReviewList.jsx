import { useState, useEffect } from 'react';
import axios from '../services/api'; // ✅ Use your configured axios instance

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ text: '', rating: 0 });

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/reviews', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReviews(res.data);
    } catch (err) {
      console.error('Fetch reviews error:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEdit = (review) => {
    setEditingId(review._id);
    setFormData({ text: review.text, rating: review.rating });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/reviews/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      console.error('Update review error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchReviews();
    } catch (err) {
      console.error('Delete review error:', err);
    }
  };

  const handleOwnerReply = async (id, replyText) => {
    try {
      await axios.put(`/reviews/${id}/reply`, { ownerReply: replyText }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchReviews();
    } catch (err) {
      console.error('Owner reply error:', err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">User Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews found.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev._id} className="border p-4 mb-4 rounded shadow bg-white">
            {editingId === rev._id ? (
              <div className="space-y-2">
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
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
                  <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded">
                    Update
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p><strong>Restaurant:</strong> {rev.restaurant?.name || 'N/A'}</p>
                <p><strong>Rating:</strong> {rev.rating}</p>
                <p>{rev.text}</p>
                {rev.ownerReply && (
                  <p className="text-sm text-gray-600"><strong>Owner Reply:</strong> {rev.ownerReply}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(rev)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(rev._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Reply as owner..."
                  onBlur={(e) => handleOwnerReply(rev._id, e.target.value)}
                  className="mt-2 w-full border px-2 py-1 rounded"
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;