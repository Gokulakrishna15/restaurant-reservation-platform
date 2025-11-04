import React, { useState, useEffect } from 'react';
import axios from '../services/api';

const ReservationForm = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [reservationId, setReservationId] = useState(null);
  const [formData, setFormData] = useState({
    restaurant: '',
    date: '',
    timeSlot: '',
    numberOfGuests: '',
    specialRequests: ''
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('/restaurants');
        setRestaurants(res.data);
      } catch (err) {
        console.error('Error loading restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/reservations', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('✅ Reservation confirmed!');
      setReservationId(res.data._id); // ✅ Store reservation ID
      setFormData({
        restaurant: '',
        date: '',
        timeSlot: '',
        numberOfGuests: '',
        specialRequests: ''
      });
    } catch (error) {
      if (error.response?.status === 409) {
        alert('⚠️ Slot already booked. Choose another.');
      } else {
        console.error('Reservation error:', error);
        alert('❌ Reservation failed. Try again.');
      }
    }
  };

  const handlePayment = async () => {
    if (!reservationId) {
      alert('⚠️ Please submit your reservation first.');
      return;
    }
    try {
      const res = await axios.post('/payments/create-checkout-session', {
        reservationId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Payment error:', err);
      alert('❌ Payment failed. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Make a Reservation</h2>

      <label className="block mb-2">Restaurant</label>
      <select
        name="restaurant"
        value={formData.restaurant}
        onChange={handleChange}
        required
        className="w-full mb-4 p-2 border"
      >
        <option value="">Select a restaurant</option>
        {restaurants.map((r) => (
          <option key={r._id} value={r._id}>{r.name}</option>
        ))}
      </select>

      <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full mb-2 p-2 border rounded" />
      <input type="time" name="timeSlot" value={formData.timeSlot} onChange={handleChange} required className="w-full mb-2 p-2 border rounded" />
      <input type="number" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} required className="w-full mb-2 p-2 border rounded" />
      <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} placeholder="Special Requests" className="w-full mb-2 p-2 border rounded" />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
      <button type="button" onClick={handlePayment} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-2">Pay ₹500 to Confirm</button>
    </form>
  );
};

export default ReservationForm;