import Reservation from '../models/Reservation.js';

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.userId }).populate('restaurant user');
    res.json(reservations); // ✅ Only return current user's reservations
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
};

export const createReservation = async (req, res) => {
  const { restaurant, date, timeSlot, numberOfGuests, specialRequests } = req.body;

  try {
    const existing = await Reservation.findOne({ restaurant, date, timeSlot });
    if (existing) {
      return res.status(409).json({ message: 'Slot already booked' });
    }

    const reservation = new Reservation({
      user: req.userId, // ✅ Link to logged-in user
      restaurant,
      date,
      timeSlot,
      numberOfGuests,
      specialRequests
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    console.error('❌ Reservation error:', err.message);
    res.status(500).json({ message: 'Failed to create reservation' });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('❌ Update error:', err.message);
    res.status(500).json({ message: 'Failed to update reservation' });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    console.error('❌ Delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete reservation' });
  }
};