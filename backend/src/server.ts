import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { disconnectPrisma } from "./lib/prisma";
import http from "http";

const PORT = env.PORT;

const server: http.Server = app.listen(PORT, () => {
  logger.info(`The Nail Lounge Backend API initialized successfully`, {
    port: PORT,
    environment: env.NODE_ENV,
    apiPrefix: "/api/v1",
  });
});

let isShuttingDown = false;

async function handleShutdown(signal: string, exitCode = 0): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  // Force shutdown after timeout if pending connections do not drain
  const forceExitTimer = setTimeout(() => {
    logger.error("Graceful shutdown timeout exceeded (10s). Forcing process termination.");
    process.exit(1);
  }, 10000);
  forceExitTimer.unref();

  // 1. Stop accepting new HTTP requests
  server.close(async (err) => {
    if (err) {
      logger.error("Error occurred while closing HTTP server", { error: String(err) });
    } else {
      logger.info("HTTP server closed. No longer accepting new connections.");
    }

    // 2. Disconnect database connections
    await disconnectPrisma();

    logger.info("Graceful shutdown sequence completed. Exiting process.");
    process.exit(exitCode);
  });
}

process.on("SIGINT", () => {
  void handleShutdown("SIGINT", 0);
});

process.on("SIGTERM", () => {
  void handleShutdown("SIGTERM", 0);
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled Promise Rejection detected", {
    reason: reason instanceof Error ? reason.stack : String(reason),
  });
  void handleShutdown("unhandledRejection", 1);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception detected", {
    error: error.message,
    stack: error.stack,
  });
  void handleShutdown("uncaughtException", 1);
});

