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
    console.log("✅ Cleared old restaurant and review data");

    // ✅ UPDATED: Use standard test user account
    let sampleUser = await User.findOne({ email: "user@test.com" });
    if (!sampleUser) {
      const hashedPassword = await bcrypt.hash("user123", 10);
      sampleUser = await User.create({
        name: "Test User",
        email: "user@test.com",
        password: hashedPassword,
        role: "user",
      });
      console.log("✅ Created test user:", sampleUser.email);
    } else {
      console.log("✅ Using existing test user:", sampleUser.email);
    }

    // Insert restaurants with proper images
    const restaurants = await Restaurant.insertMany([
      {
        name: "Spice Garden",
        cuisine: "Indian",
        location: "Chennai",
        priceRange: "₹₹",
        description: "Authentic Indian cuisine with aromatic spices and traditional recipes. Experience the rich flavors of India.",
        features: ["outdoor seating", "vegan options", "parking available"],
        images: [
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
        ],
        owner: sampleUser._id,
        rating: 4.5,
        totalReviews: 1,
        availableTimeSlots: ["12:00", "13:00", "18:00", "19:00", "20:00"]
      },
      {
        name: "Sushi World",
        cuisine: "Japanese",
        location: "Bangalore",
        priceRange: "₹₹₹",
        description: "Fresh sushi and authentic Japanese dishes prepared by expert chefs. Taste the excellence of Japanese cuisine.",
        features: ["live music", "bar", "takeaway"],
        images: [
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
          "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
          "https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=800&q=80"
        ],
        owner: sampleUser._id,
        rating: 4.7,
        totalReviews: 1,
        availableTimeSlots: ["18:00", "19:00", "20:00", "21:00"]
      },
      {
        name: "Pasta Palace",
        cuisine: "Italian",
        location: "Mumbai",
        priceRange: "₹₹",
        description: "Delicious Italian pasta, pizzas, and classic Italian comfort food. A family favorite destination.",
        features: ["family-friendly", "outdoor seating", "wifi"],
        images: [
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
          "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&q=80",
          "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80"
        ],
        owner: sampleUser._id,
        rating: 4.3,
        totalReviews: 1,
        availableTimeSlots: ["12:00", "13:00", "19:00", "20:00", "21:00"]
      },
      {
        name: "The Golden Dragon",
        cuisine: "Chinese",
        location: "Delhi",
        priceRange: "₹₹₹",
        description: "Authentic Chinese cuisine with a modern twist and elegant ambiance. Experience luxury dining.",
        features: ["private dining", "delivery", "wheelchair accessible"],
        images: [
          "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80",
          "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
          "https://images.unsplash.com/photo-1512003867696-6d5ce6835040?w=800&q=80"
        ],
        owner: sampleUser._id,
        rating: 4.8,
        totalReviews: 1,
        availableTimeSlots: ["18:00", "19:00", "20:00", "21:00"]
      },
      {
        name: "Burger Boulevard",
        cuisine: "American",
        location: "Pune",
        priceRange: "₹",
        description: "Juicy gourmet burgers and crispy fries in a casual setting. Perfect for quick bites.",
        features: ["casual dining", "kids menu", "quick service"],
        images: [
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
          "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80"
        ],
        owner: sampleUser._id,
        rating: 4.2,
        totalReviews: 1,
        availableTimeSlots: ["12:00", "13:00", "14:00", "18:00", "19:00"]
      },
      {
        name: "Mediterranean Breeze",
        cuisine: "Mediterranean",
        location: "Hyderabad",
        priceRange: "₹₹₹",
        description: "Fresh Mediterranean flavors with seafood specialties and Greek delights. A romantic experience.",
        features: ["outdoor seating", "romantic", "wine selection"],
        images: [
          "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800&q=80",
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80"
        ],
        owner: sampleUser._id,
        rating: 4.6,
        totalReviews: 1,
        availableTimeSlots: ["19:00", "20:00", "21:00"]
      },
      {
        name: "Taco Fiesta",
        cuisine: "Mexican",
        location: "Kolkata",
        priceRange: "₹₹",
        description: "Spicy and flavorful Mexican street food. Tacos, burritos, and more!",
        features: ["outdoor seating", "live music", "vegetarian options"],
        images: [
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
          "https://images.unsplash.com/photo-1613514785940-daed07799d11?w=800&q=80",
          "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80"
        ],
        owner: sampleUser._id,
        rating: 4.4,
        totalReviews: 0,
        availableTimeSlots: ["12:00", "13:00", "18:00", "19:00", "20:00"]
      },
      {
        name: "Thai Orchid",
        cuisine: "Thai",
        location: "Jaipur",
        priceRange: "₹₹",
        description: "Authentic Thai curries and noodles with a perfect balance of sweet, sour, and spicy.",
        features: ["authentic", "vegan options", "cozy atmosphere"],
        images: [
          "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80",
          "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&q=80",
          "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80"
        ],
        owner: sampleUser._id,
        rating: 4.5,
        totalReviews: 0,
        availableTimeSlots: ["12:00", "13:00", "19:00", "20:00"]
      }
    ]);

    console.log("✅ Seeded restaurants:");
    restaurants.forEach((r) => console.log(`   - ${r.name} (${r.cuisine}) - ${r.location}`));

    // Insert reviews
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
        rating: 5,
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

    console.log("✅ Seeded reviews");
    console.log("\n🎉 Database seeding completed!");
    console.log("═══════════════════════════════════════");
    console.log("📊 Summary:");
    console.log(`   • ${restaurants.length} restaurants`);
    console.log(`   • ${reviews.length} reviews`);
    console.log(`   • Test user: user@test.com / user123`);
    console.log("═══════════════════════════════════════\n");

    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding:", err);
    await mongoose.connection.close();
  }
}

seedDatabase();