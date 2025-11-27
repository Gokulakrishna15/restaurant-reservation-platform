import Review from '../models/Review.js';

// ✅ Create a review
export const createReview = async (req, res) => {
  try {
    const newReview = new Review({
      user: req.user.id,
      restaurant: req.body.restaurant,
      comment: req.body.comment,
      rating: req.body.rating,
      photo: req.body.photo || '',
    });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review', details: err.message });
  }
};

// ✅ Get reviews by restaurant name
export const getReviewsByRestaurant = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('restaurant', 'name')
      .where('restaurant.name')
      .equals(req.params.restaurantName);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
};

// ✅ Update a review
export const updateReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { comment: req.body.comment, rating: req.body.rating },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review', details: err.message });
  }
};

// ✅ Delete a review
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review', details: err.message });
  }
};

// ✅ Owner response to a review
export const respondToReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { ownerReply: req.body.ownerReply },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to review', details: err.message });
  }
};