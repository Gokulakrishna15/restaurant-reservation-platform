import React, { useEffect, useState, useCallback } from "react";
import axios from "../services/api";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    timeSlot: "",
    numberOfGuests: "",
    specialRequests: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Wrap fetchReservations with useCallback
  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
      setError("❌ Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  }, [token]); // ✅ token is dependency

  // ✅ Now fetchReservations is in dependency array
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleEdit = (r) => {
    setEditingId(r._id);
    setEditForm({
      date: r.date?.slice(0, 10) || "",
      timeSlot: r.timeSlot || "",
      numberOfGuests: r.numberOfGuests || 1,
      specialRequests: r.specialRequests || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/reservations/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      setSuccess("✅ Reservation updated successfully.");
      fetchReservations();
    } catch (err) {
      console.error("Update failed:", err);
      setError("❌ Failed to update reservation.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await axios.delete(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✅ Reservation cancelled.");
      fetchReservations();
    } catch (err) {
      console.error("Delete failed:", err);
      setError("❌ Failed to cancel reservation.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-8 font-mono text-green-300">
      {/* Header */}
      <div className="bg-black border-4 border-pink-500 rounded-xl p-6 mb-8 shadow-lg text-center">
        <h2 className="text-3xl font-extrabold tracking-widest text-pink-400 uppercase">
          📅 Manage All Reservations
        </h2>
        <p className="mt-2 text-cyan-300 text-sm">Edit or cancel any reservation</p>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="bg-red-900 text-red-300 p-4 rounded-lg mb-6 border-2 border-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900 text-green-300 p-4 rounded-lg mb-6 border-2 border-green-400">
          {success}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <p className="text-yellow-300 text-center">⌛ Loading reservations...</p>
      ) : error && reservations.length === 0 ? (
        <div className="bg-black border-2 border-cyan-400 rounded-xl p-6 shadow text-center">
          <p className="text-pink-400">No reservations found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <div
              key={r._id}
              className="border-2 border-purple-500 rounded-xl bg-black p-6 shadow-lg hover:shadow-neon transition"
            >
              {editingId === r._id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div>
                    <label className="block text-cyan-300 mb-1 font-semibold">Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-1 font-semibold">Time</label>
                    <input
                      type="time"
                      value={editForm.timeSlot}
                      onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })}
                      className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-1 font-semibold">Number of Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.numberOfGuests}
                      onChange={(e) => setEditForm({ ...editForm, numberOfGuests: e.target.value })}
                      className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-300 mb-1 font-semibold">Special Requests</label>
                    <textarea
                      value={editForm.specialRequests}
                      onChange={(e) => setEditForm({ ...editForm, specialRequests: e.target.value })}
                      className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 h-20"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                      ✅ Update
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700 transition"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <p className="text-lg font-bold text-pink-400 mb-3">
                    {r.restaurant?.name || "Unknown Restaurant"}
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-cyan-300 mb-4">
                    <p><span className="font-semibold">👤 User:</span> {r.user?.name || "Anonymous"}</p>
                    <p><span className="font-semibold">📅 Date:</span> {r.date?.slice(0, 10) || "N/A"}</p>
                    <p><span className="font-semibold">⏰ Time:</span> {r.timeSlot}</p>
                    <p><span className="font-semibold">👥 Guests:</span> {r.numberOfGuests}</p>
                    <p><span className="font-semibold">📝 Requests:</span> {r.specialRequests || "None"}</p>
                    <p><span className="font-semibold">📌 Status:</span> {r.status}</p>
                    <p><span className="font-semibold">💳 Payment:</span> {r.paymentStatus}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(r)}
                      className="flex-1 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                      🗑 Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-8">
        © 2025 FoodieHub
      </footer>
    </div>
  );
};

export default AdminReservations;