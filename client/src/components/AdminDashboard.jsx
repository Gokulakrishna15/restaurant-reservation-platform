import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('https://restaurant-reservation-platform-cefo.onrender.com/api/restaurants', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRestaurants(res.data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
    };
    fetchRestaurants();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://restaurant-reservation-platform-cefo.onrender.com/api/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurants(restaurants.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
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