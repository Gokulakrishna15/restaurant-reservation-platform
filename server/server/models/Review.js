import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ✅ Reference restaurant by ObjectId
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },

  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  photo: { type: String }, // optional image URL
  ownerResponse: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;