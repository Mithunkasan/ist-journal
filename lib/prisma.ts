import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Singleton Prisma client.
 * - Query logging can be enabled with PRISMA_LOG_QUERIES=true when profiling.
 * - In production: logs warnings and errors only (no query noise).
 * - Re-uses the existing global instance across hot-reloads in dev mode
 *   to avoid "too many connections" errors.
 */
const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.PRISMA_LOG_QUERIES === "true"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
