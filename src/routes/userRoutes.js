import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Profile accessed successfully",
    user: req.user,
  });
});

export default router;
