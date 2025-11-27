import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  createReview,
  getReviewsByRestaurant,
  updateReview,
  deleteReview,
  respondToReview
} from '../controllers/reviewController.js';

const router = express.Router();

// ✅ Create a new review (user must be logged in)
router.post('/', verifyToken, createReview);

// ✅ Get all reviews for a specific restaurant (by name or ID)
router.get('/:restaurantName', getReviewsByRestaurant);

// ✅ Update a review (only by the user who posted it)
router.put('/:id', verifyToken, updateReview);

// ✅ Delete a review (only by the user who posted it)
router.delete('/:id', verifyToken, deleteReview);

// ✅ Restaurant owner responds to a review
router.put('/:id/respond', verifyToken, respondToReview);

export default router;