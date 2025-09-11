import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  location: { type: String, required: true },
  priceRange: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  dietaryOptions: [String], // e.g., ['vegan', 'gluten-free']
  ambiance: [String],       // e.g., ['romantic', 'family-friendly']
  features: [String],       // e.g., ['outdoor seating', 'live music']
  imageUrl: { type: String }, // ✅ Main display image (Cloudinary or direct URL)
  photos: [String],           // ✅ Optional gallery images
  contact: { type: String },  // e.g., phone or email
  hours: { type: String },    // e.g., "Mon–Fri: 10am–10pm"
  menu: [String]              // e.g., URLs or item names
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;