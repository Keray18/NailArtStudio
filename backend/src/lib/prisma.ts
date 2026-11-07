import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import { env } from "../config/env";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const isDev = env.NODE_ENV === "development";

  const client = new PrismaClient({
    log: isDev
      ? [
          { emit: "event", level: "query" },
          { emit: "event", level: "info" },
          { emit: "event", level: "warn" },
          { emit: "event", level: "error" },
        ]
      : [
          { emit: "event", level: "warn" },
          { emit: "event", level: "error" },
        ],
  });

  // Log warnings and errors via structured logger
  client.$on("warn" as never, (e: { message: string }) => {
    logger.warn(`[Prisma Warning] ${e.message}`);
  });

  client.$on("error" as never, (e: { message: string }) => {
    logger.error(`[Prisma Error] ${e.message}`);
  });

  return client;
}

export const prisma = global.__prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

export interface DbHealthResult {
  isConnected: boolean;
  latencyMs: number;
  error?: string;
}

/**
 * Executes a bounded database ping with strict timeout.
 * Used by the /api/v1/ready readiness probe.
 */
export async function checkDatabaseHealth(timeoutMs = 3000): Promise<DbHealthResult> {
  const start = Date.now();

  const pingPromise = prisma.$queryRaw`SELECT 1 as ping`;

  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Database health check timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    timer.unref();
  });

  try {
    await Promise.race([pingPromise, timeoutPromise]);
    const latencyMs = Date.now() - start;
    return {
      isConnected: true,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = Date.now() - start;
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      isConnected: false,
      latencyMs,
      error: errorMessage,
    };
  }
}

/**
 * Disconnects the Prisma client safely during graceful shutdown.
 */
export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info("Prisma client disconnected successfully.");
  } catch (err) {
    logger.error("Error disconnecting Prisma client", { error: String(err) });
  }
}
