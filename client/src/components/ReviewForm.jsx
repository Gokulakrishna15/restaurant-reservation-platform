import { useState } from 'react';
import axios from '../services/api';

const ReviewForm = ({ restaurantId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: '',
    text: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/reviews', {
        ...formData,
        restaurant: restaurantId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('✅ Review submitted!');
      setFormData({ rating: '', text: '' });
      if (onReviewSubmitted) onReviewSubmitted(); // optional refresh
    } catch (err) {
      console.error('Review submission failed:', err);
      alert('❌ Failed to submit review.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">Leave a Review</h3>
      <input
        type="number"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        placeholder="Rating (1–5)"
        className="w-full mb-2 p-2 border rounded"
        min="1"
        max="5"
        required
      />
      <textarea
        name="text"
        value={formData.text}
        onChange={handleChange}
        placeholder="Your review"
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;