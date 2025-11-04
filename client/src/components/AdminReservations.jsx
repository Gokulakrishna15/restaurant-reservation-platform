import React, { useEffect, useState } from 'react';
import axios from '../services/api';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    timeSlot: '',
    numberOfGuests: '',
    specialRequests: ''
  });

  const fetchReservations = async () => {
    try {
      const res = await axios.get('/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleEdit = (r) => {
    setEditingId(r._id);
    setEditForm({
      date: r.date,
      timeSlot: r.timeSlot,
      numberOfGuests: r.numberOfGuests,
      specialRequests: r.specialRequests || ''
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/reservations/${editingId}`, editForm);
      setEditingId(null);
      fetchReservations();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await axios.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Reservations</h2>
      <ul className="space-y-4">
        {reservations.map((r) => (
          <li key={r._id} className="p-4 border rounded bg-gray-50 shadow-sm">
            {editingId === r._id ? (
              <div className="space-y-2">
                <input type="date" name="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="w-full p-2 border rounded" />
                <input type="time" name="timeSlot" value={editForm.timeSlot} onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })} className="w-full p-2 border rounded" />
                <input type="number" name="numberOfGuests" value={editForm.numberOfGuests} onChange={(e) => setEditForm({ ...editForm, numberOfGuests: e.target.value })} className="w-full p-2 border rounded" />
                <textarea name="specialRequests" value={editForm.specialRequests} onChange={(e) => setEditForm({ ...editForm, specialRequests: e.target.value })} className="w-full p-2 border rounded" />
                <button onClick={handleUpdate} className="bg-green-600 text-white px-3 py-1 rounded">Update</button>
              </div>
            ) : (
              <>
                <p><strong>User:</strong> {r.user?.name || 'Anonymous'}</p>
                <p><strong>Restaurant:</strong> {r.restaurant?.name}</p>
                <p><strong>Date:</strong> {r.date}</p>
                <p><strong>Time:</strong> {r.timeSlot}</p>
                <p><strong>Guests:</strong> {r.numberOfGuests}</p>
                <p><strong>Requests:</strong> {r.specialRequests || 'None'}</p>
                <div className="mt-2 space-x-2">
                  <button onClick={() => handleEdit(r)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(r._id)} className="bg-red-500 text-white px-3 py-1 rounded">Cancel</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReservations;