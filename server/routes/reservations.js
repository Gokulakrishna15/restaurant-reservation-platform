import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import Reservation from "../models/Reservation.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// ✅ Create reservation (with availability check)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { restaurant, date, timeSlot, numberOfGuests, specialRequests } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!restaurant || !date || !timeSlot || !numberOfGuests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if restaurant exists
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // ✅ Check availability (prevent double bookings)
    const existingReservation = await Reservation.findOne({
      restaurant,
      date: new Date(date),
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingReservation) {
      return res.status(409).json({ error: "This time slot is already booked" });
    }

    // Create reservation
    const newReservation = new Reservation({
      user: userId,
      restaurant,
      date: new Date(date),
      timeSlot,
      numberOfGuests,
      specialRequests,
      status: "pending",
    });

    await newReservation.save();
    await newReservation.populate("user restaurant");

    res.status(201).json({
      message: "Reservation created successfully",
      data: newReservation,
    });
  } catch (err) {
    console.error("Reservation creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get user's reservations
router.get("/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const reservations = await Reservation.find({ user: userId })
      .populate("restaurant")
      .sort({ date: -1 });

    res.json({
      success: true,
      data: reservations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all reservations (admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user")
      .populate("restaurant")
      .sort({ date: -1 });

    res.json({
      success: true,
      data: reservations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get reservation by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user")
      .populate("restaurant");

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({ success: true, data: reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update reservation
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { date, timeSlot, numberOfGuests, specialRequests } = req.body;
    const reservationId = req.params.id;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Check if user owns this reservation
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Check new time slot availability if changed
    if (date && timeSlot) {
      const conflict = await Reservation.findOne({
        _id: { $ne: reservationId },
        restaurant: reservation.restaurant,
        date: new Date(date),
        timeSlot,
        status: { $ne: "cancelled" },
      });

      if (conflict) {
        return res.status(409).json({ error: "New time slot is already booked" });
      }
    }

    // Update fields
    if (date) reservation.date = new Date(date);
    if (timeSlot) reservation.timeSlot = timeSlot;
    if (numberOfGuests) reservation.numberOfGuests = numberOfGuests;
    if (specialRequests !== undefined) reservation.specialRequests = specialRequests;

    await reservation.save();
    await reservation.populate("user restaurant");

    res.json({
      message: "Reservation updated successfully",
      data: reservation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Cancel reservation
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Check if user owns this reservation or is admin
    if (reservation.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    reservation.status = "cancelled";
    reservation.cancellationReason = req.body.reason || "User cancelled";
    await reservation.save();

    res.json({
      message: "Reservation cancelled successfully",
      data: reservation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;