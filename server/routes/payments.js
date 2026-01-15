import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import Reservation from "../models/Reservation.js";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

console.log("✅ Stripe initialized with key:", process.env.STRIPE_SECRET ? "Key found" : "❌ Key missing");

// ✅ Create Stripe checkout session with DYNAMIC PRICING
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

    // ✅ FIXED: Calculate dynamic price based on number of guests
    const pricePerGuest = 500; // ₹500 per person
    const totalGuests = reservation.numberOfGuests;
    const totalAmount = pricePerGuest * totalGuests;
    const amountInPaise = totalAmount * 100; // Convert to paise for Stripe

    console.log(`💰 Payment Calculation:
      - Guests: ${totalGuests}
      - Price per guest: ₹${pricePerGuest}
      - Total: ₹${totalAmount}
      - Stripe amount (paise): ${amountInPaise}
    `);

    // Ensure frontend URL is set
    const frontendUrl = process.env.FRONTEND_URL || "https://eclectic-cucurucho-a9fcf2.netlify.app";

    // ✅ FIXED: Dynamic pricing in Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Reservation at ${reservation.restaurant.name}`,
              description: `${totalGuests} guest${totalGuests > 1 ? 's' : ''} on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.timeSlot}`,
            },
            unit_amount: amountInPaise, // ✅ FIXED: Dynamic amount based on guests
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendUrl}/payment-success?reservation=${reservationId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment-cancel`,
      metadata: {
        reservationId: reservationId.toString(),
        numberOfGuests: totalGuests.toString(),
        totalAmount: totalAmount.toString(),
      },
    });

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      amount: totalAmount,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ENHANCED: Better webhook signature validation
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // ✅ ADDED: Check if webhook secret exists
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle the event
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservationId = session.metadata.reservationId;

      const reservation = await Reservation.findByIdAndUpdate(
        reservationId,
        {
          paymentStatus: "paid",
          status: "confirmed",
          totalAmount: parseInt(session.metadata.totalAmount), // ✅ Ensure amount is saved
        },
        { new: true }
      );

      if (reservation) {
        console.log(`✅ Payment confirmed for reservation ${reservationId}`);
        console.log(`   Amount paid: ₹${session.metadata.totalAmount}`);
        console.log(`   Guests: ${session.metadata.numberOfGuests}`);
      } else {
        console.error(`❌ Reservation ${reservationId} not found`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    res.status(500).json({ error: "Webhook processing failed" });
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