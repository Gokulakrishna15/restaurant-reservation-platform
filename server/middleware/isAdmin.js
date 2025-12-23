// ✅ Check if user is admin
// This middleware should be used AFTER verifyToken
const isAdmin = (req, res, next) => {
  try {
    // verifyToken already set req.user
    if (req.user && req.user.role === "admin") {
      return next();
    }
    
    return res.status(403).json({ 
      success: false,
      message: "Access denied. Admin privileges required." 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: err.message 
    });
  }
};

export default isAdmin;