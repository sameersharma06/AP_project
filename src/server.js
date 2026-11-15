
import express from "express";
import cors from "cors";
import { prisma } from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import moderatorRoutes from "./routes/moderatorRoutes.js";
import hazardRoutes from "./routes/hazardRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";

import { startHazardExpiryJob } from "./jobs/expireHazards.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "RouteShield API is running",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/moderator", moderatorRoutes);
app.use("/api/hazards", hazardRoutes);
app.use("/api/votes", voteRoutes);

// Start hazard expiry scheduler
startHazardExpiryJob();

// Start server
app.listen(PORT, () => {
  console.log(`RouteShield API running at http://localhost:${PORT}`);
});
