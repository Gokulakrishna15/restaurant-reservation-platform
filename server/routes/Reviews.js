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

// ✅ Create a review
router.post('/', verifyToken, createReview);

// ✅ Get all reviews for a restaurant
router.get('/:restaurantName', getReviewsByRestaurant);

// ✅ Update a review
router.put('/:id', verifyToken, updateReview);

// ✅ Delete a review
router.delete('/:id', verifyToken, deleteReview);

// ✅ Owner response to a review
router.put('/:id/respond', verifyToken, respondToReview);

export default router;