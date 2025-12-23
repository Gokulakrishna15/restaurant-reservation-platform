import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// ✅ Create review (user must be logged in)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { restaurant, rating, comment, photo } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!restaurant || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if restaurant exists
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Check if user already reviewed this restaurant
    const existingReview = await Review.findOne({
      user: userId,
      restaurant,
    });

    if (existingReview) {
      return res.status(409).json({ error: "You already reviewed this restaurant. Edit your existing review instead." });
    }

    // Create review
    const newReview = new Review({
      user: userId,
      restaurant,
      rating,
      comment,
      photo,
    });

    await newReview.save();
    await newReview.populate("user", "name email");

    // Update restaurant reviews array
    await Restaurant.findByIdAndUpdate(
      restaurant,
      { $push: { reviews: newReview._id } },
      { new: true }
    );

    res.status(201).json({
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
    const { rating, comment, photo } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized - can only edit your own reviews" });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (photo) review.photo = photo;

    await review.save();

    res.json({
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

    // Check ownership or admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Remove from restaurant's reviews array
    await Restaurant.findByIdAndUpdate(
      review.restaurant,
      { $pull: { reviews: review._id } },
      { new: true }
    );

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin responds to review
router.put("/:id/respond", verifyToken, isAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (!text) {
      return res.status(400).json({ error: "Response text is required" });
    }

    review.ownerResponse = {
      text,
      respondedAt: new Date(),
    };

    await review.save();

    res.json({
      message: "Response added successfully",
      data: review,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;