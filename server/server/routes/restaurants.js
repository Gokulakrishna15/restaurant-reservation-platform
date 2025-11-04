import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  createRestaurant,
  getAllRestaurants,
  searchRestaurants,
  getRestaurantById,
  getRecommendations
} from '../controllers/restaurantController.js';

const router = express.Router();

// 🔐 Create a new restaurant (admin only)
router.post('/', verifyToken, createRestaurant);

// 🌐 Get all restaurants
router.get('/', getAllRestaurants);

// 🔍 Search restaurants by cuisine, location, features
router.get('/search', searchRestaurants);

// 📄 Get full profile of a restaurant by ID (includes reviews, menu, etc.)
router.get('/:id', getRestaurantById);

// 🎯 Get personalized recommendations based on user review history
router.get('/recommendations', verifyToken, getRecommendations);

export default router;