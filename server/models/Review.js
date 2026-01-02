import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    restaurant: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Restaurant", 
      required: true 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      required: true 
    },
    comment: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 500 
    },
    // ✅ FIXED: Changed from 'photo' to 'photos' array to match frontend
    photos: { 
      type: [String], 
      default: [] 
    },
    ownerResponse: {
      text: { type: String, trim: true },
      respondedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// ✅ Ensure one review per user per restaurant
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

// ✅ Virtual field for stars
reviewSchema.virtual("stars").get(function () {
  return "⭐".repeat(this.rating);
});
reviewSchema.set("toJSON", { virtuals: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;