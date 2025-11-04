import Restaurant from '../models/Restaurant.js';
import Review from '../models/Review.js';

// ✅ Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create restaurant', details: err.message });
  }
};

// ✅ Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants', details: err.message });
  }
};

// ✅ Search restaurants with filters
export const searchRestaurants = async (req, res) => {
  try {
    const { cuisine, location, features } = req.query;

    const query = {};
    if (cuisine) query.cuisine = { $regex: cuisine, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (features) {
      const featureArray = features.split(',').map(f => f.trim());
      query.features = { $all: featureArray };
    }

    const results = await Restaurant.find(query);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
};

// ✅ Get restaurant by ID with reviews populated
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate({
      path: 'reviews',
      populate: { path: 'user', select: 'name' }
    });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurant', details: err.message });
  }
};

// ✅ Get recommendations based on user review history
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const userReviews = await Review.find({ user: userId }).populate('restaurant');
    const likedCuisines = [...new Set(userReviews.map(r => r.restaurant.cuisine))];

    const recommended = await Restaurant.find({ cuisine: { $in: likedCuisines } }).limit(5);
    res.status(200).json(recommended);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations', details: err.message });
  }
};