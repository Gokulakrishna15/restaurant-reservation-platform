import express from 'express';
import {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservations
} from '../controllers/reservationController.js';

import verifyToken from '../middleware/verifyToken.js'; // ✅ Corrected import

const router = express.Router();

// ✅ All routes protected by verifyToken
router.get('/', verifyToken, getReservations);
router.post('/', verifyToken, createReservation);
router.put('/:id', verifyToken, updateReservation);
router.delete('/:id', verifyToken, deleteReservation);

export default router;