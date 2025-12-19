import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/Restaurant.js";
import Review from "./models/Review.js";
import User from "./models/User.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear old data
    await Promise.all([Restaurant.deleteMany({}), Review.deleteMany({})]);

    // Ensure at least one sample user exists
    let sampleUser = await User.findOne();
    if (!sampleUser) {
      sampleUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword", // ⚠️ hash properly in production
        role: "user",
      });
      console.log("✅ Created sample user:", sampleUser.email);
    }

    // Insert sample restaurants with slots
    const restaurants = await Restaurant.insertMany([
      {
        name: "Spice Garden",
        cuisine: "Indian",
        location: "Chennai",
        priceRange: "medium",
        features: ["outdoor seating"],
        imageUrl: "https://example.com/spice.jpg",
        slots: [
          { date: "2025-12-20", time: "19:00", capacity: 10 },
          { date: "2025-12-21", time: "20:00", capacity: 8 },
        ],
      },
      {
        name: "Sushi World",
        cuisine: "Japanese",
        location: "Bangalore",
        priceRange: "high",
        features: ["live music"],
        imageUrl: "https://example.com/sushi.jpg",
        slots: [
          { date: "2025-12-20", time: "18:00", capacity: 12 },
          { date: "2025-12-21", time: "21:00", capacity: 6 },
        ],
      },
      {
        name: "Pasta Palace",
        cuisine: "Italian",
        location: "Mumbai",
        priceRange: "low",
        features: ["family-friendly"],
        imageUrl: "https://example.com/pasta.jpg",
        slots: [
          { date: "2025-12-20", time: "19:30", capacity: 15 },
          { date: "2025-12-21", time: "20:30", capacity: 10 },
        ],
      },
    ]);

    console.log("✅ Seeded restaurants:");
    restaurants.forEach((r) => console.log(`- ${r.name} (ID: ${r._id})`));

    // Insert sample reviews linked to restaurants
    const reviews = await Review.insertMany([
      {
        user: sampleUser._id,
        restaurant: restaurants[0]._id,
        rating: 5,
        comment: "Amazing Indian food with great spices!",
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[1]._id,
        rating: 4,
        comment: "Fresh sushi and nice ambiance.",
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[2]._id,
        rating: 3,
        comment: "Good pasta but service was slow.",
      },
    ]);

    console.log("✅ Seeded reviews:");
    reviews.forEach((rv) =>
      console.log(`- ${rv.comment} (Restaurant ID: ${rv.restaurant})`)
    );

    // Attach reviews to restaurants
    await Promise.all(
      reviews.map((review) =>
        Restaurant.findByIdAndUpdate(review.restaurant, {
          $push: { reviews: review._id },
        })
      )
    );

    console.log("✅ Linked reviews to restaurants");
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (err) {
    console.error("❌ Error seeding:", err.message);
    await mongoose.connection.close();
  }
}

seedDatabase();