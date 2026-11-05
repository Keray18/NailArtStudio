import { app } from './app';
import { config, validateEnv } from './config/env';
import { prisma } from './config/prisma';

// Validate environment strictly on server boot
try {
  validateEnv();
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}

const server = app.listen(config.PORT, () => {
  console.log(`[Backend Server] Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
  console.log(`[Backend Server] Health check available at http://localhost:${config.PORT}/api/health`);
});

// Graceful shutdown handling
const handleGracefulShutdown = async (signal: string) => {
  console.log(`\n[Backend Server] ${signal} signal received: closing HTTP server and database connections`);

  server.close(async () => {
    console.log('[Backend Server] HTTP server closed');
    try {
      await prisma.$disconnect();
      console.log('[Backend Server] Database connection closed');
    } catch (err) {
      console.error('[Backend Server] Error during database disconnect:', err);
    }
    process.exit(0);
  });

  // Force shutdown after timeout if pending connections do not drain
  setTimeout(() => {
    console.error('[Backend Server] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Backend Server] Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  console.error('[Backend Server] Uncaught Exception:', error);
  process.exit(1);
});
