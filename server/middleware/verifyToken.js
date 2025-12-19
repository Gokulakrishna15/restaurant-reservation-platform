import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Log decoded payload for debugging
    console.log("Decoded JWT payload:", decoded);

    // Attach decoded payload to request
    req.user = decoded; // decoded.id is available
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    if (err.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ success: false, error: "Token expired. Please log in again." });
    }
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token" });
  }
};

export default verifyToken;