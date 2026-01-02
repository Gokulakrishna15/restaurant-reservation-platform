import React, { useEffect, useState, useCallback } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const priceMap = { low: "₹", medium: "₹₹", high: "₹₹₹" };

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: "",
    cuisine: "",
    location: "",
    priceRange: "medium",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Check admin role
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.data.user.role === "admin");
      } catch (err) {
        console.error("Failed to check user role:", err);
        setIsAdmin(false);
        navigate("/login");
      } finally {
        setCheckingRole(false);
      }
    };
    checkAdmin();
  }, [token, navigate]);

  // ✅ FIXED: Proper data structure handling
  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await axios.get("/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ✅ Handle both response formats
      const data = res.data.data || res.data;
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
      setError("❌ Failed to load restaurants.");
    }
  }, [token]);

  useEffect(() => {
    if (isAdmin) fetchRestaurants();
  }, [isAdmin, fetchRestaurants]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("/restaurants", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        name: "",
        cuisine: "",
        location: "",
        priceRange: "medium",
        description: "",
      });
      setSuccess("✅ Restaurant created successfully.");
      setTimeout(() => setSuccess(""), 3000);
      fetchRestaurants();
    } catch (err) {
      console.error("Create failed:", err);
      setError(err.response?.data?.error || "❌ Failed to create restaurant.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      await axios.delete(`/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(restaurants.filter((r) => r._id !== id));
      setSuccess("✅ Restaurant deleted.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err.response?.data?.error || "❌ Failed to delete restaurant.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-yellow-300 font-mono">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 p-4">
        <div className="max-w-xl w-full p-8 bg-black border-4 border-red-500 rounded-xl text-center font-mono text-green-300">
          <div className="text-6xl mb-4">⛔</div>
          <h2 className="text-3xl font-bold text-pink-400 mb-4 uppercase">Access Denied</h2>
          <p className="text-yellow-300 mb-6">⚠️ You do not have admin privileges to view this dashboard.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-6 py-3 rounded-lg font-bold hover:from-pink-600 hover:to-purple-800 transition"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-8 font-mono text-green-300">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-pink-400 tracking-widest uppercase">
          ⚡ Admin Dashboard
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/reservations")}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-cyan-700 transition"
          >
            📅 Reservations
          </button>
          <button
            onClick={() => navigate("/admin/reviews")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition"
          >
            ⭐ Reviews
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Create Restaurant Form */}
      <form onSubmit={handleCreate} className="mb-8 p-6 bg-black border-4 border-cyan-400 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-yellow-300 mb-4 uppercase">➕ Add New Restaurant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Restaurant Name"
            required
            className="p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
          <input
            name="cuisine"
            value={form.cuisine}
            onChange={handleChange}
            placeholder="Cuisine (e.g. Italian)"
            required
            className="p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (e.g. Mumbai)"
            required
            className="p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <select
            name="priceRange"
            value={form.priceRange}
            onChange={handleChange}
            className="p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none"
          >
            <option value="₹">₹ - Budget</option>
            <option value="₹₹">₹₹ - Moderate</option>
            <option value="₹₹₹">₹₹₹ - Expensive</option>
          </select>
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full mt-4 p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-cyan-400 focus:outline-none h-24"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-700 text-white px-4 py-3 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition disabled:opacity-50"
        >
          {loading ? "⌛ Creating..." : "Create Restaurant"}
        </button>
      </form>

      {/* Feedback Messages */}
      {error && (
        <div className="bg-red-900 text-red-300 p-4 rounded-lg mb-4 border-2 border-red-400 animate-pulse">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900 text-green-300 p-4 rounded-lg mb-4 border-2 border-green-400 animate-pulse">
          {success}
        </div>
      )}

      {/* Restaurant List */}
      <div className="bg-black border-4 border-pink-500 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-pink-400 mb-4 uppercase">📋 Manage Restaurants</h3>
        
        {restaurants.length === 0 ? (
          <p className="text-center text-yellow-300 py-8">
            No restaurants yet. Create one above or run: node seed.js
          </p>
        ) : (
          <div className="space-y-4">
            {restaurants.map((r) => (
              <div
                key={r._id}
                className="p-5 border-2 border-purple-500 rounded-xl bg-black shadow-lg hover:shadow-neon transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-pink-400 mb-2">{r.name}</h4>
                    <p className="text-cyan-300 text-sm mb-3">{r.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="bg-purple-900 px-3 py-1 rounded text-yellow-300">
                        🍽 {r.cuisine}
                      </span>
                      <span className="bg-purple-900 px-3 py-1 rounded text-cyan-300">
                        📍 {r.location}
                      </span>
                      <span className="bg-purple-900 px-3 py-1 rounded text-green-300">
                        💰 {r.priceRange}
                      </span>
                      <span className="bg-purple-900 px-3 py-1 rounded text-pink-300">
                        ⭐ {r.rating?.toFixed(1) || "0.0"} ({r.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-8">
        © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
      </footer>
    </div>
  );
};

export default AdminDashboard;