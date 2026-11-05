export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: unknown;
}

export interface DatabaseHealth {
  status: 'connected' | 'disconnected';
  latencyMs?: number;
  error?: string;
}

export interface CloudinaryHealth {
  status: 'configured' | 'unconfigured';
}

export interface BackendHealthData {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  services: {
    database: DatabaseHealth;
    cloudinary: CloudinaryHealth;
  };
}

