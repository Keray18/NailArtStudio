import { describe, it, expect } from "vitest";
import { validateEnv } from "../src/config/env";

describe("Environment Configuration Validator", () => {
  it("should validate a complete and valid environment object", () => {
    const validConfig = {
      NODE_ENV: "production",
      PORT: "5000",
      FRONTEND_ORIGIN: "https://thenaillounge.in",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/nail_db?schema=public",
      RATE_LIMIT_WINDOW_MS: "60000",
      RATE_LIMIT_MAX_REQUESTS: "50",
      LOG_LEVEL: "warn",
    };

    const parsed = validateEnv(validConfig);
    expect(parsed.NODE_ENV).toBe("production");
    expect(parsed.PORT).toBe(5000);
    expect(parsed.FRONTEND_ORIGIN).toBe("https://thenaillounge.in");
    expect(parsed.DATABASE_URL).toBe(validConfig.DATABASE_URL);
    expect(parsed.RATE_LIMIT_WINDOW_MS).toBe(60000);
    expect(parsed.RATE_LIMIT_MAX_REQUESTS).toBe(50);
    expect(parsed.LOG_LEVEL).toBe("warn");
  });

  it("should provide default values for optional settings", () => {
    const minimalConfig = {
      DATABASE_URL: "postgresql://user:pass@localhost:5432/nail_db?schema=public",
    };

    const parsed = validateEnv(minimalConfig);
    expect(parsed.NODE_ENV).toBe("development");
    expect(parsed.PORT).toBe(4000);
    expect(parsed.FRONTEND_ORIGIN).toBe("http://localhost:3000");
    expect(parsed.LOG_LEVEL).toBe("info");
  });

  it("should fail fast if DATABASE_URL is missing in non-test mode", () => {
    const invalidConfig = {
      NODE_ENV: "production",
      PORT: "4000",
    };

    expect(() => validateEnv(invalidConfig)).toThrow("[Configuration Error] Invalid environment variables:");
  });

  it("should fail fast if PORT is not a valid number", () => {
    const invalidConfig = {
      DATABASE_URL: "postgresql://user:pass@localhost:5432/nail_db",
      PORT: "not-a-port",
    };

    expect(() => validateEnv(invalidConfig)).toThrow("Expected number, received nan");
  });
});

