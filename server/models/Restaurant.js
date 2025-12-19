import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },   // YYYY-MM-DD
  time: { type: String, required: true },   // HH:mm
  capacity: { type: Number, required: true }
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    location: { type: String, required: true },
    priceRange: { type: String, enum: ["low", "medium", "high"], required: true },

    dietaryOptions: [String],   // e.g. vegan, gluten-free
    ambiance: [String],         // e.g. romantic, casual
    features: [String],         // e.g. outdoor seating, live music

    imageUrl: { type: String },
    photos: [String],
    contact: { type: String },
    hours: { type: String },
    menu: [String],

    slots: [slotSchema], // ✅ reservation slots
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;