import React, { useState, useEffect } from 'react';
import axios from '../services/api';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: '', timeSlot: '', numberOfGuests: '' });

  const fetchReservations = async () => {
    try {
      const res = await axios.get('/reservations/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleEdit = (reservation) => {
    setEditingId(reservation._id);
    setFormData({
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      numberOfGuests: reservation.numberOfGuests
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/reservations/${editingId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEditingId(null);
      fetchReservations();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await axios.delete(`/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchReservations();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Reservations</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-600">You have no reservations yet.</p>
      ) : (
        reservations.map((res) => (
          <div key={res._id} className="border p-4 mb-4 rounded shadow bg-white">
            {editingId === res._id ? (
              <div className="space-y-2">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="time"
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1 rounded">
                    Update
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p><strong>Restaurant:</strong> {res.restaurant?.name || 'N/A'}</p>
                <p><strong>Date:</strong> {res.date}</p>
                <p><strong>Time:</strong> {res.timeSlot}</p>
                <p><strong>Guests:</strong> {res.numberOfGuests}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(res)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(res._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReservationList;