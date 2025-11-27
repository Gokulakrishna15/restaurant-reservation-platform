import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';
import Review from './models/Review.js';
import User from './models/User.js'; // make sure you have a User model

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Clear old data
    await Restaurant.deleteMany({});
    await Review.deleteMany({});

    // Insert sample restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Spice Garden',
        cuisine: 'Indian',
        location: 'Chennai',
        priceRange: 'medium',
        features: ['outdoor seating'],
        imageUrl: 'https://example.com/spice.jpg'
      },
      {
        name: 'Sushi World',
        cuisine: 'Japanese',
        location: 'Bangalore',
        priceRange: 'high',
        features: ['live music'],
        imageUrl: 'https://example.com/sushi.jpg'
      },
      {
        name: 'Pasta Palace',
        cuisine: 'Italian',
        location: 'Mumbai',
        priceRange: 'low',
        features: ['family-friendly'],
        imageUrl: 'https://example.com/pasta.jpg'
      }
    ]);

    console.log('✅ Seeded restaurants:');
    restaurants.forEach(r => console.log(`- ${r.name} (ID: ${r._id})`));

    // Pick a sample user (make sure at least one exists in your users collection)
    const sampleUser = await User.findOne();
    if (!sampleUser) {
      console.log('⚠️ No users found. Please register a user first.');
      mongoose.connection.close();
      return;
    }

    // Insert sample reviews linked to the actual restaurant IDs
    const reviews = await Review.insertMany([
      {
        user: sampleUser._id,
        restaurant: restaurants[0]._id,
        rating: 5,
        comment: 'Amazing Indian food with great spices!'
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[1]._id,
        rating: 4,
        comment: 'Fresh sushi and nice ambiance.'
      },
      {
        user: sampleUser._id,
        restaurant: restaurants[2]._id,
        rating: 3,
        comment: 'Good pasta but service was slow.'
      }
    ]);

    console.log('✅ Seeded reviews:');
    reviews.forEach(rv => console.log(`- ${rv.comment} (Restaurant ID: ${rv.restaurant})`));

    // Attach reviews to restaurants
    for (let review of reviews) {
      await Restaurant.findByIdAndUpdate(review.restaurant, {
        $push: { reviews: review._id }
      });
    }

    console.log('✅ Linked reviews to restaurants');
    mongoose.connection.close();
  })
  .catch(err => console.error('❌ Error seeding:', err));