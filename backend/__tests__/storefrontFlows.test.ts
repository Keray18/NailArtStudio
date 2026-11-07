import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Storefront User Journeys & End-to-End API Integration", () => {
  describe("Journey 1: Homepage Merchandising & Discovery", () => {
    it("should retrieve curated featured products, collections, and categories for the storefront homepage", async () => {
      const [featRes, colRes, catRes] = await Promise.all([
        request(app).get("/api/v1/products?limit=12&sort=featured"),
        request(app).get("/api/v1/collections"),
        request(app).get("/api/v1/categories"),
      ]);

      // Featured products
      expect(featRes.status).toBe(200);
      expect(featRes.body.success).toBe(true);
      expect(featRes.body.data.length).toBeGreaterThanOrEqual(1);
      for (const item of featRes.body.data) {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(typeof item.basePrice).toBe("number");
        expect(item.primaryImage).toBeDefined();
      }

      // Thematic Lookbooks
      expect(colRes.status).toBe(200);
      expect(colRes.body.success).toBe(true);
      expect(colRes.body.data.length).toBeGreaterThanOrEqual(4);
      expect(colRes.body.data[0].tagline).toBeDefined();

      // Categories
      expect(catRes.status).toBe(200);
      expect(catRes.body.success).toBe(true);
      expect(catRes.body.data.length).toBeGreaterThanOrEqual(5);
      const pressOn = catRes.body.data.find((c: any) => c.slug === "press-on-nails");
      expect(pressOn).toBeDefined();
      expect(pressOn.productCount).toBeGreaterThan(0);
    });
  });

  describe("Journey 2: Shop All with Filters & Deterministic Sorting", () => {
    it("should accurately filter and sort products across multiple dimensions", async () => {
      const res = await request(app).get(
        "/api/v1/products?category=press-on-nails&minPrice=500&maxPrice=1200&sort=price-asc&limit=48"
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      // Verify category, price bounds, and monotonic sorting
      let prevPrice = 0;
      for (const item of res.body.data) {
        expect(item.category.slug).toBe("press-on-nails");
        expect(item.basePrice).toBeGreaterThanOrEqual(500);
        expect(item.basePrice).toBeLessThanOrEqual(1200);
        expect(item.basePrice).toBeGreaterThanOrEqual(prevPrice);
        prevPrice = item.basePrice;
      }
    });

    it("should filter by attribute shape", async () => {
      const res = await request(app).get("/api/v1/products?shape=Almond");
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const item of res.body.data) {
        expect(item.attributes.shape?.toLowerCase()).toBe("almond");
      }
    });
  });

  describe("Journey 3: Collection Detail Navigation", () => {
    it("should retrieve collection details and its associated products", async () => {
      const res = await request(app).get("/api/v1/collections/bridal-festive");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe("bridal-festive");
      expect(res.body.data.name).toBe("The Bridal & Festive Edit");
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.products.length).toBeGreaterThan(0);
    });

    it("should return 404 for an invalid collection handle", async () => {
      const res = await request(app).get("/api/v1/collections/invalid-lookbook-xyz");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("Journey 4: Keyword Search Flow", () => {
    it("should return matching products and categories for search term", async () => {
      const res = await request(app).get("/api/v1/search?q=chrome");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.query).toBe("chrome");
      expect(res.body.data.totalProducts).toBeGreaterThan(0);
      expect(res.body.data.products.length).toBeGreaterThan(0);
    });

    it("should return empty result set without crashing when no match exists", async () => {
      const res = await request(app).get("/api/v1/search?q=unobtainiumkeyword123");
      expect(res.status).toBe(200);
      expect(res.body.data.totalProducts).toBe(0);
      expect(res.body.data.products.length).toBe(0);
    });
  });

  describe("Journey 5: Product Detail & Variant Availability", () => {
    it("should retrieve complete product graph with variants, options, and non-negative stock", async () => {
      const res = await request(app).get("/api/v1/products/glazed-rose-chrome-almond");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const product = res.body.data;
      expect(product.slug).toBe("glazed-rose-chrome-almond");
      expect(product.variants.length).toBeGreaterThan(0);

      // Verify variant properties
      for (const variant of product.variants) {
        expect(variant.id).toBeDefined();
        expect(variant.sku).toBeDefined();
        expect(typeof variant.price).toBe("number");
        expect(typeof variant.availableToSell).toBe("number");
        expect(variant.availableToSell).toBeGreaterThanOrEqual(0);
        expect(typeof variant.inStock).toBe("boolean");
        expect(typeof variant.isAvailable).toBe("boolean");
      }

      // Verify related products
      expect(Array.isArray(product.relatedProducts)).toBe(true);
      expect(product.relatedProducts.every((r: any) => r.id !== product.id)).toBe(true);
    });
  });

  describe("Journey 6: Safety Gates — Non-Transactional Status", () => {
    it("should ensure non-existent mutation endpoints return 404 (zero unauthorized checkout mutations)", async () => {
      const postOrderRes = await request(app).post("/api/v1/orders").send({ total: 1000 });
      expect(postOrderRes.status).toBe(404);

      const postCheckoutRes = await request(app).post("/api/v1/checkout").send({});
      expect(postCheckoutRes.status).toBe(404);
    });
  });
});

