import { Request, Response } from "express";
import { checkDatabaseHealth } from "../../lib/prisma";
import { sendSuccess, sendError } from "../../utils/apiResponse";

export class HealthController {
  /**
   * GET /api/v1/health
   * Liveness probe: verifies Express server is running and responding to HTTP requests.
   * Does not connect to DB or external systems.
   */
  public getLiveness(_req: Request, res: Response): Response {
    return sendSuccess(res, {
      status: "pass",
      service: "the-nail-lounge-backend",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * GET /api/v1/ready
   * Readiness probe: checks bounded database connectivity.
   * Returns 200 if connected, 503 Service Unavailable if database is unreachable.
   */
  public async getReadiness(_req: Request, res: Response): Promise<Response> {
    const dbHealth = await checkDatabaseHealth(3000);

    if (!dbHealth.isConnected) {
      // Never expose full connection strings or internal credentials
      let sanitizedMessage = "Database ping failed or timed out";
      if (dbHealth.error) {
        // Strip out connection strings if present
        sanitizedMessage = dbHealth.error
          .replace(/postgresql:\/\/[^@]+@[^\s/]+/gi, "postgresql://[REDACTED]")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
          .join(" ");
      }

      return sendError(
        res,
        503,
        "SERVICE_UNAVAILABLE",
        "Database connectivity check failed.",
        [
          {
            field: "database",
            message: sanitizedMessage,
          },
        ]
      );
    }

    return sendSuccess(res, {
      status: "ready",
      service: "the-nail-lounge-backend",
      database: {
        status: "connected",
        latencyMs: dbHealth.latencyMs,
      },
      timestamp: new Date().toISOString(),
    });
  }
}

export const healthController = new HealthController();

