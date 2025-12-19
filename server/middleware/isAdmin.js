// server/middleware/isAdmin.js
export default function isAdmin(req, res, next) {
  try {
    // Assuming verifyToken has already set req.user
    if (req.user?.role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Access denied. Admins only." });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
