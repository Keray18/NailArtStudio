import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";
import { env } from "../src/config/env";

describe("Delivery Quotation & Order Transactions Integration", () => {
  let testVariantId: string;
  let testVariantPrice: number;

  it("setup: find a published product variant with stock", async () => {
    const product = await prisma.product.findFirst({
      where: { isPublished: true },
      include: { variants: { include: { inventory: true } } },
    });

    expect(product).toBeDefined();
    const variant = product!.variants.find((v) => (v.inventory?.quantity ?? 0) > 5);
    expect(variant).toBeDefined();
    testVariantId = variant!.id;
    testVariantPrice = Number(variant!.price);
  });

  describe("Delivery Quotation API (POST /api/v1/delivery/quote)", () => {
    it("should calculate delivery charge at ₹60/kg including 100g packaging allowance", async () => {
      // 1 unit of 40g + 100g packaging = 140g -> rounded up to 1000g slab = ₹60
      const res = await request(app)
        .post("/api/v1/delivery/quote")
        .send({
          items: [{ variantId: testVariantId, quantity: 1 }],
          destinationPincode: "152116",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isServiceable).toBe(true);
      expect(res.body.data.ratePerKg).toBe(60);
      expect(res.body.data.deliveryCharge).toBe(60);
      expect(res.body.data.packagingWeightGrams).toBe(100);
      expect(res.body.data.totalParcelWeightGrams).toBeGreaterThan(100);
    });

    it("should reject invalid 5-digit or non-numeric destination pincode", async () => {
      const res = await request(app)
        .post("/api/v1/delivery/quote")
        .send({
          items: [{ variantId: testVariantId, quantity: 1 }],
          destinationPincode: "12345", // invalid length
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Minimum Order Enforcement (₹999 Merchandise Subtotal)", () => {
    it("should reject order if merchandise subtotal is below ₹999.00", async () => {
      // Even if variant price is ₹799, 1 unit is ₹799 < ₹999 minimum
      // Delivery charges (e.g. ₹60) must NOT count toward minimum!
      const res = await request(app)
        .post("/api/v1/orders")
        .send({
          customer: {
            fullName: "Amanpreet Kaur",
            phone: "9876543210",
            email: "amanpreet@example.com",
          },
          shippingAddress: {
            addressLine1: "Circular Road Near Bus Stand",
            city: "Abohar",
            state: "Punjab",
            postalCode: "152116",
          },
          paymentMethod: "UPI_MANUAL",
          items: [{ variantId: testVariantId, quantity: 1 }], // Subtotal will be < 999 if price < 999
        });

      if (testVariantPrice < 999) {
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe("MINIMUM_ORDER_NOT_MET");
      }
    });
  });

  describe("Order Placement, Stock Reservation & Idempotency", () => {
    let createdOrderNumber: string;
    let createdAccessToken: string;
    const testIdempotencyKey = `idemp_${Date.now()}_${Math.random()}`;

    it("should successfully place a guest order when subtotal meets ₹999 requirement", async () => {
      // Choose quantity so quantity * price >= 999
      const neededQty = Math.ceil(999 / testVariantPrice);

      const res = await request(app)
        .post("/api/v1/orders")
        .send({
          customer: {
            fullName: "Simran Sharma",
            phone: "9812345678",
            email: "simran@example.com",
          },
          shippingAddress: {
            addressLine1: "Model Town Phase 2",
            city: "Abohar",
            state: "Punjab",
            postalCode: "152116",
          },
          paymentMethod: "UPI_MANUAL",
          items: [{ variantId: testVariantId, quantity: neededQty }],
          idempotencyKey: testIdempotencyKey,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toMatch(/^TNL-\d{8}-\d{4}$/);
      expect(res.body.data.orderAccessToken).toBeDefined();
      expect(res.body.data.subtotal).toBeGreaterThanOrEqual(999);
      expect(res.body.data.deliveryCharge).toBe(60);
      expect(res.body.data.totalAmount).toBe(res.body.data.subtotal + 60);
      expect(res.body.data.paymentStatus).toBe("PENDING_VERIFICATION");

      createdOrderNumber = res.body.data.orderNumber;
      createdAccessToken = res.body.data.orderAccessToken;
    });

    it("should be idempotent: identical idempotencyKey returns existing order without creating duplicate", async () => {
      const neededQty = Math.ceil(999 / testVariantPrice);

      const res = await request(app)
        .post("/api/v1/orders")
        .send({
          customer: {
            fullName: "Simran Sharma",
            phone: "9812345678",
            email: "simran@example.com",
          },
          shippingAddress: {
            addressLine1: "Model Town Phase 2",
            city: "Abohar",
            state: "Punjab",
            postalCode: "152116",
          },
          paymentMethod: "UPI_MANUAL",
          items: [{ variantId: testVariantId, quantity: neededQty }],
          idempotencyKey: testIdempotencyKey,
        });

      expect(res.status).toBe(200); // 200 for idempotent return
      expect(res.body.data.orderNumber).toBe(createdOrderNumber);
    });

    it("should retrieve persistent order details when valid security token is provided", async () => {
      const res = await request(app).get(`/api/v1/orders/${createdOrderNumber}?token=${createdAccessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toBe(createdOrderNumber);
      expect(res.body.data.items.length).toBeGreaterThan(0);
    });

    it("should reject order retrieval without valid security token (protects customer PII)", async () => {
      const invalidToken = "00000000-0000-0000-0000-000000000000";
      const res = await request(app).get(`/api/v1/orders/${createdOrderNumber}?token=${invalidToken}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should record customer-claimed UTR without prematurely marking payment as PAID", async () => {
      const res = await request(app)
        .patch(`/api/v1/orders/${createdOrderNumber}/utr?token=${createdAccessToken}`)
        .send({ utr: "UTR9876543210AB" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.verificationStatus).toBe("UTR_SUBMITTED");
      expect(res.body.data.paymentStatus).toBe("PENDING_VERIFICATION"); // Still unverified!
    });
  });

  describe("Owner Operations Security & Status Management", () => {
    it("should reject unauthorized owner access without secret header", async () => {
      const res = await request(app).get("/api/v1/owner/orders");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("should list orders when valid x-owner-secret is provided", async () => {
      const res = await request(app)
        .get("/api/v1/owner/orders")
        .set("x-owner-secret", env.OWNER_SECRET_KEY);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});

