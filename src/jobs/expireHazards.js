import cron from "node-cron";
import { prisma } from "../config/database.js";

export const startHazardExpiryJob = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const result = await prisma.hazardReport.updateMany({
                where: {
                    status: "ACTIVE",
                    expiresAt: {
                        lte: new Date(),
                    },
                },
                data: {
                    status: "EXPIRED",
                },
            });

            if (result.count > 0) {
                console.log(`${result.count} hazard reports expired`);
            }
        } catch (error) {
            console.error("Hazard expiry job failed:", error);
        }
    });

    console.log("Hazard expiry job started");
};