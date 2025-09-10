import express from 'express';
import {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservations // ✅ Add this
} from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', getReservations); // ✅ Add this route
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

export default router;