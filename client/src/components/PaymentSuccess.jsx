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
      // ✅ FIXED: Now correctly gets 'reservation' parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const reservationId = urlParams.get("reservation");

      if (!reservationId) {
        setError("No reservation ID found.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Please log in to confirm your reservation.");
          setLoading(false);
          return;
        }

        await axios.post(
          "/payments/confirm-payment",
          { reservationId },
          { 
            headers: { 
              Authorization: `Bearer ${token}` 
            } 
          }
        );
        
        setConfirmed(true);
        console.log("✅ Payment confirmed for reservation:", reservationId);
      } catch (err) {
        console.error("❌ Payment confirmation failed:", err);
        setError(
          err.response?.data?.error || 
          "Failed to confirm payment. Please contact support."
        );
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        {loading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
            <p className="text-gray-600 text-lg">Confirming your payment...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="text-red-600 text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-red-700">Payment Error</h2>
            <p className="text-gray-700">{error}</p>
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Home
              </button>
              <button
                onClick={() => navigate("/restaurants")}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : confirmed ? (
          <div className="space-y-4">
            <div className="text-green-600 text-6xl">🎉</div>
            <h2 className="text-3xl font-bold text-green-700">Payment Successful!</h2>
            <p className="text-gray-700 text-lg">
              Your reservation has been confirmed. Thank you for choosing us!
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
            <button
              onClick={() => navigate("/my-reservations")}
              className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              View My Reservations
            </button>
            <button
              onClick={() => navigate("/")}
              className="mt-2 text-blue-600 hover:text-blue-800 transition block w-full"
            >
              Back to Home
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentSuccess;