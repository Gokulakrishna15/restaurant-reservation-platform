import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      const reservationId = new URLSearchParams(window.location.search).get("reservation");
      if (reservationId) {
        try {
          await axios.post(
            "/payments/confirm-payment",
            { reservationId },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          setConfirmed(true);
        } catch (err) {
          console.error("❌ Payment confirmation failed:", err);
          setError("Failed to confirm payment. Please contact support.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("No reservation ID found.");
        setLoading(false);
      }
    };
    confirmPayment();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-green-100 border border-green-400 rounded text-center">
      {loading ? (
        <p className="text-gray-600">Confirming your payment...</p>
      ) : error ? (
        <>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Payment Error ❌</h2>
          <p className="text-gray-700">{error}</p>
        </>
      ) : confirmed ? (
        <>
          <h2 className="text-2xl font-bold text-green-700 mb-4">Payment Successful 🎉</h2>
          <p className="text-gray-700">Your reservation has been confirmed. Thank you!</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </>
      ) : null}
    </div>
  );
};

export default PaymentSuccess;