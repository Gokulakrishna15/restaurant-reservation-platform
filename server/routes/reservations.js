import express from 'express';
import {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservations
} from '../controllers/reservationController.js';

import verifyToken from '../middleware/verifyToken.js';
import Reservation from '../models/Reservation.js'; // ✅ Needed for /my route

const router = express.Router();

// ✅ Get all reservations (admin or filtered use)
router.get('/', verifyToken, getReservations);

// ✅ Get reservations for the logged-in user
router.get('/my', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ user: userId }).populate('restaurant');
    res.status(200).json(reservations);
  } catch (err) {
    console.error('Error fetching user reservations:', err);
    res.status(500).json({ message: 'Failed to fetch reservations' });
  }
});

// ✅ Create a new reservation
router.post('/', verifyToken, createReservation);

// ✅ Update a reservation
router.put('/:id', verifyToken, updateReservation);

// ✅ Delete a reservation
router.delete('/:id', verifyToken, deleteReservation);

export default router;