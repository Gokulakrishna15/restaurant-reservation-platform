import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const ReservationForm = ({ restaurantId, onReservationSuccess }) => {
  const navigate = useNavigate();
  
  const now = new Date();
  const today = now.toISOString().split("T")[0];

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
  const [minTime, setMinTime] = useState("");
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // ✅ Update minimum time when date changes
  useEffect(() => {
    const currentNow = new Date();
    if (formData.date === today) {
      const minHour = currentNow.getHours() + 1;
      const minMinute = currentNow.getMinutes();
      setMinTime(`${String(minHour).padStart(2, '0')}:${String(minMinute).padStart(2, '0')}`);
    } else {
      setMinTime("00:00");
    }
  }, [formData.date, today]);

  useEffect(() => {
    if (!restaurantId) {
      setError("⚠️ No restaurant selected. Please select a restaurant first.");
    }
  }, [restaurantId]);

  // ✅ NEW: Check availability when date and time are selected
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.date || !formData.timeSlot || !restaurantId) return;

      setCheckingAvailability(true);
      try {
        const res = await axios.get(
          `/reservations/availability/${restaurantId}?date=${formData.date}&timeSlot=${formData.timeSlot}`
        );
        setAvailability(res.data.availability);
      } catch (err) {
        console.error("Availability check error:", err);
        setAvailability(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [formData.date, formData.timeSlot, restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.date || !formData.timeSlot) {
        setError("⚠️ Please select both date and time.");
        return;
      }
      
      if (formData.date === today && formData.timeSlot < minTime) {
        setError(`⚠️ Cannot book a time that has already passed. Please select a time after ${minTime}.`);
        return;
      }

      // ✅ Check if enough capacity
      if (availability && formData.numberOfGuests > availability.availableSeats) {
        setError(`⚠️ Not enough seats available. Only ${availability.availableSeats} seats left for this time.`);
        return;
      }
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, 3));
  };

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

    if (formData.date === today && formData.timeSlot < minTime) {
      setError("⚠️ Cannot book a time that has already passed.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

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
      const errorMsg = err.response?.data?.error || "❌ Something went wrong.";
      setError(errorMsg);
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
                <label className="block text-cyan-300 mb-2 font-semibold">
                  Select Time {formData.date === today && `(Earliest: ${minTime})`}
                </label>
                <input
                  type="time"
                  name="timeSlot"
                  min={formData.date === today ? minTime : "00:00"}
                  value={formData.timeSlot}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-pink-400 bg-black text-green-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {formData.date === today && (
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ For today's bookings, please select a time at least 1 hour from now
                  </p>
                )}
              </div>

              {/* ✅ NEW: Availability Info */}
              {formData.date && formData.timeSlot && (
                <div className="bg-purple-900 p-4 rounded border-2 border-cyan-400">
                  {checkingAvailability ? (
                    <p className="text-yellow-300 text-sm">⌛ Checking availability...</p>
                  ) : availability ? (
                    <div className="space-y-2 text-sm">
                      <h3 className="text-pink-400 font-bold">📊 Availability Info:</h3>
                      <p className="text-green-300">
                        ✅ <strong>{availability.availableSeats}</strong> seats available
                      </p>
                      <p className="text-cyan-300">
                        🪑 Total Capacity: <strong>{availability.totalCapacity}</strong> seats
                      </p>
                      <p className="text-yellow-300">
                        👥 Already Booked: <strong>{availability.bookedSeats}</strong> seats ({availability.activeReservations} reservations)
                      </p>
                      <p className="text-pink-300">
                        ⏰ Table Duration: <strong>{availability.reservationDuration} minutes</strong>
                      </p>
                      {availability.availableSeats === 0 && (
                        <p className="text-red-400 font-bold mt-2">
                          ❌ FULLY BOOKED - Please choose a different time
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Select date and time to check availability</p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.date || !formData.timeSlot || (availability && availability.availableSeats === 0)}
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
                  max={availability ? Math.min(20, availability.availableSeats) : 20}
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-pink-400 bg-black text-green-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Maximum: {availability ? Math.min(20, availability.availableSeats) : 20} guests 
                  {availability && ` (${availability.availableSeats} seats available)`}
                </p>
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
                <h3 className="text-pink-400 font-bold text-lg mb-3">📋 Reservation Summary</h3>
                <p><strong>📅 Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
                <p><strong>🕐 Time:</strong> {formData.timeSlot}</p>
                <p><strong>👥 Guests:</strong> {formData.numberOfGuests} person{formData.numberOfGuests > 1 ? 's' : ''}</p>
                <p><strong>💰 Total Amount:</strong> ₹{formData.numberOfGuests * 500} (₹500 per person)</p>
                {availability && (
                  <p><strong>⏰ Table Reserved For:</strong> {availability.reservationDuration} minutes ({availability.reservationDuration / 60} hours)</p>
                )}
                {formData.specialRequests && (
                  <p><strong>📝 Special Requests:</strong> {formData.specialRequests}</p>
                )}
              </div>

              {/* ✅ Important Notice */}
              <div className="bg-cyan-900 p-3 rounded border-2 border-cyan-400 text-xs text-cyan-200">
                <p className="font-bold mb-2">⚠️ Important Information:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your table is reserved for {availability?.reservationDuration || 120} minutes</li>
                  <li>Payment is ₹500 per person</li>
                  <li>Completed reservations cannot be cancelled</li>
                  <li>Please arrive on time to honor your reservation</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-700 text-white py-3 rounded font-bold hover:from-pink-600 hover:to-purple-800 transition disabled:opacity-50"
              >
                {loading ? "⌛ Processing..." : `Reserve & Pay (₹${formData.numberOfGuests * 500})`}
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
          <div className="mt-4 bg-red-900 text-red-300 p-3 rounded border border-red-400 text-sm animate-pulse">
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