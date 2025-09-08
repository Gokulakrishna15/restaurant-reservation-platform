import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id; // ✅ Attach userId for controller use
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default verifyToken;