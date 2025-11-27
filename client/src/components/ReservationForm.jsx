import React, { useState, useEffect } from "react";
import axios from "../services/api";

const ReservationForm = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [reservationId, setReservationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    restaurant: "",
    date: "",
    timeSlot: "",
    numberOfGuests: "",
    specialRequests: ""
  });

  // ✅ Fetch restaurants on mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error("❌ Error loading restaurants:", err);
        alert("Failed to load restaurants. Please refresh.");
      }
    };
    fetchRestaurants();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit reservation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "/reservations",
        {
          restaurant: formData.restaurant,
          date: formData.date,
          timeSlot: formData.timeSlot,
          numberOfGuests: formData.numberOfGuests,
          specialRequests: formData.specialRequests
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const restaurantName = restaurants.find(
        (r) => r._id === formData.restaurant
      )?.name;

      alert(`✅ Reservation confirmed at ${restaurantName}!`);

      setReservationId(res.data._id);
      setFormData({
        restaurant: "",
        date: "",
        timeSlot: "",
        numberOfGuests: "",
        specialRequests: ""
      });
    } catch (error) {
      if (error.response?.status === 409) {
        alert("⚠️ Slot already booked. Choose another.");
      } else {
        console.error("❌ Reservation error:", error.response?.data || error.message);
        alert("❌ Reservation failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle payment
  const handlePayment = async () => {
    if (!reservationId) {
      alert("⚠️ Please submit your reservation first.");
      return;
    }
    try {
      const res = await axios.post(
        "/payments/create-checkout-session",
        { reservationId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error("❌ Payment error:", err.response?.data || err.message);
      alert("❌ Payment failed. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-xl font-bold mb-4">Make a Reservation</h2>

      {/* Restaurant Dropdown */}
      <label className="block mb-2">Restaurant</label>
      <select
        name="restaurant"
        value={formData.restaurant}
        onChange={handleChange}
        required
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select a restaurant</option>
        {restaurants.map((r) => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </select>

      {formData.restaurant && (
        <div className="mb-4 text-sm text-gray-600">
          Selected: {restaurants.find((r) => r._id === formData.restaurant)?.name}
        </div>
      )}

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          name="timeSlot"
          value={formData.timeSlot}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Guests */}
      <input
        type="number"
        name="numberOfGuests"
        value={formData.numberOfGuests}
        onChange={handleChange}
        required
        placeholder="Number of Guests"
        className="w-full mt-4 p-2 border rounded"
      />

      {/* Special Requests */}
      <textarea
        name="specialRequests"
        value={formData.specialRequests}
        onChange={handleChange}
        placeholder="Special Requests"
        className="w-full mt-2 p-2 border rounded"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Reservation"}
      </button>

      {/* Payment Button */}
      <button
        type="button"
        onClick={handlePayment}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-2"
      >
        Pay ₹500 to Confirm
      </button>
    </form>
  );
};

export default ReservationForm;