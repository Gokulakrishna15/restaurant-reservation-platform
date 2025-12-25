import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/Restaurant.js";
import Review from "./models/Review.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear old data
    await Promise.all([Restaurant.deleteMany({}), Review.deleteMany({})]);
    console.log("✅ Cleared old data");

    // Ensure at least one sample user exists
    let sampleUser = await User.findOne({ email: "test@example.com" });
    if (!sampleUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      sampleUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        role: "user",
      });
      console.log("✅ Created sample user:", sampleUser.email);
    } else {
      console.log("✅ Using existing user:", sampleUser.email);
    }

    // Insert sample restaurants with images and slots
    const restaurants = await Restaurant.insertMany([
      {
        name: "Spice Garden",
        cuisine: "Indian",
        location: "Chennai",
        priceRange: "₹₹",
        description: "Authentic Indian cuisine with aromatic spices and traditional recipes",
        features: ["outdoor seating", "vegan options", "parking available"],
        images: [
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
        ],
        owner: sampleUser._id,
        slots: [
          { date: "2025-12-26", time: "12:00", capacity: 10 },
          { date: "2025-12-26", time: "19:00", capacity: 15 },
          { date: "2025-12-27", time: "13:00", capacity: 12 },
          { date: "2025-12-27", time: "20:00", capacity: 8 }
        ]
      },
      {
        name: "Sushi World",
        cuisine: "Japanese",
        location: "Bangalore",
        priceRange: "₹₹₹",
        description: "Fresh sushi and authentic Japanese dishes prepared by expert chefs",
        features: ["live music", "bar", "takeaway"],
        images: [
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
          "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800",
          "https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=800"
        ],
        owner: sampleUser._id,
        slots: [
          { date: "2025-12-26", time: "18:00", capacity: 12 },
          { date: "2025-12-26", time: "21:00", capacity: 6 },
          { date: "2025-12-27", time: "19:00", capacity: 10 },
          { date: "2025-12-27", time: "22:00", capacity: 8 }
        ]
      },
      {
        name: "Pasta Palace",
        cuisine: "Italian",
        location: "Mumbai",
        priceRange: "₹₹",
        description: "Delicious Italian pasta, pizzas, and classic Italian comfort food",
        features: ["family-friendly", "outdoor seating", "wifi"],
        images: [
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
          "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800",
          "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800"
        ],
        owner: sampleUser._id,
        slots: [
          { date: "2025-12-26", time: "12:30", capacity: 15 },
          { date: "2025-12-26", time: "19:30", capacity: 20 },
          { date: "2025-12-27", time: "13:30", capacity: 18 },
          { date: "2025-12-27", time: "20:30", capacity: 10 }
        ]
      },
      {
        name: "The Golden Dragon",
        cuisine: "Chinese",
        location: "Delhi",
        priceRange: "₹₹₹",
        description: "Authentic Chinese cuisine with a modern twist and elegant ambiance",
        features: ["private dining", "delivery", "wheelchair accessible"],
        images: [
          "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800",
          "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",
          "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=800"
        ],
        owner: sampleUser._id,
        slots: [
          { date: "2025-12-26", time: "18:30", capacity: 8 },
          { date: "2025-12-26", time: "20:30", capacity: 10 },
          { date: "2025-12-27", time: "19:00", capacity: 12 }
        ]
      },
      {
        name: "Burger Boulevard",
        cuisine: "American",
        location: "Pune",
        priceRange: "₹",
        description: "Juicy gourmet burgers and crispy fries in a casual setting",
        features: ["casual dining", "kids menu", "quick service"],
        images: [
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
          "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800"
        ],
        owner: sampleUser._id,
        slots: [
          { date: "2025-12-26", time: "12:00", capacity: 20 },
          { date: "2025-12-26", time: "14:00", capacity: 25 },
          { date: "2025-12-26", time: "18:00", capacity: 22 },
          { date: "2025-12-27", time: "13:00", capacity: 18 }
        ]
      },
      {
        name: "Mediterranean Breeze",
        cuisine: "Mediterranean",
        location: "Hyderabad",
        priceRange: "₹₹₹",
        description: "Fresh Mediterranean flavors with seafood specialties and Greek delights",
        features: ["outdoor seating", "romantic", "wine selection"],
        images: [
          "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800",
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800",
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800"
        ],
        owner: sampleUser._id,
        slots: [
          { date: "2025-12-26", time: "19:00", capacity: 10 },
          { date: "2025-12-26", time: "21:00", capacity: 8 },
          { date: "2025-12-27", time: "20:00", capacity: 12 }
        ]
      }
    ]);

    console.log("✅ Seeded restaurants:");
    restaurants.forEach((r) => console.log(`   - ${r.name} (${r.cuisine}) - ${r.location}`));

    // Insert sample reviews linked to restaurants
    const reviews = await Review.insertMany([
      {
        user: sampleUser._id,
        restaurant: restaurants[0]._id,
        rating: 5,
        comment: "Amazing Indian food with great spices! The butter chicken was phenomenal."
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[1]._id,
        rating: 4,
        comment: "Fresh sushi and nice ambiance. The live music was a great touch!"
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[2]._id,
        rating: 4,
        comment: "Delicious pasta! Great family atmosphere and friendly staff."
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[3]._id,
        rating: 5,
        comment: "Best Chinese food in Delhi! The Peking duck was incredible."
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[4]._id,
        rating: 4,
        comment: "Great burgers at affordable prices. Perfect for a quick lunch!"
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[5]._id,
        rating: 5,
        comment: "Beautiful Mediterranean cuisine. The seafood platter was outstanding!"
      }
    ]);

    console.log("✅ Seeded reviews:");
    reviews.forEach((rv) =>
      console.log(`   - ${rv.rating}⭐ - ${rv.comment.substring(0, 50)}...`)
    );

    // Attach reviews to restaurants
    await Promise.all(
      reviews.map((review) =>
        Restaurant.findByIdAndUpdate(review.restaurant, {
          $push: { reviews: review._id }
        })
      )
    );

    console.log("✅ Linked reviews to restaurants");
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - ${restaurants.length} restaurants created`);
    console.log(`   - ${reviews.length} reviews created`);
    console.log(`   - Test user: ${sampleUser.email} / password123\n`);

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (err) {
    console.error("❌ Error seeding:", err.message);
    console.error(err);
    await mongoose.connection.close();
  }
}

seedDatabase();