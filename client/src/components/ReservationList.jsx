import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: '', time: '', partySize: '' });

  const fetchReservations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reservations'); // ✅ Full URL
      console.log('Fetched reservations:', res.data);
      setReservations(Array.isArray(res.data) ? res.data : []); // ✅ Safety check
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
      time: reservation.timeSlot,
      partySize: reservation.numberOfGuests,
    });
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/api/reservations/${editingId}`, formData);
    setEditingId(null);
    fetchReservations();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/reservations/${id}`);
    fetchReservations();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Reservations</h2>
      {Array.isArray(reservations) && reservations.map((res) => (
        <div key={res._id} className="border p-4 mb-2 rounded shadow">
          {editingId === res._id ? (
            <div className="space-y-2">
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
              <input type="number" value={formData.partySize} onChange={(e) => setFormData({ ...formData, partySize: e.target.value })} />
              <button onClick={handleUpdate} className="bg-green-500 text-white px-3 py-1">Update</button>
            </div>
          ) : (
            <div>
              <p><strong>Date:</strong> {res.date}</p>
              <p><strong>Time:</strong> {res.timeSlot}</p>
              <p><strong>Party Size:</strong> {res.numberOfGuests}</p>
              <button onClick={() => handleEdit(res)} className="bg-yellow-500 text-white px-3 py-1 mr-2">Edit</button>
              <button onClick={() => handleDelete(res._id)} className="bg-red-500 text-white px-3 py-1">Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReservationList;