import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";

// ✅ Create a review
export const createReview = async (req, res) => {
  try {
    const newReview = new Review({
      user: req.user._id,
      restaurant: req.body.restaurant,
      comment: req.body.comment,
      rating: req.body.rating,
      photo: req.body.photo || "",
    });

    const savedReview = await newReview.save();
    res.status(201).json({ success: true, data: savedReview });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to create review",
      details: err.message,
    });
  }
};

// ✅ Get all reviews (admin only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("restaurant", "name");

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch all reviews",
      details: err.message,
    });
  }
};

// ✅ Get reviews by restaurant name
export const getReviewsByRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      name: req.params.restaurantName,
    });
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, error: "Restaurant not found" });
    }

    const reviews = await Review.find({ restaurant: restaurant._id })
      .populate("user", "name")
      .populate("restaurant", "name");

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
      details: err.message,
    });
  }
};

// ✅ Update a review (only owner can update)
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this review",
      });
    }

    review.comment = req.body.comment || review.comment;
    review.rating = req.body.rating || review.rating;
    const updated = await review.save();

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to update review",
      details: err.message,
    });
  }
};

// ✅ Delete a review (only owner can delete)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this review",
      });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to delete review",
      details: err.message,
    });
  }
};

// ✅ Owner response to a review (admin/restaurant owner only)
export const respondToReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { ownerResponse: req.body.ownerResponse },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to respond to review",
      details: err.message,
    });
  }
};
