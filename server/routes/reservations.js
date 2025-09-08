import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  createReservation,
  getUserReservations,
  cancelReservation
} from '../controllers/reservationController.js';

const router = express.Router();

router.post('/', verifyToken, createReservation);
router.get('/', verifyToken, getUserReservations);
router.put('/:id/cancel', verifyToken, cancelReservation);

export default router;