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
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));
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
