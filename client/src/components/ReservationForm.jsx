import React, { useState } from 'react';
import axios from 'axios';
import { createReservation } from '../services/api';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    user: '',
    restaurant: '',
    date: '',
    timeSlot: '',
    numberOfGuests: '',
    specialRequests: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReservation(formData);
      alert('Reservation confirmed!');
      setFormData({
        user: '',
        restaurant: '',
        date: '',
        timeSlot: '',
        numberOfGuests: '',
        specialRequests: '',
      });
    } catch (error) {
      if (error.response?.status === 409) {
        alert('This slot is already booked. Please choose another.');
      } else {
        console.error('Error submitting reservation:', error);
        alert('Reservation failed. Try again.');
      }
    }
  };

  const handlePayment = async () => {
    try {
      const res = await axios.post('/api/payments/create-checkout-session');
      window.location.href = res.data.url;
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Make a Reservation</h2>
      {['user', 'restaurant', 'date', 'timeSlot', 'numberOfGuests', 'specialRequests'].map((field) => (
        <input
          key={field}
          type={field === 'numberOfGuests' ? 'number' : 'text'}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="w-full mb-2 p-2 border rounded"
          required={field !== 'specialRequests'}
        />
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
      <button type="button" onClick={handlePayment} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-2">
        Pay ₹500 to Confirm
      </button>
    </form>
  );
};

export default ReservationForm;