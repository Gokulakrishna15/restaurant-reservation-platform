import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";

dotenv.config();
const app = express();

// ✅ Validate required environment variables
["MONGO_URI", "JWT_SECRET"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// ✅ Configure CORS
const allowedOrigins = [
  "https://eclectic-cucurucho-a9fcf2.netlify.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// ✅ Middleware
app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(compression());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// ✅ MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
connectDB();

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✅ Restaurant backend is running");
});

// ✅ Import Routes
import authRoutes from "./routes/auth.js";
import reservationRoutes from "./routes/reservations.js";
import reviewRoutes from "./routes/reviews.js";
import restaurantRoutes from "./routes/restaurants.js";
import uploadRoutes from "./routes/upload.js";
import paymentRoutes from "./routes/payments.js";

// ✅ Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ✅ Graceful Shutdown
const shutdown = async (signal) => {
  console.log(`🔌 Received ${signal}, shutting down...`);
  await mongoose.connection.close();
  console.log("🔌 MongoDB disconnected");
  process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});