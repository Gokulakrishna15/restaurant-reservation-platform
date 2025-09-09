import { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ comment: '', rating: 0 });

  const fetchReviews = async () => {
    const res = await axios.get('/api/reviews');
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEdit = (review) => {
    setEditingId(review._id);
    setFormData({ comment: review.comment, rating: review.rating });
  };

  const handleUpdate = async () => {
    await axios.put(`/api/reviews/${editingId}`, formData);
    setEditingId(null);
    fetchReviews();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/reviews/${id}`);
    fetchReviews();
  };

  const handleOwnerReply = async (id, replyText) => {
    await axios.put(`/api/reviews/${id}/reply`, { ownerReply: replyText });
    fetchReviews();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Reviews</h2>
      {reviews.map((rev) => (
        <div key={rev._id} className="border p-4 mb-2 rounded shadow">
          {editingId === rev._id ? (
            <div className="space-y-2">
              <textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
              <input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
              <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1">Update</button>
            </div>
          ) : (
            <div>
              <p><strong>Rating:</strong> {rev.rating}</p>
              <p>{rev.comment}</p>
              {rev.ownerReply && <p className="text-sm text-gray-600"><strong>Owner Reply:</strong> {rev.ownerReply}</p>}
              <button onClick={() => handleEdit(rev)} className="bg-yellow-500 text-white px-3 py-1 mr-2">Edit</button>
              <button onClick={() => handleDelete(rev._id)} className="bg-red-500 text-white px-3 py-1">Delete</button>
              <input type="text" placeholder="Reply as owner..." onBlur={(e) => handleOwnerReply(rev._id, e.target.value)} className="mt-2 border px-2 py-1" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;