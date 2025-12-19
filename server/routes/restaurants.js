import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  createRestaurant,
  getAllRestaurants,
  searchRestaurants,
  getRestaurantById,
  getRecommendations,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// Admin: Create restaurant
router.post("/", verifyToken, isAdmin, createRestaurant);

// Public: Get all restaurants
router.get("/", getAllRestaurants);

// Public: Search restaurants
router.get("/search", searchRestaurants);

// Private: Recommendations
router.get("/recommendations/me", verifyToken, getRecommendations);

// Public: Get restaurant by ID
router.get("/:id", getRestaurantById);

// ✅ NEW: Get slots for a restaurant (optionally filter by date)
router.get("/:id/slots", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let slots = restaurant.slots || [];
    if (date) {
      slots = slots.filter((s) => s.date === date);
    }

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch slots", error: err.message });
  }
});

// Admin: Update restaurant
router.put("/:id", verifyToken, isAdmin, updateRestaurant);

// Admin: Delete restaurant
router.delete("/:id", verifyToken, isAdmin, deleteRestaurant);

export default router;