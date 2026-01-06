import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import isRestaurantOwner from "../middleware/isRestaurantOwner.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// ✅ Default images for restaurants
const defaultImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800"
];

// ✅ Predefined cuisine types to prevent spelling errors
const CUISINE_TYPES = [
  "Italian", "Chinese", "Indian", "Mexican", "Japanese",
  "Thai", "French", "American", "Mediterranean", "Korean",
  "Spanish", "Greek", "Vietnamese", "Lebanese", "Turkish",
  "Brazilian", "German", "Caribbean", "Moroccan", "Other"
];

// ✅ Create restaurant (RESTAURANT OWNER only) - FIXED
router.post("/", verifyToken, isRestaurantOwner, async (req, res) => {
  try {
    const {
      name,
      cuisine,
      location,
      priceRange,
      description,
      images,
      features,
      availableTimeSlots,
    } = req.body;

    if (!name || !cuisine || !location || !priceRange) {
      return res.status(400).json({ 
        error: "Missing required fields: name, cuisine, location, priceRange" 
      });
    }

    // ✅ Validate cuisine type
    if (!CUISINE_TYPES.includes(cuisine)) {
      return res.status(400).json({ 
        error: `Invalid cuisine type. Must be one of: ${CUISINE_TYPES.join(", ")}` 
      });
    }

    // ✅ FIX: Automatically set owner to current restaurant_owner user
    const newRestaurant = new Restaurant({
      name,
      cuisine,
      location,
      priceRange,
      description: description || "Delicious food and great atmosphere",
      images: images && images.length > 0 ? images : defaultImages,
      features: features || [],
      availableTimeSlots: availableTimeSlots || [
        "12:00", "13:00", "14:00", "18:00", "19:00", "20:00", "21:00"
      ],
      owner: req.user.id, // ✅ Set owner to logged-in restaurant owner
      rating: 0,
      totalReviews: 0,
    });

    await newRestaurant.save();

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: newRestaurant,
    });
  } catch (err) {
    console.error("Restaurant creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get cuisine types (public) - NEW ENDPOINT
router.get("/cuisine-types", (req, res) => {
  res.json({
    success: true,
    data: CUISINE_TYPES,
  });
});

// ✅ Get all restaurants (public)
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().lean();

    // Add default images to restaurants that don't have them
    const restaurantsWithImages = restaurants.map(restaurant => {
      if (!restaurant.images || restaurant.images.length === 0) {
        restaurant.images = defaultImages;
      }
      return restaurant;
    });

    res.json({
      success: true,
      data: restaurantsWithImages,
    });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get restaurants owned by current user (restaurant owner only)
router.get("/my-restaurants", verifyToken, isRestaurantOwner, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.id }).lean();

    const restaurantsWithImages = restaurants.map(restaurant => {
      if (!restaurant.images || restaurant.images.length === 0) {
        restaurant.images = defaultImages;
      }
      return restaurant;
    });

    res.json({
      success: true,
      data: restaurantsWithImages,
    });
  } catch (err) {
    console.error("Error fetching my restaurants:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Search restaurants
router.get("/search", async (req, res) => {
  try {
    const { cuisine, location, features, priceRange } = req.query;
    const query = {};

    if (cuisine) query.cuisine = { $regex: cuisine, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (features) query.features = { $in: [features] };
    if (priceRange) query.priceRange = priceRange;

    const restaurants = await Restaurant.find(query).lean();

    // Add default images
    const restaurantsWithImages = restaurants.map(restaurant => {
      if (!restaurant.images || restaurant.images.length === 0) {
        restaurant.images = defaultImages;
      }
      return restaurant;
    });

    res.json({
      success: true,
      data: restaurantsWithImages,
    });
  } catch (err) {
    console.error("Error searching restaurants:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Add default images if missing
    if (!restaurant.images || restaurant.images.length === 0) {
      restaurant.images = defaultImages;
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    console.error("Error fetching restaurant:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get recommendations (for logged-in users)
router.get("/recommendations/me", verifyToken, async (req, res) => {
  try {
    const recommendations = await Restaurant.find()
      .sort({ rating: -1 }) // Sort by highest rating
      .limit(5)
      .lean();

    // Add default images
    const recommendationsWithImages = recommendations.map(restaurant => {
      if (!restaurant.images || restaurant.images.length === 0) {
        restaurant.images = defaultImages;
      }
      return restaurant;
    });

    res.json({
      success: true,
      data: recommendationsWithImages,
    });
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update restaurant (owner or admin)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Check if user is owner or admin
    const isOwner = restaurant.owner.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        error: "Unauthorized - only restaurant owner or admin can update" 
      });
    }

    // Validate cuisine if being updated
    if (req.body.cuisine && !CUISINE_TYPES.includes(req.body.cuisine)) {
      return res.status(400).json({ 
        error: `Invalid cuisine type. Must be one of: ${CUISINE_TYPES.join(", ")}` 
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant,
    });
  } catch (err) {
    console.error("Error updating restaurant:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete restaurant (admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting restaurant:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;