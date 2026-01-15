import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const RestaurantOwnerDashboard = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    location: "",
    priceRange: "₹₹",
    description: "",
    images: [],
    features: "",
  });
  const [imageInput, setImageInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyRestaurants();
    fetchCuisineTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCuisineTypes = async () => {
    try {
      const res = await axios.get("/restaurants/cuisine-types");
      setCuisineTypes(res.data.data);
    } catch (err) {
      console.error("Error fetching cuisine types:", err);
    }
  };

  const fetchMyRestaurants = async () => {
    try {
      const res = await axios.get("/restaurants/my-restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load your restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ ENHANCED: File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (formData.images.length >= 5) {
      setError("Maximum 5 images allowed");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setUploadingImage(true);
    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      // Upload to your backend (which then uploads to Cloudinary)
      const res = await axios.post('/upload/restaurant-image', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const imageUrl = res.data.imageUrl;
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl],
      });
      
      setSuccess("✅ Image uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image");
      setTimeout(() => setError(""), 5000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim() && formData.images.length < 5) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const featuresArray = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);

      await axios.post(
        "/restaurants",
        {
          ...formData,
          features: featuresArray,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("✅ Restaurant added successfully!");
      setFormData({
        name: "",
        cuisine: "",
        location: "",
        priceRange: "₹₹",
        description: "",
        images: [],
        features: "",
      });
      setShowForm(false);
      fetchMyRestaurants();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding restaurant:", err);
      setError(err.response?.data?.error || "Failed to add restaurant");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    try {
      await axios.delete(`/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✅ Restaurant deleted successfully!");
      fetchMyRestaurants();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Delete restaurant error:", error);
      setError("Failed to delete restaurant");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-yellow-300 font-mono text-lg">Loading your restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 px-4 py-8 font-mono">
      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-900 text-green-300 p-4 rounded-lg border-2 border-green-400 shadow-lg z-50 animate-pulse">
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-900 text-red-300 p-4 rounded-lg border-2 border-red-400 shadow-lg z-50 animate-pulse">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black border-4 border-pink-500 rounded-xl p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-pink-400 mb-4 tracking-widest uppercase">
            🏪 My Restaurants
          </h1>
          <p className="text-cyan-300 mb-6">Manage your restaurant listings</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg font-bold hover:from-green-600 hover:to-green-800 transition"
          >
            {showForm ? "Cancel" : "+ Add New Restaurant"}
          </button>
        </div>

        {/* Add Restaurant Form */}
        {showForm && (
          <div className="bg-black border-4 border-cyan-400 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-pink-400 mb-6 uppercase">Add New Restaurant</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-cyan-300 mb-2 font-semibold">Restaurant Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Cuisine - DROPDOWN */}
                <div>
                  <label className="block text-cyan-300 mb-2 font-semibold">Cuisine Type *</label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="">Select cuisine type</option>
                    {cuisineTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    ℹ️ Predefined options prevent spelling errors
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-cyan-300 mb-2 font-semibold">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-cyan-300 mb-2 font-semibold">Price Range *</label>
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="₹">₹ - Budget Friendly</option>
                    <option value="₹₹">₹₹ - Moderate</option>
                    <option value="₹₹₹">₹₹₹ - Expensive</option>
                    <option value="₹₹₹₹">₹₹₹₹ - Fine Dining</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-cyan-300 mb-2 font-semibold">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-cyan-300 mb-2 font-semibold">
                  Features (comma-separated)
                </label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="e.g. WiFi, Parking, Outdoor Seating"
                  className="w-full p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Images - ENHANCED with File Upload */}
              <div>
                <label className="block text-cyan-300 mb-3 font-semibold">
                  Restaurant Images (up to 5)
                </label>
                
                {/* ✅ FILE UPLOAD OPTION */}
                <div className="mb-4 p-4 border-2 border-purple-500 rounded-lg bg-purple-900 bg-opacity-20">
                  <p className="text-yellow-300 text-sm mb-3">📤 Upload from Computer:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage || formData.images.length >= 5}
                    className="w-full text-green-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white file:font-bold hover:file:bg-purple-700 file:cursor-pointer disabled:opacity-50"
                  />
                  {uploadingImage && (
                    <p className="text-yellow-300 text-sm mt-2 animate-pulse">⌛ Uploading image...</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Max size: 5MB • Formats: JPG, PNG, WebP
                  </p>
                </div>

                {/* ✅ URL INPUT OPTION (Keep existing functionality) */}
                <div className="mb-4 p-4 border-2 border-pink-500 rounded-lg bg-pink-900 bg-opacity-20">
                  <p className="text-yellow-300 text-sm mb-3">🔗 Or Add Image URL:</p>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="Enter image URL"
                      disabled={formData.images.length >= 5}
                      className="flex-1 p-3 border-2 border-pink-400 bg-black text-green-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      disabled={formData.images.length >= 5}
                      className="bg-purple-600 text-white px-6 py-3 rounded font-bold hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Image Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-20 object-cover rounded border-2 border-pink-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs hover:bg-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-400 mt-2">
                  {formData.images.length}/5 images added
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-700 text-white py-4 rounded-lg font-bold text-lg hover:from-pink-600 hover:to-purple-800 transition disabled:opacity-50"
              >
                {submitting ? "⌛ Adding Restaurant..." : "✅ Add Restaurant"}
              </button>
            </form>
          </div>
        )}

        {/* Restaurant List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.length === 0 ? (
            <div className="col-span-full bg-black border-2 border-yellow-500 rounded-xl p-12 text-center">
              <p className="text-yellow-300 text-xl mb-4">📭 No restaurants yet</p>
              <p className="text-cyan-300">Click "Add New Restaurant" to get started!</p>
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-black border-2 border-cyan-400 rounded-xl overflow-hidden hover:border-pink-400 transition transform hover:scale-105 duration-300"
              >
                <img
                  src={restaurant.images?.[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-pink-400 mb-2">{restaurant.name}</h3>
                  <p className="text-cyan-300 text-sm mb-2">
                    {restaurant.cuisine} · {restaurant.location}
                  </p>
                  <p className="text-yellow-300 mb-2">
                    ⭐ {restaurant.rating?.toFixed(1) || "0.0"} ({restaurant.totalReviews || 0} reviews)
                  </p>
                  <p className="text-green-300 text-sm mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                      className="flex-1 bg-cyan-600 text-white py-2 rounded font-bold hover:bg-cyan-700 transition"
                    >
                      👁 View
                    </button>
                    <button
                      onClick={() => handleDeleteRestaurant(restaurant._id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-green-400 text-xs mt-8 pt-8 border-t border-gray-700">
        © 2025 FoodieHub · Built with ❤️ by Gokulakrishna
      </footer>
    </div>
  );
};

export default RestaurantOwnerDashboard;