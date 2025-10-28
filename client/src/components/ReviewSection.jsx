import { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewSection = ({ restaurantName, userToken }) => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ comment: '', rating: 5 });

  useEffect(() => {
    axios.get(`http://https://restaurant-reservation-platform-cefo.onrender.com/api/reviews/${restaurantName}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('Error fetching reviews:', err));
  }, [restaurantName]);

  const handleSubmit = async () => {
    try {
      await axios.post('http://https://restaurant-reservation-platform-cefo.onrender.com/api/reviews', {
        restaurant: restaurantName,
        comment: form.comment,
        rating: form.rating
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setForm({ comment: '', rating: 5 });
      const res = await axios.get(`http://https://restaurant-reservation-platform-cefo.onrender.com/api/reviews/${restaurantName}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Reviews</h3>
      <textarea
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        className="w-full border p-2 mb-2"
        placeholder="Leave a comment"
      />
      <input
        type="number"
        min="1"
        max="5"
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: e.target.value })}
        className="w-full border p-2 mb-2"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2">Submit</button>

      {reviews.map((r) => (
        <div key={r._id} className="mt-4 border p-2 rounded">
          <p><strong>{r.user.name}</strong> rated {r.rating}/5</p>
          <p>{r.comment}</p>
          {r.ownerReply && <p className="text-sm text-gray-600">Owner replied: {r.ownerReply}</p>}
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;