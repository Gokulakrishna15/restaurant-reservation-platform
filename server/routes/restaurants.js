import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

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

// ✅ Get all restaurants (public)
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("reviews")
      .lean();

    res.json({
      success: true,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Search restaurants
router.get("/search", async (req, res) => {
  try {
    const { cuisine, location, features } = req.query;
    const query = {};

    if (cuisine) query.cuisine = { $regex: cuisine, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (features) query.features = { $in: [features] };

    const restaurants = await Restaurant.find(query)
      .populate("reviews");

    res.json({
      success: true,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get restaurant by ID with reviews
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "user", select: "name email" },
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get recommendations (for logged-in users)
router.get("/recommendations/me", verifyToken, async (req, res) => {
  try {
    const recommendations = await Restaurant.find()
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
});

export default router;