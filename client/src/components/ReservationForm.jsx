import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const ReservationForm = ({ restaurantId, onReservationSuccess }) => {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!restaurantId) {
      setError("⚠️ No restaurant selected. Please select a restaurant first.");
    }
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        navigate("/login");
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
      try {
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
      } catch (paymentErr) {
        console.error("Payment error:", paymentErr);
        setError("❌ Payment session failed. Reservation created but payment not processed.");
        setShowModal(false);
      }
    } catch (err) {
      console.error("Reservation Error:", err);
      setError(err.response?.data?.error || "❌ Something went wrong.");
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center font-mono p-6">
      <div className="w-full max-w-lg border-4 border-cyan-400 rounded-xl p-8 bg-black shadow-lg text-green-300 relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-700 px-8 py-3 rounded-full shadow-lg">
          <p className="text-white font-bold uppercase tracking-widest text-sm">
            ✨ Book Your Table ✨
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-around mb-6 mt-6 text-sm">
          <span className={step >= 1 ? "text-pink-400 font-bold" : "text-gray-600"}>📅 Date</span>
          <span className={step >= 2 ? "text-pink-400 font-bold" : "text-gray-600"}>👥 Guests</span>
          <span className={step >= 3 ? "text-pink-400 font-bold" : "text-gray-600"}>✅ Confirm</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1: Date & Time */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-cyan-300 mb-2 font-semibold">Select Date</label>
                <input
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-pink-400 bg-black text-green-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-2 font-semibold">Select Time</label>
                <input
                  type="time"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-pink-400 bg-black text-green-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.date || !formData.timeSlot}
                className="w-full bg-pink-500 text-white py-3 rounded font-bold disabled:opacity-50 hover:bg-pink-600 transition"
              >
                Next ➡️
              </button>
            </>
          )}

          {/* STEP 2: Guests & Special Requests */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-cyan-300 mb-2 font-semibold">Number of Guests</label>
                <input
                  type="number"
                  name="numberOfGuests"
                  min="1"
                  max="20"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-pink-400 bg-black text-green-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-2 font-semibold">Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any special requests, dietary needs, etc..."
                  className="w-full border-2 border-pink-400 bg-black text-green-300 p-3 rounded h-24 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex justify-between gap-4">
                <button 
                  type="button" 
                  onClick={prevStep} 
                  className="flex-1 bg-gray-600 text-white px-4 py-3 rounded font-bold hover:bg-gray-700 transition"
                >
                  ⬅️ Back
                </button>
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="flex-1 bg-pink-500 text-white px-4 py-3 rounded font-bold hover:bg-pink-600 transition"
                >
                  Next ➡️
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <>
              <div className="bg-purple-900 p-4 rounded border border-purple-500 text-sm text-yellow-300 space-y-2">
                <p><strong>📅 Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
                <p><strong>🕐 Time:</strong> {formData.timeSlot}</p>
                <p><strong>👥 Guests:</strong> {formData.numberOfGuests} person{formData.numberOfGuests > 1 ? 's' : ''}</p>
                {formData.specialRequests && (
                  <p><strong>📝 Special Requests:</strong> {formData.specialRequests}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-700 text-white py-3 rounded font-bold hover:from-pink-600 hover:to-purple-800 transition disabled:opacity-50"
              >
                {loading ? "⌛ Processing..." : "Reserve & Pay (₹500)"}
              </button>
              <button 
                type="button" 
                onClick={prevStep} 
                className="w-full bg-gray-600 text-white py-3 rounded font-bold hover:bg-gray-700 transition"
              >
                ⬅️ Back
              </button>
            </>
          )}
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-900 text-red-300 p-3 rounded border border-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-pink-500 to-purple-700 p-8 rounded-xl text-center text-white animate-pulse">
            <h2 className="text-2xl font-bold mb-4">🎉 Reservation Created!</h2>
            <p className="mb-2">Redirecting to secure payment...</p>
            <p className="text-sm text-yellow-300">🔒 Powered by Stripe</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;