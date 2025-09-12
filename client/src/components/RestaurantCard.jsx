import ReviewForm from './ReviewForm';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="border p-4 rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
      <p>{restaurant.description}</p>
      <p><strong>Location:</strong> {restaurant.location}</p>
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>

      {/* ✅ Dynamically pass restaurantId to ReviewForm */}
      <ReviewForm restaurantId={restaurant._id} />
    </div>
  );
};

export default RestaurantCard;