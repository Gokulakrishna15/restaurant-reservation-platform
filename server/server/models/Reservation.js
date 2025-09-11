import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  date: {
    type: String, // e.g., "2025-09-03"
    required: true
  },
  timeSlot: {
    type: String, // e.g., "19:00"
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  specialRequests: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;