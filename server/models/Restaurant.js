import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    priceRange: {
      type: String,
      enum: ["₹", "₹₹", "₹₹₹", "₹₹₹₹"],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800"
      ],
    },
    availableTimeSlots: {
      type: [String],
      default: [
        "12:00",
        "13:00",
        "14:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
      ],
    },
    features: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);