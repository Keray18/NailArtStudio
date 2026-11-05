'use client';

import { useState, useCallback } from 'react';
import { HealthService } from '@/services/healthService';
import { BackendHealthData } from '@/types/api';

export interface UseHealthCheckState {
  data: BackendHealthData | null;
  isLoading: boolean;
  error: string | null;
}

export function useHealthCheck() {
  const [state, setState] = useState<UseHealthCheckState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const checkHealth = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await HealthService.checkHealth();
      setState({
        data: response.data,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reach backend';
      setState({
        data: null,
        isLoading: false,
        error: message,
      });
    }
  }, []);

  return {
    ...state,
    checkHealth,
  };
}

