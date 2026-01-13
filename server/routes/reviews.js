import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";
import Reservation from "../models/Reservation.js";

const router = express.Router();

// ✅ Helper function to recalculate restaurant rating
const updateRestaurantRating = async (restaurantId) => {
  const allReviews = await Review.find({ restaurant: restaurantId });
  
  if (allReviews.length === 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: 0,
      totalReviews: 0,
    });
    return;
  }

  // ✅ FIXED: Proper average calculation
  const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = totalRating / allReviews.length;
  
  console.log(`📊 Rating Update for ${restaurantId}:`);
  console.log(`   Total reviews: ${allReviews.length}`);
  console.log(`   Sum of ratings: ${totalRating}`);
  console.log(`   Average: ${avgRating.toFixed(2)}`);
  
  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
    totalReviews: allReviews.length,
  });
};

// ✅ Create review (ONLY if user has a confirmed reservation)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { restaurant, rating, comment, photos } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!restaurant || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // ✅ Check if user has a confirmed/completed reservation at this restaurant
    const hasReservation = await Reservation.findOne({
      user: userId,
      restaurant,
      status: { $in: ["confirmed", "completed"] },
    });

    if (!hasReservation) {
      return res.status(403).json({ 
        error: "You can only review restaurants where you have a confirmed reservation" 
      });
    }

    // Check if restaurant exists
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Check if user already reviewed this restaurant
    const existingReview = await Review.findOne({ user: userId, restaurant });
    if (existingReview) {
      return res.status(409).json({ 
        error: "You already reviewed this restaurant. Edit your existing review instead." 
      });
    }

    // Create review
    const newReview = new Review({
      user: userId,
      restaurant,
      rating,
      comment,
      photos: photos || [],
    });

    await newReview.save();
    await newReview.populate("user", "name email");

    // ✅ FIXED: Update restaurant rating with correct calculation
    await updateRestaurantRating(restaurant);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });
  } catch (err) {
    console.error("Review creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get reviews for a restaurant
router.get("/restaurant/:id", async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all reviews (admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update review (user can only update own)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized - can only edit your own reviews" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (photos) review.photos = photos;

    await review.save();

    // ✅ FIXED: Update restaurant rating with correct calculation
    await updateRestaurantRating(review.restaurant);

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete review (user can delete own, admin can delete any)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const restaurantId = review.restaurant;
    await Review.findByIdAndDelete(req.params.id);

    // ✅ FIXED: Update restaurant rating with correct calculation
    await updateRestaurantRating(restaurantId);

    res.json({ 
      success: true,
      message: "Review deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;