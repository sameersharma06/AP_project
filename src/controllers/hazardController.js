import { z } from "zod";
import { prisma } from "../config/database.js";

const hazardSchema = z.object({
  hazardType: z.string().trim().min(2),
  description: z.string().trim().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const createHazardReport = async (req, res) => {
  try {
    const validation = hazardSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid hazard report data",
        errors: validation.error.issues,
      });
    }

    const { hazardType, description, latitude, longitude } =
      validation.data;

    const report = await prisma.hazardReport.create({
      data: {
        userId: req.user.userId,
        hazardType,
        description,
        latitude,
        longitude,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Hazard report created successfully",
      report,
    });
  } catch (error) {
    console.error("Hazard report error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getNearbyHazards = async (req, res) => {
  try {
    const querySchema = z.object({
      latitude: z.coerce.number().min(-90).max(90),
      longitude: z.coerce.number().min(-180).max(180),
      radius: z.coerce.number().positive().max(50).default(5),
    });

    const validation = querySchema.safeParse(req.query);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid location parameters",
      });
    }

    const { latitude, longitude, radius } = validation.data;

    const reports = await prisma.hazardReport.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: {
          gt: new Date(),
        },
        latitude: {
          gte: latitude - radius / 111,
          lte: latitude + radius / 111,
        },
        longitude: {
          gte: longitude - radius / (111 * Math.cos(latitude * Math.PI / 180)),
          lte: longitude + radius / (111 * Math.cos(latitude * Math.PI / 180)),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    const nearbyReports = reports
      .map((report) => {
        const lat1 = latitude * Math.PI / 180;
        const lat2 = report.latitude * Math.PI / 180;
        const deltaLat = (report.latitude - latitude) * Math.PI / 180;
        const deltaLon = (report.longitude - longitude) * Math.PI / 180;

        const a =
          Math.sin(deltaLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(deltaLon / 2) ** 2;

        const distance = 6371 * 2 * Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

        return {
          ...report,
          distanceKm: Number(distance.toFixed(2)),
          votes: report._count.votes,
          _count: undefined,
        };
      })
      .filter((report) => report.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.status(200).json({
      success: true,
      count: nearbyReports.length,
      radiusKm: radius,
      reports: nearbyReports,
    });
  } catch (error) {
    console.error("Nearby hazards error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
