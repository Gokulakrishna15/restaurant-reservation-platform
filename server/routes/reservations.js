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

router.get("/", verifyToken, getReservations);
router.post("/", verifyToken, createReservation);
router.post("/create-checkout-session", verifyToken, createCheckoutSession);
router.put("/:id", verifyToken, updateReservation);
router.delete("/:id", verifyToken, deleteReservation);

export default router;
