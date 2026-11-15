import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole("MODERATOR"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Moderator dashboard accessed successfully",
      user: req.user,
    });
  }
);

export default router;
