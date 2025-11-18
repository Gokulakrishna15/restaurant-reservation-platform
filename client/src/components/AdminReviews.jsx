import React, { useEffect, useState } from 'react';
import axios from '../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/reviews', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Moderate Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews found.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="p-4 border rounded bg-gray-50 shadow-sm">
              <p><strong>User:</strong> {r.user?.name || 'Anonymous'}</p>
              <p><strong>Restaurant:</strong> {r.restaurant?.name}</p>
              <p><strong>Rating:</strong> ⭐ {r.rating}</p>
              <p><strong>Comment:</strong> {r.comment || r.text}</p>
              {r.ownerReply && (
                <p className="text-sm text-gray-600"><strong>Owner Reply:</strong> {r.ownerReply}</p>
              )}
              <button
                onClick={() => handleDelete(r._id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReviews;