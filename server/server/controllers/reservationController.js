import Reservation from '../models/Reservation.js';

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('restaurant user');
    res.json(reservations); // ✅ Always return an array
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
};

export const createReservation = async (req, res) => {
  const { restaurant, date, timeSlot } = req.body;

  const existing = await Reservation.findOne({ restaurant, date, timeSlot });
  if (existing) {
    return res.status(409).json({ message: 'Slot already booked' });
  }

  const reservation = new Reservation(req.body);
  await reservation.save();
  res.status(201).json(reservation);
};

export const updateReservation = async (req, res) => {
  const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteReservation = async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  res.json({ message: 'Reservation deleted' });
};