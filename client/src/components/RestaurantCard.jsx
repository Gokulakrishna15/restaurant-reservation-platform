import React from "react";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-black border-4 border-pink-500 rounded-xl shadow-lg hover:shadow-neon transition transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden font-mono text-green-300">
      {/* Decorative neon bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"></div>

      {/* Restaurant Image - UPDATED */}
      <img
        src={
          (restaurant.images && restaurant.images[0]) ||
          restaurant.image ||
          `https://source.unsplash.com/400x300/?restaurant,${restaurant.cuisine?.toLowerCase().replace(/\s+/g, ',') || 'food'}`
        }
        alt={restaurant.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
        }}
        className="w-full h-48 object-cover border-b-4 border-cyan-400"
        loading="lazy"
      />

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-extrabold text-pink-400 tracking-widest uppercase">
            {restaurant.name}
          </h3>
          {restaurant.priceRange && (
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-teal-600 text-black rounded-full shadow-md">
              {restaurant.priceRange}
            </span>
          )}
        </div>

        {/* Description */}
        {restaurant.description && (
          <p className="text-cyan-300 text-sm mb-4 leading-relaxed">
            {restaurant.description}
          </p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-cyan-300 mb-4">
          <p>
            <span className="font-semibold text-yellow-300">📍 Location:</span>{" "}
            {restaurant.location}
          </p>
          <p>
            <span className="font-semibold text-yellow-300">🍽 Cuisine:</span>{" "}
            {restaurant.cuisine}
          </p>
          {restaurant.features?.length > 0 && (
            <p className="col-span-2">
              <span className="font-semibold text-yellow-300">✨ Features:</span>{" "}
              {restaurant.features.join(", ")}
            </p>
          )}
        </div>

        {/* Slots */}
        {restaurant.slots?.length > 0 && (
          <div className="mt-3">
            <p className="font-bold text-pink-400 mb-2">Available Slots:</p>
            <ul className="space-y-2">
              {restaurant.slots.slice(0, 3).map((slot, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between bg-gradient-to-r from-purple-900 to-pink-900 px-3 py-2 rounded-lg shadow-md"
                >
                  <span className="text-sm font-semibold text-green-300">
                    {slot.date} at {slot.time}
                  </span>
                  <span className="text-xs text-yellow-300">
                    {slot.capacity} seats left
                  </span>
                </li>
              ))}
            </ul>
            {restaurant.slots.length > 3 && (
              <p className="text-xs text-cyan-400 mt-1">+ more slots available</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => navigate(`/restaurants/${restaurant._id}`)}
            className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-5 py-2 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition"
          >
            View Details
          </button>
          <button
            onClick={() => navigate(`/reserve/${restaurant._id}`)}
            className="bg-gradient-to-r from-cyan-500 to-green-600 text-black px-5 py-2 rounded-lg font-bold shadow-lg hover:from-cyan-600 hover:to-green-700 transition"
          >
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;