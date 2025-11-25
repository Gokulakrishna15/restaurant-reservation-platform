import React, { useEffect, useState } from 'react';
import axios from '../services/api'; // ✅ use your configured axios instance
import RestaurantCard from './RestaurantCard';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]); // ✅ always array
  const [search, setSearch] = useState({
    cuisine: '',
    location: '',
    features: ''
  });
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('/restaurants'); // ✅ list endpoint
      const data = Array.isArray(res.data) ? res.data : []; // defensive
      setRestaurants(data);
      setNoResults(data.length === 0);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      const params = new URLSearchParams();
      if (search.cuisine) params.append('cuisine', search.cuisine);
      if (search.location) params.append('location', search.location);
      if (search.features) params.append('features', search.features);

      const res = await axios.get(`/restaurants/search?${params.toString()}`);
      const data = Array.isArray(res.data) ? res.data : []; // defensive
      setRestaurants(data);
      setNoResults(data.length === 0);
    } catch (err) {
      console.error('Search error:', err);
      setNoResults(true);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Restaurants</h2>

      {/* 🔍 Search Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Cuisine (e.g. Italian)"
          value={search.cuisine}
          onChange={(e) => setSearch({ ...search, cuisine: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location (e.g. Chennai)"
          value={search.location}
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Features (e.g. outdoor seating)"
          value={search.features}
          onChange={(e) => setSearch({ ...search, features: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* 🏨 Restaurant Cards */}
      {loading ? (
        <p className="text-gray-500">Loading restaurants...</p>
      ) : noResults ? (
        <p className="text-red-600 font-medium">No restaurants found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;