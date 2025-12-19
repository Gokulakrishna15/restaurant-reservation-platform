import React, { useState, useEffect } from "react";
import axios from "../services/api";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: "", timeSlot: "", numberOfGuests: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/reservations/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleEdit = (reservation) => {
    setEditingId(reservation._id);
    setFormData({
      date: reservation.date?.slice(0, 10),
      timeSlot: reservation.timeSlot,
      numberOfGuests: reservation.numberOfGuests,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/reservations/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditingId(null);
      setSuccess("✅ Reservation updated successfully.");
      fetchReservations();
    } catch (err) {
      console.error("❌ Update error:", err);
      setError("Failed to update reservation.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await axios.delete(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess("✅ Reservation cancelled.");
      fetchReservations();
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError("Failed to cancel reservation.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-6 font-mono text-green-300">
      {/* Header */}
      <div className="bg-black border-4 border-pink-500 rounded-xl p-6 mb-6 shadow-lg text-center">
        <h2 className="text-3xl font-extrabold tracking-widest text-pink-400 uppercase">
          📅 Your Reservations
        </h2>
        <p className="mt-2 text-cyan-300 text-sm">Manage, edit, or cancel your bookings easily.</p>
      </div>

      {/* Feedback */}
      {error && <p className="bg-red-900 text-red-300 p-3 rounded mb-4 border border-red-400">❌ {error}</p>}
      {success && <p className="bg-green-900 text-green-300 p-3 rounded mb-4 border border-green-400">✅ {success}</p>}

      {/* Content */}
      {loading ? (
        <p className="text-yellow-300">⌛ Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <div className="bg-black border-2 border-cyan-400 rounded-xl p-6 shadow text-center">
          <p className="text-pink-400">You have no reservations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <div
              key={res._id}
              className="border-2 border-pink-400 rounded-xl bg-black p-5 shadow-lg hover:shadow-neon transition"
            >
              {editingId === res._id ? (
                <div className="space-y-3">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <input
                    type="time"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <input
                    type="number"
                    min="1"
                    value={formData.numberOfGuests}
                    onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                    className="w-full p-2 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
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
                <div>
                  <p className="text-lg font-bold text-pink-400 mb-2">
                    {res.restaurant?.name || "Unknown Restaurant"}
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-cyan-300">
                    <p><span className="font-semibold">📅 Date:</span> {res.date?.slice(0,10)}</p>
                    <p><span className="font-semibold">⏰ Time:</span> {res.timeSlot}</p>
                    <p><span className="font-semibold">👥 Guests:</span> {res.numberOfGuests}</p>
                    <p><span className="font-semibold">📌 Status:</span> {res.status}</p>
                    <p><span className="font-semibold">💳 Payment:</span> {res.paymentStatus}</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(res)}
                      className="flex-1 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(res._id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                      🗑 Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Retro Proof Banner */}
      <div className="text-xs text-yellow-400 text-center mt-6 uppercase tracking-widest">
      </div>

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-6">
      </footer>
    </div>
  );
};

export default ReservationList;