import React, { useEffect } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      const reservationId = new URLSearchParams(window.location.search).get('reservation');
      if (reservationId) {
        try {
          await axios.post('/payments/confirm-payment', { reservationId });
          alert('✅ Payment confirmed and reservation updated!');
        } catch (err) {
          console.error('Payment confirmation failed:', err);
          alert('❌ Failed to confirm payment.');
        }
      }
    };
    confirmPayment();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-green-100 border border-green-400 rounded text-center">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Payment Successful 🎉</h2>
      <p className="text-gray-700">Your reservation has been confirmed. Thank you!</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;