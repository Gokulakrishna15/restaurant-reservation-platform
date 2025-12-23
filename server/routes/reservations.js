import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  createCheckoutSession,
} from "../controllers/reservationController.js";

const router = express.Router();

// ✅ Get user's reservations - works with both /reservations and /reservations/my
router.get("/", verifyToken, getReservations);
router.get("/my", verifyToken, getReservations); // ✅ Added for frontend compatibility

// Create new reservation
router.post("/", verifyToken, createReservation);

// Stripe checkout session
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// Update reservation
router.put("/:id", verifyToken, updateReservation);

// Delete reservation
router.delete("/:id", verifyToken, deleteReservation);

export default router;