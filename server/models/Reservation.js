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
      type: Date,          // ✅ use Date type instead of String
      required: true,
    },
    timeSlot: {
      type: String,        // HH:mm
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/, // basic time validation
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
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