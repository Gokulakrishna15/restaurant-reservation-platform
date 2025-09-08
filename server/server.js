import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import reservationRoutes from './routes/reservations.js';
import reviewRoutes from './routes/reviews.js';
import restaurantRoutes from './routes/restaurants.js';
import uploadRoutes from './routes/upload.js';
import paymentRoutes from './routes/payments.js'; // ✅ Stripe route

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes); // ✅ Stripe route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));