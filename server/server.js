import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import reservationRoutes from './routes/reservations.js';
import reviewRoutes from './routes/Reviews.js'; // ✅ Corrected casing
import restaurantRoutes from './routes/restaurants.js';
import uploadRoutes from './routes/upload.js';
import paymentRoutes from './routes/payments.js'; // ✅ Stripe route

import authMiddleware from './middleware/authMiddleware.js'; // ✅ JWT protection

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route for Render
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Restaurant Reservation API is live 🚀' });
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ✅ Mount routes
app.use('/api/auth', authRoutes); // Public routes

// 🔐 Protected routes (require JWT)
app.use('/api/reservations', authMiddleware, reservationRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);

// ✅ Public routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/restaurants', restaurantRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});