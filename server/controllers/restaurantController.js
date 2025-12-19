import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";
import Review from "../models/Review.js";

/* =========================================================
   CREATE RESTAURANT (ADMIN)
========================================================= */
export const createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    const saved = await restaurant.save();

    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (err) {
    console.error("❌ Create restaurant error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
    });
  }
};

/* =========================================================
   GET ALL RESTAURANTS
========================================================= */
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("reviews");

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (err) {
    console.error("❌ Fetch restaurants error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
    });
  }
};

/* =========================================================
   SEARCH RESTAURANTS
========================================================= */
export const searchRestaurants = async (req, res) => {
  try {
    const { cuisine, location, features } = req.query;
    const query = {};

    if (cuisine) query.cuisine = { $regex: cuisine, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };

    if (features) {
      query.features = {
        $all: features.split(",").map((f) => f.trim()),
      };
    }

    const results = await Restaurant.find(query).populate("reviews");

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

/* =========================================================
   GET RESTAURANT BY ID
========================================================= */
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name email" },
      })
      .lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    console.error("❌ Get restaurant error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant",
    });
  }
};

/* =========================================================
   UPDATE RESTAURANT (ADMIN)
========================================================= */
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const updated = await Restaurant.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update restaurant",
    });
  }
};

/* =========================================================
   DELETE RESTAURANT (ADMIN)
========================================================= */
export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete restaurant",
    });
  }
};

/* =========================================================
   GET RECOMMENDATIONS (FIXED & SAFE)
========================================================= */
export const getRecommendations = async (req, res) => {
  try {
    // ✅ FIX: get user ID from JWT
    const userId = req.user.id;

    // Fetch user reviews
    const userReviews = await Review.find({ user: userId })
      .populate("restaurant")
      .limit(10);

    // If user has no reviews → fallback
    if (!userReviews.length) {
      const fallback = await Restaurant.find().limit(5);
      return res.status(200).json({
        success: true,
        data: fallback,
      });
    }

    // Extract cuisines user liked
    const likedCuisines = [
      ...new Set(
        userReviews
          .map((r) => r.restaurant?.cuisine)
          .filter(Boolean)
      ),
    ];

    const recommended = await Restaurant.find({
      cuisine: { $in: likedCuisines },
    }).limit(5);

    res.status(200).json({
      success: true,
      data: recommended,
    });
  } catch (err) {
    console.error("❌ Recommendation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
    });
  }
};
