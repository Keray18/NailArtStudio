import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from backend/.env (regardless of process.cwd())
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Also fallback to process.cwd() .env if present
dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  CLOUDINARY_CLOUD_NAME: z.string().default(''),
  CLOUDINARY_API_KEY: z.string().default(''),
  CLOUDINARY_API_SECRET: z.string().default(''),
});

export type Config = z.infer<typeof envSchema>;

/**
 * Validates environment variables strictly.
 * Throws a descriptive error if any required variable is missing or malformed.
 */
export function validateEnv(): Config {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `\n[FATAL] Environment validation failed:\n${errorDetails}\nPlease ensure required variables are set in your backend/.env file.\n`
    );
  }

  return result.data;
}

const parseConfig = (): Config => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    console.warn(`[Config Warning] Invalid or missing environment configuration: ${errorDetails}`);

    return {
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      PORT: Number(process.env.PORT) || 5000,
      DATABASE_URL: process.env.DATABASE_URL || '',
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    };
  }

  return result.data;
};

export const config = parseConfig();
