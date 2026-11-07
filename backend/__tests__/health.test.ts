import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import * as prismaLib from "../src/lib/prisma";

describe("Health & Readiness Endpoints", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/v1/health (Liveness)", () => {
    it("should return 200 with standard health payload without querying database", async () => {
      const res = await request(app).get("/api/v1/health");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.statusCode).toBe(200);
      expect(res.body.data.status).toBe("pass");
      expect(res.body.data.service).toBe("the-nail-lounge-backend");
      expect(typeof res.body.data.uptimeSeconds).toBe("number");
      expect(res.body.timestamp).toBeDefined();

      // Ensure no sensitive config leaked
      expect(res.body.data.DATABASE_URL).toBeUndefined();
      expect(res.body.data.env).toBeUndefined();
    });

    it("should include X-Request-Id header in health response", async () => {
      const res = await request(app).get("/api/v1/health");
      expect(res.headers["x-request-id"]).toBeDefined();
    });
  });

  describe("GET /api/v1/ready (Readiness)", () => {
    it("should return 200 ready when database is connected", async () => {
      vi.spyOn(prismaLib, "checkDatabaseHealth").mockResolvedValueOnce({
        isConnected: true,
        latencyMs: 5,
      });

      const res = await request(app).get("/api/v1/ready");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("ready");
      expect(res.body.data.database.status).toBe("connected");
      expect(res.body.data.database.latencyMs).toBe(5);
    });

    it("should return 503 SERVICE_UNAVAILABLE when database is disconnected or unreachable", async () => {
      vi.spyOn(prismaLib, "checkDatabaseHealth").mockResolvedValueOnce({
        isConnected: false,
        latencyMs: 3000,
        error: "Connection refused at localhost:5432",
      });

      const res = await request(app).get("/api/v1/ready");

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("SERVICE_UNAVAILABLE");
      expect(res.body.error.message).toContain("Database connectivity check failed");
      expect(res.body.error.details).toBeDefined();
      expect(res.body.error.details[0].field).toBe("database");
    });
  });
});

