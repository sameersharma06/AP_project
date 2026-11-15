import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createHazardReport,
  getNearbyHazards,
} from "../controllers/hazardController.js";

const router = express.Router();

router.post("/", authenticateToken, createHazardReport);
router.get("/nearby", authenticateToken, getNearbyHazards);

export default router;
