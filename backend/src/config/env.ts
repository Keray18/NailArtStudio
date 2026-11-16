import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load .env from current working directory or backend root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  MIN_ORDER_MERCHANDISE_SUBTOTAL: z.coerce.number().positive().default(999),
  DELIVERY_RATE_PER_KG: z.coerce.number().positive().default(60),
  PACKAGING_WEIGHT_GRAMS: z.coerce.number().int().nonnegative().default(100),
  DELIVERY_BILLING_METHOD: z.enum(["CEIL_KG", "PROPORTIONAL", "UNCONFIRMED"]).default("CEIL_KG"),
  DELIVERY_ENABLED: z.coerce.boolean().default(true),
  OWNER_SECRET_KEY: z.string().default("tnl_owner_secret_dev_2026"),
  MERCHANT_UPI_VPA: z.string().default("thenaillounge@okhdfcbank"),
  MERCHANT_UPI_NAME: z.string().default("The Nail Lounge"),
  COD_ENABLED: z.coerce.boolean().default(true),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(customEnv?: Record<string, string | undefined>): Env {
  const target = customEnv ? { ...customEnv } : { ...process.env };
  
  const effectiveNodeEnv = target.NODE_ENV ?? process.env.NODE_ENV;
  // If in test mode and DATABASE_URL is missing, provide test fallback
  if (effectiveNodeEnv === "test" && !target.DATABASE_URL) {
    target.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/the_nail_lounge_test?schema=public";
  }

  const result = envSchema.safeParse(target);
  if (!result.success) {
    const formatted = result.error.errors
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");
    throw new Error(`[Configuration Error] Invalid environment variables:\n${formatted}`);
  }
  return result.data;
}

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = validateEnv();
  }
  return cachedEnv;
}

export const env = getEnv();
