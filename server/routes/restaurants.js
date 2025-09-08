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

router.post('/', verifyToken, createRestaurant);
router.get('/', getAllRestaurants);
router.get('/search', searchRestaurants);
router.get('/:id', getRestaurantById);
router.get('/recommendations', verifyToken, getRecommendations);

export default router;