import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import Reservation from "../models/Reservation.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// ✅ Create reservation (with STRICT availability check)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { restaurant, date, timeSlot, numberOfGuests, specialRequests } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!restaurant || !date || !timeSlot || !numberOfGuests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Prevent past time bookings
    const bookingDateTime = new Date(`${date}T${timeSlot}`);
    const now = new Date();
    
    if (bookingDateTime < now) {
      return res.status(400).json({ 
        error: "Cannot book a time that has already passed" 
      });
    }

    // Check if restaurant exists
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // ✅ CRITICAL: Check for existing reservations at same time
    const existingReservation = await Reservation.findOne({
      restaurant,
      date: new Date(date),
      timeSlot,
      status: { $in: ["pending", "confirmed"] }, // ✅ Check both pending and confirmed
    });

    if (existingReservation) {
      return res.status(409).json({ 
        error: "This time slot is already booked. Please choose a different time." 
      });
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
      paymentStatus: "unpaid",
    });

    await newReservation.save();
    await newReservation.populate("user restaurant");

    res.status(201).json({
      success: true,
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

// ✅ Update reservation (with conflict checking)
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

    // ✅ Check new time slot availability if date or time changed
    if (date || timeSlot) {
      const newDate = date ? new Date(date) : reservation.date;
      const newTime = timeSlot || reservation.timeSlot;

      // ✅ Prevent past time bookings
      const bookingDateTime = new Date(`${newDate.toISOString().split('T')[0]}T${newTime}`);
      const now = new Date();
      
      if (bookingDateTime < now) {
        return res.status(400).json({ 
          error: "Cannot update to a time that has already passed" 
        });
      }

      const conflict = await Reservation.findOne({
        _id: { $ne: reservationId },
        restaurant: reservation.restaurant,
        date: newDate,
        timeSlot: newTime,
        status: { $in: ["pending", "confirmed"] },
      });

      if (conflict) {
        return res.status(409).json({ 
          error: "New time slot is already booked. Please choose a different time." 
        });
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
      success: true,
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
      success: true,
      message: "Reservation cancelled successfully",
      data: reservation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;