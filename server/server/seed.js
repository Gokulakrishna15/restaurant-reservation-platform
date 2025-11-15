import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const sampleRestaurants = [
  {
    name: 'Spice Garden',
    cuisine: 'Indian',
    location: 'Chennai',
    priceRange: 'medium',
    dietaryOptions: ['vegan', 'gluten-free'],
    ambiance: ['family-friendly'],
    features: ['outdoor seating', 'live music'],
    imageUrl: 'https://example.com/spice-main.jpg',
    photos: ['https://example.com/spice1.jpg', 'https://example.com/spice2.jpg'],
    contact: '+91-9876543210',
    hours: 'Mon–Fri: 11am–10pm',
    menu: ['Paneer Tikka', 'Butter Naan']
  },
  {
    name: 'Sushi World',
    cuisine: 'Japanese',
    location: 'Bangalore',
    priceRange: 'high',
    dietaryOptions: ['gluten-free'],
    ambiance: ['romantic'],
    features: ['reservations', 'Wi-Fi'],
    imageUrl: 'https://example.com/sushi-main.jpg',
    photos: ['https://example.com/sushi1.jpg'],
    contact: '+91-9123456780',
    hours: 'Tue–Sun: 12pm–11pm',
    menu: ['California Roll', 'Miso Soup']
  },
  {
    name: 'Pasta Palace',
    cuisine: 'Italian',
    location: 'Mumbai',
    priceRange: 'low',
    dietaryOptions: ['vegetarian'],
    ambiance: ['casual'],
    features: ['rooftop', 'live music'],
    imageUrl: 'https://example.com/pasta-main.jpg',
    photos: ['https://example.com/pasta1.jpg'],
    contact: '+91-9988776655',
    hours: 'Daily: 10am–9pm',
    menu: ['Spaghetti Carbonara', 'Tiramisu']
  }
];

async function seedRestaurants() {
  try {
    await Restaurant.deleteMany();
    await Restaurant.insertMany(sampleRestaurants);
    console.log('✅ Sample restaurants seeded');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedRestaurants();