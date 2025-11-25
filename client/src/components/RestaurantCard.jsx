import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
      {restaurant.description && <p>{restaurant.description}</p>}
      <p><strong>Location:</strong> {restaurant.location}</p>
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>

      {/* ✅ Navigate to Restaurant Profile */}
      <button
        onClick={() => navigate(`/restaurants/${restaurant._id}`)}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Select
      </button>
    </div>
  );
};

export default RestaurantCard;