/**
 * Centralized application configuration.
 * Exposes environment-derived client variables safely.
 */
export const envConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

