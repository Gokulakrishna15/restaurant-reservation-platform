import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Reservation from "../models/Reservation.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);
const DOMAIN = process.env.FRONTEND_URL || "http://localhost:5173";

/**
 * @route   POST /api/payments/create-checkout-session
 * @desc    Create Stripe Checkout Session
 * @access  Private
 */
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { reservationId } = req.body;
    const reservation = await Reservation.findById(reservationId).populate("restaurant");
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    const pricePerGuest = 50000; // ₹500 per guest
    const totalAmount = pricePerGuest * reservation.numberOfGuests;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: `Reservation at ${reservation.restaurant.name}` },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${DOMAIN}/success?reservation=${reservationId}`,
      cancel_url: `${DOMAIN}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe session error:", err.stack);
    res.status(500).json({ error: "Stripe session failed", details: err.message });
  }
});

/**
 * @route   POST /api/payments/confirm-payment
 * @desc    Mark reservation as paid (frontend callback)
 * @access  Private
 */
router.post("/confirm-payment", async (req, res) => {
  try {
    const { reservationId } = req.body;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    reservation.paymentStatus = "paid";
    reservation.status = "confirmed";
    await reservation.save();

    res.status(200).json({ message: "Payment confirmed and reservation updated" });
  } catch (err) {
    console.error("❌ Payment confirmation error:", err.stack);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
});

export default router;