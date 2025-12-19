import React, { useState, useEffect } from "react";
import axios from "../services/api";

const ReservationForm = ({ restaurantId, onReservationSuccess }) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    timeSlot: "",
    numberOfGuests: 1,
    specialRequests: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // ✅ Check if restaurantId is valid
  useEffect(() => {
    if (!restaurantId) {
      setError("⚠️ No restaurant selected. Please select a restaurant first.");
    }
  }, [restaurantId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!restaurantId) {
      setError("⚠️ Cannot submit reservation: restaurant not selected.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("⚠️ You must be logged in to make a reservation.");
        setLoading(false);
        return;
      }

      console.log("Submitting reservation:", { restaurantId, ...formData });

      // Create Reservation
      const res = await axios.post(
        "/reservations",
        { restaurant: restaurantId, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reservation = res.data?.data || res.data;

      if (onReservationSuccess) {
        onReservationSuccess(reservation);
      }

      setShowModal(true);

      // Create Stripe Checkout Session
      const paymentRes = await axios.post(
        "/payments/create-checkout-session",
        { reservationId: reservation._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentRes.data?.url) {
        window.location.href = paymentRes.data.url;
      } else {
        setError("❌ Payment session could not be created.");
        setShowModal(false);
      }
    } catch (err) {
      if (err.response) {
        console.error("Reservation Error:", err.response.data);
        setError(err.response.data?.error || "❌ Server error occurred.");
      } else if (err.request) {
        console.error("Reservation Error: No response received", err.request);
        setError("❌ No response from server. Please try again.");
      } else {
        console.error("Reservation Error:", err.message);
        setError("❌ Something went wrong.");
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center font-mono p-6 relative overflow-hidden">
      {/* Neon background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,150,0.2),transparent)] animate-pulse"></div>

      <div className="w-full max-w-lg border-4 border-cyan-400 rounded-xl p-8 bg-black shadow-lg text-green-300 relative z-10">
        {/* Hero Banner */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-700 px-8 py-3 rounded-full shadow-lg">
          <p className="text-white font-bold uppercase tracking-widest">
            ✨ Book Your Table ✨
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-around mb-6 mt-6">
          <span className={step >= 1 ? "text-pink-400" : "text-gray-600"}>📅 Date</span>
          <span className={step >= 2 ? "text-pink-400" : "text-gray-600"}>👥 Guests</span>
          <span className={step >= 3 ? "text-pink-400" : "text-gray-600"}>✅ Confirm</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border-2 border-pink-400 bg-black p-2 rounded"
              />
              <input
                type="time"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                required
                className="w-full border-2 border-pink-400 bg-black p-2 rounded"
              />
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.date || !formData.timeSlot}
                className="w-full bg-pink-500 text-white py-2 rounded disabled:opacity-50"
              >
                Next ➡️
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <input
                type="number"
                name="numberOfGuests"
                min="1"
                value={formData.numberOfGuests}
                onChange={handleChange}
                required
                className="w-full border-2 border-pink-400 bg-black p-2 rounded"
              />
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Special requests..."
                className="w-full border-2 border-pink-400 bg-black p-2 rounded"
              />
              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="bg-gray-600 px-4 py-2 rounded">
                  ⬅️ Back
                </button>
                <button type="button" onClick={nextStep} className="bg-pink-500 px-4 py-2 rounded">
                  Next ➡️
                </button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-700 py-3 rounded font-bold disabled:opacity-50"
              >
                {loading ? "⌛ Booking..." : "Reserve & Pay"}
              </button>
              <button type="button" onClick={prevStep} className="w-full bg-gray-600 py-2 rounded mt-3">
                ⬅️ Back
              </button>
            </>
          )}
        </form>

        {/* Error Feedback */}
        {error && (
          <div className="mt-4 bg-red-900 text-red-300 p-3 rounded">
            ❌ {error}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-pink-500 to-purple-700 p-8 rounded-xl text-center text-white animate-pulse">
            <h2 className="text-2xl font-bold mb-4">🎉 Reservation Confirmed!</h2>
            <p>Redirecting to payment...</p>
            <p className="text-sm text-yellow-300 mt-2">🔒 Secure Stripe Checkout</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;