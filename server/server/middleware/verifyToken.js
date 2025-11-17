import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Attach decoded user to request
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(403).json({ message: 'Invalid token' });
  }
};

export default verifyToken;