import React, { useEffect, useState } from "react";
import axios from "../services/api";
import RestaurantCard from "./RestaurantCard";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState({ cuisine: "", location: "", features: "" });
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState(""); // ✅ sorting state

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/restaurants");
      const data = Array.isArray(res.data) ? res.data : [];
      setRestaurants(data);
      setNoResults(data.length === 0);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to load restaurants. Please try again.");
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.cuisine) params.append("cuisine", search.cuisine);
      if (search.location) params.append("location", search.location);
      if (search.features) params.append("features", search.features);

      const res = await axios.get(`/restaurants/search?${params.toString()}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setRestaurants(data);
      setNoResults(data.length === 0);
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
      setNoResults(true);
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setSearch({ cuisine: "", location: "", features: "" });
    setSortBy("");
    fetchRestaurants();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ✅ Sorting logic
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortBy === "price") {
      return (a.priceRange || "").localeCompare(b.priceRange || "");
    }
    if (sortBy === "cuisine") {
      return (a.cuisine || "").localeCompare(b.cuisine || "");
    }
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-8 font-mono text-green-300">
      {/* Header */}
      <div className="bg-black border-4 border-pink-500 rounded-xl p-6 mb-8 shadow-lg text-center">
        <h2 className="text-3xl font-extrabold tracking-widest text-pink-400 uppercase">
          🍴 FoodieHub Restaurants
        </h2>
        <p className="mt-2 text-cyan-300 text-sm">
          Discover, search, sort, and book your favorite spots.
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Cuisine (e.g. Italian)"
          value={search.cuisine}
          onChange={(e) => setSearch({ ...search, cuisine: e.target.value })}
          onKeyPress={handleKeyPress}
          className="p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />
        <input
          type="text"
          placeholder="Location (e.g. Chennai)"
          value={search.location}
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
          onKeyPress={handleKeyPress}
          className="p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <input
          type="text"
          placeholder="Features (e.g. outdoor seating)"
          value={search.features}
          onChange={(e) => setSearch({ ...search, features: e.target.value })}
          onKeyPress={handleKeyPress}
          className="p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      {/* Search & Reset Buttons + Sort Dropdown */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition"
          disabled={searching}
        >
          {searching ? "⌛ Searching..." : "Search"}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-gray-700 transition"
        >
          Reset
        </button>

        {/* ✅ Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border-2 border-cyan-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        >
          <option value="">Sort By</option>
          <option value="price">💲 Price Range</option>
          <option value="cuisine">🍽 Cuisine</option>
          <option value="rating">⭐ Rating</option>
        </select>
      </div>

      {/* Active Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {search.cuisine && (
          <span className="px-3 py-1 bg-pink-500 text-white rounded-full text-xs">
            Cuisine: {search.cuisine}
          </span>
        )}
        {search.location && (
          <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs">
            Location: {search.location}
          </span>
        )}
        {search.features && (
          <span className="px-3 py-1 bg-cyan-500 text-black rounded-full text-xs">
            Features: {search.features}
          </span>
        )}
        {sortBy && (
          <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-xs">
            Sorted by: {sortBy}
          </span>
        )}
      </div>

      {/* 🏨 Restaurant Cards */}
      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-black border-4 border-pink-500 rounded-xl p-6 animate-pulse"
            >
              <div className="h-32 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="bg-red-900 text-red-300 p-3 rounded border border-red-400">{error}</p>
      ) : noResults ? (
        <p className="bg-red-900 text-red-300 p-3 rounded border border-red-400">
          No restaurants found matching your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="animate-fadeIn">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;