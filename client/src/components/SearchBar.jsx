import { useState } from "react";
import axios from "axios";

const BASE_URL = "https://restaurant-reservation-platform-cefo.onrender.com/api";

const SearchBar = ({ setResults }) => {
  const [filters, setFilters] = useState({ cuisine: "", location: "", features: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/restaurants/search`, { params: filters });
      const data = Array.isArray(res.data) ? res.data : [];
      setResults(data);
      if (data.length === 0) setError("No restaurants found matching your search.");
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({ cuisine: "", location: "", features: "" });
    setResults([]); // or refetch all restaurants in parent
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="p-4 flex flex-wrap gap-2 items-center">
      <input
        placeholder="Cuisine (e.g. Italian)"
        value={filters.cuisine}
        onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        onKeyPress={handleKeyPress}
        className="border p-2 rounded flex-1"
      />
      <input
        placeholder="Location (e.g. Chennai)"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        onKeyPress={handleKeyPress}
        className="border p-2 rounded flex-1"
      />
      <input
        placeholder="Features (comma separated)"
        value={filters.features}
        onChange={(e) => setFilters({ ...filters, features: e.target.value })}
        onKeyPress={handleKeyPress}
        className="border p-2 rounded flex-1"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
      <button
        onClick={handleReset}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Reset
      </button>

      {error && <p className="text-red-600 mt-2 w-full">{error}</p>}
    </div>
  );
};

export default SearchBar;