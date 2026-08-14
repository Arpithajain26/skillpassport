import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Handle connection errors and reconnection
prisma
  .$connect()
  .then(() => {
    console.log("✅ Prisma connected to PostgreSQL successfully");
  })
  .catch((error) => {
    console.error("❌ Prisma connection error:", error?.message || error);
    // Connection will be retried automatically
  });
