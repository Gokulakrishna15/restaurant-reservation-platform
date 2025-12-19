import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true, maxlength: 500 },
    photo: { type: String }, // optional image URL
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

// ✅ Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (restaurantId) {
  const result = await this.aggregate([
    { $match: { restaurant: restaurantId } },
    { $group: { _id: "$restaurant", avgRating: { $avg: "$rating" } } },
  ]);
  return result[0]?.avgRating || 0;
};

// ✅ Update restaurant avgRating after save/remove
reviewSchema.statics.updateRestaurantRating = async function (restaurantId) {
  const avgRating = await this.calculateAverageRating(restaurantId);
  await mongoose.model("Restaurant").findByIdAndUpdate(restaurantId, { avgRating });
};

reviewSchema.post("save", async function () {
  await this.constructor.updateRestaurantRating(this.restaurant);
});

reviewSchema.post("remove", async function () {
  await this.constructor.updateRestaurantRating(this.restaurant);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
