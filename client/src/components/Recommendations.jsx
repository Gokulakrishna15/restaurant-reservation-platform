import { useEffect, useState } from 'react';
import axios from '../services/api';

const Recommendations = ({ userToken }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('/restaurants/recommendations', {
      headers: { Authorization: `Bearer ${userToken}` }
    })
      .then(res => setRestaurants(res.data))
      .catch(err => console.error('Recommendation error:', err));
  }, [userToken]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h3 className="text-lg font-bold mb-2">Recommended for You</h3>
      {restaurants.length === 0 ? (
        <p className="text-gray-600">No recommendations available.</p>
      ) : (
        restaurants.map((r) => (
          <div key={r._id} className="border p-2 mb-2 rounded bg-white shadow-sm">
            <p className="font-semibold">{r.name}</p>
            <p>{r.cuisineType} — {r.location}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Recommendations;