import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  createReview,
  getReviewsByRestaurant,
  updateReview,
  deleteReview,
  respondToReview,
  getAllReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a new review (user must be logged in)
 * @access  Private
 */
router.post("/", verifyToken, createReview);

/**
 * @route   PUT /api/reviews/:id/respond
 * @desc    Restaurant owner/admin responds to a review
 * @access  Private/Admin
 */
router.put("/:id/respond", verifyToken, isAdmin, respondToReview);

/**
 * @route   GET /api/reviews/:restaurantId
 * @desc    Get all reviews for a specific restaurant (by ID or name)
 * @access  Public
 */
router.get("/:restaurantId", getReviewsByRestaurant);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review (only by the user who posted it)
 * @access  Private
 */
router.put("/:id", verifyToken, updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review (only by the user who posted it)
 * @access  Private
 */
router.delete("/:id", verifyToken, deleteReview);

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews (Admin moderation)
 * @access  Private/Admin
 */
router.get("/", verifyToken, isAdmin, getAllReviews);

export default router;
