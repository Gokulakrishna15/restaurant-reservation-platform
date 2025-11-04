import { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://restaurant-reservation-platform-cefo.onrender.com/api';

const SearchBar = ({ setResults }) => {
  const [filters, setFilters] = useState({ cuisine: '', location: '', features: '' });

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/restaurants/search`, {
        params: filters
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="p-4 flex flex-wrap gap-2">
      <input
        placeholder="Cuisine"
        value={filters.cuisine}
        onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        className="border p-2 rounded"
      />
      <input
        placeholder="Features (comma separated)"
        value={filters.features}
        onChange={(e) => setFilters({ ...filters, features: e.target.value })}
        className="border p-2 rounded"
      />
      <button onClick={handleSearch} className="bg-green-500 text-white px-4 py-2 rounded">Search</button>
    </div>
  );
};

export default SearchBar;