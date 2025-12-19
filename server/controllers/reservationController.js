import Reservation from "../models/Reservation.js";
import Restaurant from "../models/Restaurant.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * GET: Current user's reservations
 */
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("restaurant")
      .populate("user", "name email");

    res.status(200).json({ success: true, data: reservations });
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch reservations" });
  }
};

/**
 * POST: Create a reservation
 */
export const createReservation = async (req, res) => {
  const { restaurant, date, timeSlot, numberOfGuests, specialRequests } = req.body;

  if (!restaurant || !date || !timeSlot || !numberOfGuests) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  if (numberOfGuests <= 0) {
    return res.status(400).json({ success: false, error: "Number of guests must be at least 1" });
  }

  try {
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({ success: false, error: "Restaurant not found" });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      restaurant,
      date: new Date(date),
      timeSlot,
      numberOfGuests,
      specialRequests,
      status: "confirmed",
      paymentStatus: "unpaid",
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    console.error("❌ Reservation error:", err.message);
    res.status(500).json({ success: false, error: "Failed to create reservation" });
  }
};

/**
 * PUT: Update a reservation
 */
export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, error: "Reservation not found" });

    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to update this reservation" });
    }

    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ success: false, error: "Failed to update reservation" });
  }
};

/**
 * DELETE: Cancel a reservation
 */
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, error: "Reservation not found" });

    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to delete this reservation" });
    }

    await reservation.deleteOne();
    res.status(200).json({ success: true, message: "Reservation cancelled" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ success: false, error: "Failed to delete reservation" });
  }
};

/**
 * POST: Create Stripe checkout session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId).populate("restaurant");
    if (!reservation) {
      return res.status(404).json({ success: false, error: "Reservation not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Reservation at ${reservation.restaurant.name}`,
            },
            unit_amount: 5000, // example: $50 flat fee
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(500).json({ success: false, error: "Failed to create checkout session" });
  }
};