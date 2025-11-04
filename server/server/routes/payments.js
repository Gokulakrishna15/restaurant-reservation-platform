import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);
const DOMAIN = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { reservationId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: 'Restaurant Reservation' },
          unit_amount: 50000
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${DOMAIN}/success?reservation=${reservationId}`,
      cancel_url: `${DOMAIN}/cancel`
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err.message);
    res.status(500).json({ error: 'Stripe session failed', details: err.message });
  }
});

export default router;