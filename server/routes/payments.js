import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import Reservation from "../models/Reservation.js";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

console.log("✅ Stripe initialized with key:", process.env.STRIPE_SECRET ? "Key found" : "❌ Key missing");

// ✅ Create Stripe checkout session
router.post("/create-checkout-session", verifyToken, async (req, res) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "Reservation ID required" });
    }

    const reservation = await Reservation.findById(reservationId).populate("restaurant user");

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Ensure frontend URL is set
    const frontendUrl = process.env.FRONTEND_URL || "https://eclectic-cucurucho-a9fcf2.netlify.app";

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Reservation at ${reservation.restaurant.name}`,
              description: `${reservation.numberOfGuests} guests on ${new Date(reservation.date).toLocaleDateString()}`,
            },
            unit_amount: 50000, // ₹500 (in paise)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendUrl}/payment-success?reservation=${reservationId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment-cancel`,
      metadata: {
        reservationId: reservationId.toString(),
      },
    });

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Webhook to handle payment success
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservationId = session.metadata.reservationId;

      await Reservation.findByIdAndUpdate(reservationId, {
        paymentStatus: "paid",
        status: "confirmed",
      });

      console.log(`✅ Payment confirmed for reservation ${reservationId}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// ✅ Manual payment confirmation endpoint
router.post("/confirm-payment", verifyToken, async (req, res) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ error: "Reservation ID required" });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { paymentStatus: "paid", status: "confirmed" },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.json({
      success: true,
      message: "Payment confirmed",
      reservation,
    });
  } catch (err) {
    console.error("Confirm payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;