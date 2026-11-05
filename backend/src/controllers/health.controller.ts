import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service';
import { sendSuccess } from '../utils/apiResponse';

export class HealthController {
  /**
   * Health check endpoint: GET /api/health
   */
  public static async getHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await HealthService.getHealthStatus();
      const statusCode = health.status === 'healthy' ? 200 : 503;
      sendSuccess(res, health, `System is ${health.status}`, statusCode);
    } catch (error) {
      next(error);
    }
  }
}

