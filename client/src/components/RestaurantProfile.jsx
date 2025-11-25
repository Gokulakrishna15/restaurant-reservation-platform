import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import ReviewForm from './ReviewForm';

const RestaurantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);

  const fetchRestaurant = useCallback(async () => {
    try {
      // ✅ Correct path: /restaurants/:id
      const res = await axios.get(`/restaurants/${id}`);
      setRestaurant(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching restaurant:', err);
      setError('Failed to load restaurant details.');
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!restaurant) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded max-w-3xl mx-auto">
      {restaurant.imageUrl && (
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
      <p className="mb-2">{restaurant.cuisine} • ₹{restaurant.priceRange}</p>
      <p className="mb-2"><strong>Location:</strong> {restaurant.location}</p>
      <p className="mb-2"><strong>Hours:</strong> {restaurant.hours}</p>
      <p className="mb-2"><strong>Contact:</strong> {restaurant.contact}</p>
      <p className="mb-4"><strong>Dietary Options:</strong> {restaurant.dietaryOptions?.join(', ') || 'None'}</p>
      <p className="mb-4"><strong>Ambiance:</strong> {restaurant.ambiance?.join(', ') || 'None'}</p>
      <p className="mb-4"><strong>Features:</strong> {restaurant.features?.join(', ') || 'None'}</p>

      <h3 className="text-xl font-semibold mb-2">Menu</h3>
      {restaurant.menu?.length > 0 ? (
        <ul className="list-disc pl-5 mb-4">
          {restaurant.menu.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      ) : (
        <p className="mb-4 text-gray-600">No menu items available.</p>
      )}

      <h3 className="text-xl font-semibold mb-2">Reviews</h3>
      {restaurant.reviews?.length > 0 ? (
        restaurant.reviews.map((review) => (
          <div key={review._id} className="border p-3 mb-2 rounded">
            <p><strong>{review.user?.name || 'Anonymous'}:</strong> {review.comment}</p>
            <p>⭐ {review.rating}</p>
            {review.createdAt && (
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="mb-4 text-gray-600">No reviews yet.</p>
      )}

      {/* ✅ Reservation Button */}
      <button
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => navigate(`/reserve/${restaurant._id}`)}
      >
        Reserve Now
      </button>

      {/* ✅ Conditional Review Form */}
      {restaurant.hasReservation ? (
        <div className="mt-6">
          <ReviewForm restaurantId={restaurant._id} onReviewSubmitted={fetchRestaurant} />
        </div>
      ) : (
        <p className="text-red-600 mt-4">
          ⚠️ You must reserve before leaving a review.
        </p>
      )}
    </div>
  );
};

export default RestaurantProfile;