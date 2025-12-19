import React, { useEffect, useState } from "react";
import axios from "../services/api";
import RestaurantCard from "./RestaurantCard";
import RestaurantFilters from "./RestaurantFilters";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cuisine: "",
    location: "",
    features: "",
  });
  const [error, setError] = useState("");

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/restaurants");
        const data = res.data?.data || res.data;
        setRestaurants(data || []);
        setFiltered(data || []);
      } catch (err) {
        console.error("❌ Fetch restaurants error:", err.response?.data || err.message);
        setError("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Handle input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  // Apply filters
  const handleSearch = () => {
    const cuisine = filters.cuisine.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();
    const features = filters.features.trim().toLowerCase();

    const result = restaurants.filter((r) => {
      const matchCuisine = cuisine
        ? String(r.cuisine || "").toLowerCase().includes(cuisine)
        : true;
      const matchLocation = location
        ? String(r.location || "").toLowerCase().includes(location)
        : true;
      const matchFeatures = features
        ? Array.isArray(r.features)
          ? r.features.some((f) => String(f).toLowerCase().includes(features))
          : String(r.features || "").toLowerCase().includes(features)
        : true;
      return matchCuisine && matchLocation && matchFeatures;
    });

    setFiltered(result);
  };

  // Reset filters
  const handleReset = () => {
    setFilters({ cuisine: "", location: "", features: "" });
    setFiltered(restaurants);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-tight">🍴 Restaurants</h1>
        <p className="mt-2 text-sm opacity-95">
          Discover, filter, and book your favorite places — no slot restrictions.
        </p>
      </div>

      {/* Filters */}
      <RestaurantFilters
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Content */}
      {loading ? (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      ) : error ? (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p className="text-red-600">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
          <p className="text-gray-600">
            No restaurants match your filters. Try adjusting cuisine, location, or features.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
