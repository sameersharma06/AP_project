import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { upvoteHazard } from "../controllers/voteController.js";

const router = express.Router();

router.post("/:reportId/upvote", authenticateToken, upvoteHazard);

export default router;
