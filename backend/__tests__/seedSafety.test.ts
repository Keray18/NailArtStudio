import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { runCatalogueSeed } from "../prisma/seed";

describe("Database Seed Safety Gates", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("should unconditionally reject execution when NODE_ENV is production", async () => {
    process.env.NODE_ENV = "production";
    await expect(runCatalogueSeed()).rejects.toThrow(/FATAL SECURITY GATE/i);
  });

  it("should unconditionally reject execution even if ALLOW_PRODUCTION_SEED is passed", async () => {
    process.env.NODE_ENV = "production";
    process.env.ALLOW_PRODUCTION_SEED = "true";
    await expect(runCatalogueSeed()).rejects.toThrow(/FATAL SECURITY GATE/i);
  });

  it("should reject execution when ALLOW_PRODUCTION_SEED is passed in development", async () => {
    process.env.NODE_ENV = "development";
    process.env.ALLOW_PRODUCTION_SEED = "true";
    await expect(runCatalogueSeed()).rejects.toThrow(/FATAL SECURITY GATE/i);
  });

  it("should reject execution if DATABASE_URL points to an unauthorized remote host", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.ALLOW_PRODUCTION_SEED;
    process.env.DATABASE_URL = "postgresql://user:pass@ep-cool-db.us-east-2.aws.neon.tech/the_nail_lounge";
    await expect(runCatalogueSeed()).rejects.toThrow(/SECURITY GATE.*not an authorized local development or test database/i);
  });
});

