import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'https://restaurant-reservation-platform-cefo.onrender.com/api';

const RestaurantProfile = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/restaurants/${id}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error('Error fetching restaurant:', err));
  }, [id]);

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold">{restaurant.name}</h2>
      <p>{restaurant.description}</p>
      <p><strong>Location:</strong> {restaurant.location}</p>
      <p><strong>Hours:</strong> {restaurant.hours}</p>
      <p><strong>Contact:</strong> {restaurant.contact}</p>
      {/* Add menu, images, reviews */}
    </div>
  );
};

export default RestaurantProfile;