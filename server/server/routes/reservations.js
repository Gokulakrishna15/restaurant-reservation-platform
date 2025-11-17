import express from 'express';
import {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservations
} from '../controllers/reservationController.js';

import { verifyToken } from '../middleware/verifyToken.js'; // ✅ Import middleware

const router = express.Router();

// ✅ Protect all routes with verifyToken
router.get('/', verifyToken, getReservations);
router.post('/', verifyToken, createReservation);
router.put('/:id', verifyToken, updateReservation);
router.delete('/:id', verifyToken, deleteReservation);

export default router;