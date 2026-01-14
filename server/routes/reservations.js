import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import Reservation from "../models/Reservation.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// ✅ Create reservation (with CAPACITY-BASED availability check)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { restaurant, date, timeSlot, numberOfGuests, specialRequests } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!restaurant || !date || !timeSlot || !numberOfGuests) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Validate number of guests (max 20)
    const guests = parseInt(numberOfGuests);
    if (isNaN(guests) || guests < 1 || guests > 20) {
      return res.status(400).json({ 
        error: "Number of guests must be between 1 and 20" 
      });
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

    // ✅ NEW: Check capacity instead of blocking entirely
    const existingReservations = await Reservation.find({
      restaurant,
      date: new Date(date),
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    // Calculate total guests already booked
    const totalBookedGuests = existingReservations.reduce(
      (sum, res) => sum + res.numberOfGuests,
      0
    );

    // Check if adding this booking would exceed capacity
    const availableCapacity = restaurantDoc.totalSeatingCapacity - totalBookedGuests;

    if (guests > availableCapacity) {
      return res.status(409).json({ 
        error: `Not enough capacity. Only ${availableCapacity} seats available for this time slot.`,
        availableCapacity,
        requestedGuests: guests,
      });
    }

    // ✅ Calculate price based on number of guests (₹500 per person)
    const totalPrice = guests * 500;

    // Create reservation
    const newReservation = new Reservation({
      user: userId,
      restaurant,
      date: new Date(date),
      timeSlot,
      numberOfGuests: guests,
      specialRequests,
      status: "pending",
      paymentStatus: "unpaid",
      totalAmount: totalPrice,
    });

    await newReservation.save();
    await newReservation.populate("user restaurant");

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: newReservation,
      availableInfo: {
        totalCapacity: restaurantDoc.totalSeatingCapacity,
        remainingCapacity: availableCapacity - guests,
        reservationDuration: `${restaurantDoc.reservationDuration} minutes`,
      },
    });
  } catch (err) {
    console.error("Reservation creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Get availability for a specific time slot
router.get("/availability/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date, timeSlot } = req.query;

    if (!date || !timeSlot) {
      return res.status(400).json({ error: "Date and time slot required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const existingReservations = await Reservation.find({
      restaurant: restaurantId,
      date: new Date(date),
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });

    const totalBookedGuests = existingReservations.reduce(
      (sum, res) => sum + res.numberOfGuests,
      0
    );

    const availableCapacity = restaurant.totalSeatingCapacity - totalBookedGuests;

    res.json({
      success: true,
      availability: {
        totalCapacity: restaurant.totalSeatingCapacity,
        bookedSeats: totalBookedGuests,
        availableSeats: availableCapacity,
        totalTables: restaurant.totalTables,
        reservationDuration: restaurant.reservationDuration,
        activeReservations: existingReservations.length,
      },
    });
  } catch (err) {
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

    // ✅ Validate number of guests if being updated
    if (numberOfGuests) {
      const guests = parseInt(numberOfGuests);
      if (isNaN(guests) || guests < 1 || guests > 20) {
        return res.status(400).json({ 
          error: "Number of guests must be between 1 and 20" 
        });
      }
    }

    // ✅ Check new time slot availability if date or time changed
    if (date || timeSlot || numberOfGuests) {
      const newDate = date ? new Date(date) : reservation.date;
      const newTime = timeSlot || reservation.timeSlot;
      const newGuests = numberOfGuests ? parseInt(numberOfGuests) : reservation.numberOfGuests;

      // ✅ Prevent past time bookings
      const bookingDateTime = new Date(`${newDate.toISOString().split('T')[0]}T${newTime}`);
      const now = new Date();
      
      if (bookingDateTime < now) {
        return res.status(400).json({ 
          error: "Cannot update to a time that has already passed" 
        });
      }

      // Check capacity (excluding current reservation)
      const restaurant = await Restaurant.findById(reservation.restaurant);
      const existingReservations = await Reservation.find({
        _id: { $ne: reservationId },
        restaurant: reservation.restaurant,
        date: newDate,
        timeSlot: newTime,
        status: { $in: ["pending", "confirmed"] },
      });

      const totalBookedGuests = existingReservations.reduce(
        (sum, res) => sum + res.numberOfGuests,
        0
      );

      const availableCapacity = restaurant.totalSeatingCapacity - totalBookedGuests;

      if (newGuests > availableCapacity) {
        return res.status(409).json({ 
          error: `Not enough capacity. Only ${availableCapacity} seats available.`,
          availableCapacity,
        });
      }
    }

    // Update fields
    if (date) reservation.date = new Date(date);
    if (timeSlot) reservation.timeSlot = timeSlot;
    if (numberOfGuests) {
      reservation.numberOfGuests = parseInt(numberOfGuests);
      // ✅ Recalculate total amount
      reservation.totalAmount = reservation.numberOfGuests * 500;
    }
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

// ✅ Cancel reservation (prevent canceling completed reservations)
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

    // ✅ NEW: Prevent canceling completed reservations
    if (reservation.status === "completed") {
      return res.status(400).json({ 
        error: "Cannot cancel completed reservations. Please contact support if needed." 
      });
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