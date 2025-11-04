import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(helmet());

// --- CORS FIX ---
// Define all origins that are allowed to make requests
const allowedOrigins = [
  "http://localhost:5173",           // Your local dev frontend
  "https://city-guardian.vercel.app" // Your deployed Vercel frontend
  // Add any other origins you need to allow here
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, or server-to-server)
    // or if the origin is in our allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  },
  credentials: true
}));
// --- END OF FIX ---

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// health
app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// error handler
app.use(errorHandler);

// connect db & start
const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set in env");
    }
    await mongoose.connect(process.env.MONGO_URI, { /* options if needed */ });
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();