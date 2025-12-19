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
        const res = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.data.role === "admin");
      } catch (err) {
        console.error("Failed to check user role:", err);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };
    checkAdmin();
  }, [token]); // ✅ include token

  // ✅ Stable fetch function
  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await axios.get("/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data);
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
      setError("❌ Failed to load restaurants.");
    }
  }, [token]); // ✅ depends on token

  // ✅ Effect depends on isAdmin + fetchRestaurants
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
      fetchRestaurants();
    } catch (err) {
      console.error("Create failed:", err);
      setError("❌ Failed to create restaurant.");
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
    } catch (err) {
      console.error("Delete failed:", err);
      setError("❌ Failed to delete restaurant.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (checkingRole) return <p className="text-sm text-yellow-300">Checking admin access...</p>;

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-black border-4 border-red-500 rounded-xl text-center font-mono text-green-300">
        <h2 className="text-2xl font-bold text-pink-400 mb-2 uppercase">Access Denied</h2>
        <p className="text-yellow-300">⚠️ You do not have admin privileges to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-8 font-mono text-green-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-pink-400 tracking-widest uppercase">
          ⚡ Admin Dashboard
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Create Restaurant Form */}
      <form onSubmit={handleCreate} className="mb-8 p-6 bg-black border-4 border-cyan-400 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-yellow-300 mb-4 uppercase">➕ Add New Restaurant</h3>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full mb-2 p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-cyan-400"
        />
        <input
          name="cuisine"
          value={form.cuisine}
          onChange={handleChange}
          placeholder="Cuisine"
          required
          className="w-full mb-2 p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-purple-400"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full mb-2 p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-yellow-400"
        />
        <select
          name="priceRange"
          value={form.priceRange}
          onChange={handleChange}
          className="w-full mb-2 p-2 border-2 border-pink-400 bg-black text-green-300 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mb-2 p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-purple-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-purple-800 transition disabled:opacity-50"
        >
          {loading ? "⌛ Creating..." : "Create Restaurant"}
        </button>
      </form>

      {error && <p className="bg-red-900 text-red-300 p-3 rounded border border-red-400 mb-4">{error}</p>}
      {success && <p className="bg-green-900 text-green-300 p-3 rounded border border-green-400 mb-4">{success}</p>}

      {/* Restaurant List */}
      <ul className="space-y-4">
        {restaurants.map((r) => (
          <li key={r._id} className="p-4 border-2 border-purple-500 rounded-xl bg-black shadow-lg hover:shadow-neon transition">
            <h3 className="text-lg font-bold text-pink-400">{r.name}</h3>
            <p className="text-cyan-300">{r.description}</p>
            <p className="text-sm text-yellow-300">
              {r.cuisine} • {r.location} • {priceMap[r.priceRange] || r.priceRange}
            </p>
            <button
              onClick={() => handleDelete(r._id)}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-red-700 transition"
            >
              🗑 Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Retro Proof Banner */}
      <div className="text-xs text-yellow-400 text-center mt-8 uppercase tracking-widest">
        TailwindCSS Retro Proof Banner for Zen Class ✅
      </div>

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-6">
        © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
      </footer>
    </div>
  );
};

export default AdminDashboard;