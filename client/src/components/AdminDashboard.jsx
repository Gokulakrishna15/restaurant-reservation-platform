import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(res.data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/restaurants/${id}`);
      setRestaurants(restaurants.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <ul className="space-y-4">
        {restaurants.map((r) => (
          <li key={r._id} className="p-4 border rounded bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold">{r.name}</h3>
            <p>{r.description}</p>
            <button
              onClick={() => handleDelete(r._id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;