import { checkDatabaseConnection } from '../config/prisma';
import { isCloudinaryConfigured } from '../config/cloudinary';
import { config } from '../config/env';

export interface HealthStatusData {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  services: {
    database: {
      status: 'connected' | 'disconnected';
      latencyMs?: number;
      error?: string;
    };
    cloudinary: {
      status: 'configured' | 'unconfigured';
    };
  };
}

export class HealthService {
  /**
   * Evaluates overall application health and dependencies.
   */
  public static async getHealthStatus(): Promise<HealthStatusData> {
    const dbCheck = await checkDatabaseConnection();
    const cloudinaryConfigured = isCloudinaryConfigured();

    const isHealthy = dbCheck.connected;

    return {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: config.NODE_ENV,
      services: {
        database: {
          status: dbCheck.connected ? 'connected' : 'disconnected',
          ...(dbCheck.latencyMs !== undefined ? { latencyMs: dbCheck.latencyMs } : {}),
          ...(dbCheck.error ? { error: dbCheck.error } : {}),
        },
        cloudinary: {
          status: cloudinaryConfigured ? 'configured' : 'unconfigured',
        },
      },
    };
  }
}

