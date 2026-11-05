'use client';

import React, { useEffect } from 'react';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { envConfig } from '@/lib/config';

export const HealthStatusCard: React.FC = () => {
  const { data, isLoading, error, checkHealth } = useHealthCheck();

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            System Connectivity Status
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Backend API endpoint:{' '}
            <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-mono text-[11px]">
              {envConfig.apiUrl}
            </code>
          </p>
        </div>
        <Button
          onClick={checkHealth}
          isLoading={isLoading}
          size="sm"
          variant="secondary"
        >
          Check Connectivity
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/50 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm">
            <p className="font-semibold">Backend Unreachable</p>
            <p className="text-xs mt-1 text-rose-700 dark:text-rose-300">
              Ensure the backend server is running (<code className="font-mono">npm run dev</code> in <code className="font-mono">/backend</code>).
            </p>
            <p className="text-xs mt-1 font-mono break-all">{error}</p>
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-2">
                Backend API
              </span>
              <Badge variant={data.status === 'healthy' ? 'success' : 'warning'}>
                {data.status.toUpperCase()}
              </Badge>
              <div className="mt-2 text-[11px] text-stone-500">
                Uptime: {data.uptimeSeconds}s
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-2">
                PostgreSQL DB
              </span>
              <Badge
                variant={data.services.database.status === 'connected' ? 'success' : 'error'}
              >
                {data.services.database.status.toUpperCase()}
              </Badge>
              <div className="mt-2 text-[11px] text-stone-500">
                {data.services.database.latencyMs !== undefined
                  ? `${data.services.database.latencyMs}ms latency`
                  : 'Pending credentials'}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 block mb-2">
                Cloudinary
              </span>
              <Badge
                variant={data.services.cloudinary.status === 'configured' ? 'success' : 'neutral'}
              >
                {data.services.cloudinary.status.toUpperCase()}
              </Badge>
              <div className="mt-2 text-[11px] text-stone-500">
                Storage integration
              </div>
            </div>
          </div>
        )}

        {!data && !error && !isLoading && (
          <p className="text-xs text-stone-400 text-center py-4">
            Click &ldquo;Check Connectivity&rdquo; to test connection with the backend service.
          </p>
        )}
      </div>
    </div>
  );
};

