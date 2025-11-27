import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  location: { type: String, required: true },
  priceRange: { type: String, enum: ['low', 'medium', 'high'], required: true },
  dietaryOptions: [String],
  ambiance: [String],
  features: [String],
  imageUrl: { type: String },
  photos: [String],
  contact: { type: String },
  hours: { type: String },
  menu: [String],

  // ✅ Reference reviews
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;