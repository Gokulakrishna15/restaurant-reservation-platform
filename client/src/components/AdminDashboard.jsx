import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: '',
    cuisine: '',
    location: '',
    priceRange: 'medium',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('/restaurants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurants(res.data);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/restaurants', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ name: '', cuisine: '', location: '', priceRange: 'medium', description: '' });
      fetchRestaurants();
    } catch (err) {
      console.error('Create failed:', err);
      alert('❌ Failed to create restaurant.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      await axios.delete(`/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRestaurants(restaurants.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('❌ Failed to delete restaurant.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      {/* ✅ Create Restaurant Form */}
      <form onSubmit={handleCreate} className="mb-8 p-4 bg-white shadow rounded">
        <h3 className="text-lg font-semibold mb-4">Add New Restaurant</h3>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full mb-2 p-2 border rounded" />
        <input name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="Cuisine" required className="w-full mb-2 p-2 border rounded" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required className="w-full mb-2 p-2 border rounded" />
        <select name="priceRange" value={form.priceRange} onChange={handleChange} className="w-full mb-2 p-2 border rounded">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full mb-2 p-2 border rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? 'Creating...' : 'Create Restaurant'}
        </button>
      </form>

      {/* ✅ Restaurant List */}
      <ul className="space-y-4">
        {restaurants.map((r) => (
          <li key={r._id} className="p-4 border rounded bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold">{r.name}</h3>
            <p>{r.description}</p>
            <p className="text-sm text-gray-600">{r.cuisine} • {r.location} • ₹{r.priceRange}</p>
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