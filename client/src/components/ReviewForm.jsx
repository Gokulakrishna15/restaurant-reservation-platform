import { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ restaurantId }) => {
  const [formData, setFormData] = useState({
    reviewer: '',
    rating: '',
    comment: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        ...formData,
        restaurantId,
      });
      alert('Review submitted!');
      setFormData({ reviewer: '', rating: '', comment: '' });
    } catch (err) {
      console.error('Review submission failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">Leave a Review</h3>
      <input
        type="text"
        name="reviewer"
        value={formData.reviewer}
        onChange={handleChange}
        placeholder="Your Name"
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="number"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        placeholder="Rating (1-5)"
        className="w-full mb-2 p-2 border rounded"
        min="1"
        max="5"
        required
      />
      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        placeholder="Your review"
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;