import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// ✅ Default images for restaurants
const defaultImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800"
];

// ✅ Create restaurant (admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      cuisine,
      location,
      priceRange,
      description,
      imageUrl,
      images,
      contact,
      hours,
      menu,
      features,
      dietaryOptions,
      ambiance,
    } = req.body;

    if (!name || !cuisine || !location || !priceRange) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRestaurant = new Restaurant({
      name,
      cuisine,
      location,
      priceRange,
      description: description || "",
      imageUrl,
      images: images || defaultImages,
      contact,
      hours,
      menu: menu || [],
      features: features || [],
      dietaryOptions: dietaryOptions || [],
      ambiance: ambiance || [],
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

// ✅ Get all restaurants (public) - FIXED: Removed .populate("reviews")
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().lean();

    // ✅ Add default images to restaurants that don't have them
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

// ✅ Search restaurants - FIXED: Removed .populate("reviews")
router.get("/search", async (req, res) => {
  try {
    const { cuisine, location, features } = req.query;
    const query = {};

    if (cuisine) query.cuisine = { $regex: cuisine, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (features) query.features = { $in: [features] };

    const restaurants = await Restaurant.find(query).lean();

    // ✅ Add default images
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

// ✅ Get restaurant by ID - FIXED: Removed .populate("reviews")
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // ✅ Add default images if missing
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
      .limit(5)
      .lean();

    // ✅ Add default images
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

// ✅ Update restaurant (admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
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