import { apiClient } from './apiClient';
import { ApiResponse, BackendHealthData } from '@/types/api';

export class HealthService {
  /**
   * Fetches backend API and database connectivity health status.
   */
  public static async checkHealth(): Promise<ApiResponse<BackendHealthData>> {
    return apiClient.get<BackendHealthData>('health');
  }
}

