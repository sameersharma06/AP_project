import { z } from "zod";
import { prisma } from "../config/database.js";

export const upvoteHazard = async (req, res) => {
  try {
    const reportIdSchema = z.coerce.number().int().positive();

    const validation = reportIdSchema.safeParse(req.params.reportId);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID",
      });
    }

    const reportId = validation.data;
    const userId = req.user.userId;

    const report = await prisma.hazardReport.findFirst({
      where: {
        id: reportId,
        status: "ACTIVE",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Active hazard report not found",
      });
    }

    await prisma.hazardVote.create({
      data: {
        userId,
        reportId,
      },
    });

    const voteCount = await prisma.hazardVote.count({
      where: { reportId },
    });

    return res.status(201).json({
      success: true,
      message: "Hazard confirmed successfully",
      voteCount,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "You have already confirmed this report",
      });
    }

    console.error("Hazard vote error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
