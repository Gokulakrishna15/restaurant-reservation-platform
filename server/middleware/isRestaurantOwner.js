// ✅ Check if user is restaurant owner
// This middleware should be used AFTER verifyToken
const isRestaurantOwner = (req, res, next) => {
  try {
    // verifyToken already set req.user
    if (req.user && req.user.role === "restaurant_owner") {
      return next();
    }
    
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Restaurant owner privileges required." 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

export default isRestaurantOwner;