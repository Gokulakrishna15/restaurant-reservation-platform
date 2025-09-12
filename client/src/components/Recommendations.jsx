import { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = ({ userToken }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants/recommendations', {
      headers: { Authorization: `Bearer ${userToken}` }
    })
      .then(res => setRestaurants(res.data))
      .catch(err => console.error('Recommendation error:', err));
  }, [userToken]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Recommended for You</h3>
      {restaurants.map((r) => (
        <div key={r._id} className="border p-2 mb-2 rounded">
          <p><strong>{r.name}</strong></p>
          <p>{r.cuisineType} — {r.location}</p>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;