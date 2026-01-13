import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
      max: 20, // ✅ FIXED: Added maximum limit
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    // ✅ ADDED: Total amount field (₹500 per guest)
    totalAmount: {
      type: Number,
      required: true,
      default: 500,
    },
    reservationCode: {
      type: String,
      unique: true,
      default: () =>
        Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    cancellationReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ Index for faster availability checks
reservationSchema.index({ restaurant: 1, date: 1, timeSlot: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;