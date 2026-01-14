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
    // ✅ NEW: Table capacity management
    totalTables: {
      type: Number,
      default: 10, // Default 10 tables per restaurant
      min: 1,
    },
    seatingCapacityPerTable: {
      type: Number,
      default: 4, // Default 4 people per table
      min: 1,
    },
    totalSeatingCapacity: {
      type: Number,
      default: 40, // Total capacity = tables × seats per table
      min: 1,
    },
    reservationDuration: {
      type: Number,
      default: 120, // Default 2 hours (120 minutes) per reservation
      min: 30,
    },
  },
  { timestamps: true }
);

// ✅ Calculate total capacity before saving
restaurantSchema.pre('save', function(next) {
  if (this.isModified('totalTables') || this.isModified('seatingCapacityPerTable')) {
    this.totalSeatingCapacity = this.totalTables * this.seatingCapacityPerTable;
  }
  next();
});

export default mongoose.model("Restaurant", restaurantSchema);