import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import { z } from "zod";
import { app } from "../src/app";
import { validateRequest } from "../src/middleware/validate.middleware";
import { errorMiddleware } from "../src/middleware/error.middleware";
import { notFoundMiddleware } from "../src/middleware/notFound.middleware";
import { requestIdMiddleware } from "../src/middleware/requestId.middleware";
import { BadRequestError } from "../src/utils/appError";

describe("Middleware Infrastructure", () => {
  describe("404 Not Found Middleware", () => {
    it("should return 404 with standardized error envelope for non-existent routes", async () => {
      const res = await request(app).get("/api/v1/non-existent-route-xyz");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
      expect(res.body.error.message).toContain("Route GET /api/v1/non-existent-route-xyz does not exist.");
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe("Request ID Middleware", () => {
    it("should generate a UUID if X-Request-Id header is omitted", async () => {
      const res = await request(app).get("/api/v1/health");
      const reqId = res.headers["x-request-id"];
      expect(reqId).toBeDefined();
      expect(reqId.length).toBeGreaterThan(10);
    });

    it("should preserve and echo an incoming valid client X-Request-Id header", async () => {
      const customId = "client-trace-12345-abcde";
      const res = await request(app)
        .get("/api/v1/health")
        .set("X-Request-Id", customId);

      expect(res.headers["x-request-id"]).toBe(customId);
    });

    it("should discard unsafe or overly long X-Request-Id and generate a secure UUID", async () => {
      const maliciousId = "<script>alert('xss')</script>";
      const res = await request(app)
        .get("/api/v1/health")
        .set("X-Request-Id", maliciousId);

      expect(res.headers["x-request-id"]).not.toBe(maliciousId);
      expect(res.headers["x-request-id"].length).toBeGreaterThan(20);
    });
  });

  describe("Zod Validation Middleware", () => {
    const testApp = express();
    testApp.use(express.json());
    testApp.use(requestIdMiddleware);

    const testSchema = {
      body: z.object({
        email: z.string().email("Invalid email format"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      }),
    };

    testApp.post(
      "/test-validate",
      validateRequest(testSchema),
      (req, res) => {
        res.status(200).json({ success: true, body: req.body });
      }
    );
    testApp.use(errorMiddleware);

    it("should accept valid payload", async () => {
      const res = await request(testApp)
        .post("/test-validate")
        .send({ email: "customer@example.com", quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject invalid payload with 400 and VALIDATION_FAILED details", async () => {
      const res = await request(testApp)
        .post("/test-validate")
        .send({ email: "invalid-email", quantity: 0 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_FAILED");
      expect(res.body.error.details).toBeDefined();
      expect(res.body.error.details.length).toBe(2);
      expect(res.body.error.details[0].field).toBe("email");
      expect(res.body.error.details[1].field).toBe("quantity");
    });
  });

  describe("Error Middleware Handling", () => {
    const errApp = express();
    errApp.use(express.json());
    errApp.use(requestIdMiddleware);

    errApp.get("/trigger-operational-error", () => {
      throw new BadRequestError("Custom bad request message", [
        { field: "testField", message: "Field error" },
      ]);
    });

    errApp.get("/trigger-unhandled-error", () => {
      throw new Error("Unexpected crash!");
    });

    errApp.use(notFoundMiddleware);
    errApp.use(errorMiddleware);

    it("should handle operational AppErrors with specified code and status", async () => {
      const res = await request(errApp).get("/trigger-operational-error");
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("BAD_REQUEST");
      expect(res.body.error.message).toBe("Custom bad request message");
      expect(res.body.error.details[0].field).toBe("testField");
    });

    it("should catch unexpected errors and return 500 INTERNAL_SERVER_ERROR", async () => {
      const res = await request(errApp).get("/trigger-unhandled-error");
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("INTERNAL_SERVER_ERROR");
    });
  });

  describe("CORS Security Middleware", () => {
    it("should reject requests from unauthorized origins", async () => {
      const res = await request(app)
        .get("/api/v1/health")
        .set("Origin", "http://malicious-website.com");

      // Express cors middleware returns 500 or CORS error when origin is rejected
      expect(res.status).toBe(500);
      expect(res.body.error.message).toContain("CORS error");
    });

    it("should allow requests from configured frontend origin", async () => {
      const res = await request(app)
        .get("/api/v1/health")
        .set("Origin", "http://localhost:3000");

      expect(res.status).toBe(200);
      expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    });
  });
});

