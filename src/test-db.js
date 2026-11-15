import { prisma } from "./config/database.js";

try {
  const result = await prisma.$queryRaw`SELECT 1 AS connected`;
  console.log("Database connected successfully!");
  console.log(result);
} catch (error) {
  console.error("Database connection failed:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
