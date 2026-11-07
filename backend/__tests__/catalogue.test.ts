import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Catalogue Public REST APIs", () => {
  describe("Categories Endpoints", () => {
    it("GET /api/v1/categories - should list all active categories with product counts", async () => {
      const res = await request(app).get("/api/v1/categories");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);

      const pressOn = res.body.data.find((c: any) => c.slug === "press-on-nails");
      expect(pressOn).toBeDefined();
      expect(pressOn.name).toBe("Press-on Nails");
      expect(pressOn.productCount).toBeGreaterThan(0);
      expect(typeof pressOn.sortOrder).toBe("number");
    });

    it("GET /api/v1/categories/:slug - should return category details for valid slug", async () => {
      const res = await request(app).get("/api/v1/categories/press-on-nails");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe("press-on-nails");
      expect(res.body.data.name).toBe("Press-on Nails");
      expect(Array.isArray(res.body.data.children)).toBe(true);
    });

    it("GET /api/v1/categories/:slug - should return 404 for non-existent category", async () => {
      const res = await request(app).get("/api/v1/categories/non-existent-category-slug");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("Collections Endpoints", () => {
    it("GET /api/v1/collections - should list all active collections", async () => {
      const res = await request(app).get("/api/v1/collections");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(4);

      const bridal = res.body.data.find((c: any) => c.slug === "bridal-festive");
      expect(bridal).toBeDefined();
      expect(bridal.name).toBe("The Bridal & Festive Edit");
      expect(bridal.tagline).toBeDefined();
    });

    it("GET /api/v1/collections/:slug - should return collection details with products", async () => {
      const res = await request(app).get("/api/v1/collections/bridal-festive");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe("bridal-festive");
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.products.length).toBeGreaterThan(0);

      const firstProduct = res.body.data.products[0];
      expect(firstProduct.id).toBeDefined();
      expect(typeof firstProduct.basePrice).toBe("number");
      expect(typeof firstProduct.inStock).toBe("boolean");
    });

    it("GET /api/v1/collections/:slug - should return 404 for non-existent collection", async () => {
      const res = await request(app).get("/api/v1/collections/non-existent-collection");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("Products Endpoints", () => {
    it("GET /api/v1/products - should return default paginated products (12 per page, total 36)", async () => {
      const res = await request(app).get("/api/v1/products");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(12);
      expect(res.body.meta.total).toBe(36);
      expect(res.body.meta.totalPages).toBe(3);
      expect(res.body.data.length).toBe(12);

      const item = res.body.data[0];
      expect(item.id).toBeDefined();
      expect(item.name).toBeDefined();
      expect(item.slug).toBeDefined();
      expect(item.sku).toBeDefined();
      expect(typeof item.basePrice).toBe("number");
      expect(item.category).toBeDefined();
      expect(item.category.name).toBeDefined();
      expect(typeof item.inStock).toBe("boolean");
      expect(typeof item.isLowStock).toBe("boolean");
      expect(item.primaryImage).toBeDefined();
    });

    it("GET /api/v1/products - should filter by category", async () => {
      const res = await request(app).get("/api/v1/products?category=press-on-nails&limit=48");

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const item of res.body.data) {
        expect(item.category.slug).toBe("press-on-nails");
      }
    });

    it("GET /api/v1/products - should filter by collection", async () => {
      const res = await request(app).get("/api/v1/products?collection=bridal-festive");

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("GET /api/v1/products - should filter by price range", async () => {
      const min = 500;
      const max = 1000;
      const res = await request(app).get(`/api/v1/products?minPrice=${min}&maxPrice=${max}`);

      expect(res.status).toBe(200);
      for (const item of res.body.data) {
        expect(item.basePrice).toBeGreaterThanOrEqual(min);
        expect(item.basePrice).toBeLessThanOrEqual(max);
      }
    });

    it("GET /api/v1/products - should filter by attribute (shape)", async () => {
      const res = await request(app).get("/api/v1/products?shape=Almond");

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const item of res.body.data) {
        expect(item.attributes.shape?.toLowerCase()).toBe("almond");
      }
    });

    it("GET /api/v1/products - should support price sorting ascending", async () => {
      const res = await request(app).get("/api/v1/products?sort=price-asc&limit=10");

      expect(res.status).toBe(200);
      const prices = res.body.data.map((p: any) => p.basePrice);
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
    });

    it("GET /api/v1/products - should support price sorting descending", async () => {
      const res = await request(app).get("/api/v1/products?sort=price-desc&limit=10");

      expect(res.status).toBe(200);
      const prices = res.body.data.map((p: any) => p.basePrice);
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
      }
    });

    it("GET /api/v1/products/:slug - should return full product details with variants and related products", async () => {
      const res = await request(app).get("/api/v1/products/glazed-rose-chrome-almond");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const prod = res.body.data;
      expect(prod.slug).toBe("glazed-rose-chrome-almond");
      expect(prod.name).toBe("Glazed Rose Chrome Almond");
      expect(prod.brand).toBe("The Nail Lounge");
      expect(prod.countryOfOrigin).toBe("India");
      expect(typeof prod.basePrice).toBe("number");
      expect(Array.isArray(prod.variants)).toBe(true);
      expect(prod.variants.length).toBeGreaterThan(0);

      // Check variant inventory read model
      const firstVariant = prod.variants[0];
      expect(firstVariant.sku).toBeDefined();
      expect(typeof firstVariant.price).toBe("number");
      expect(typeof firstVariant.inStock).toBe("boolean");
      expect(typeof firstVariant.isLowStock).toBe("boolean");
      expect(typeof firstVariant.availableToSell).toBe("number");
      expect(firstVariant.availableToSell).toBeGreaterThanOrEqual(0);

      // Check options
      expect(Array.isArray(prod.options)).toBe(true);

      // Check related products
      expect(Array.isArray(prod.relatedProducts)).toBe(true);
      expect(prod.relatedProducts.length).toBeGreaterThan(0);
      // Related products should not include the current product
      expect(prod.relatedProducts.some((r: any) => r.id === prod.id)).toBe(false);
    });

    it("GET /api/v1/products/:slug - should return 404 for non-existent product", async () => {
      const res = await request(app).get("/api/v1/products/non-existent-product-slug");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("Search Endpoints", () => {
    it("GET /api/v1/search?q=velvet - should find matching products by keyword", async () => {
      const res = await request(app).get("/api/v1/search?q=velvet");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.query).toBe("velvet");
      expect(res.body.data.totalProducts).toBeGreaterThan(0);
      expect(res.body.data.products.length).toBeGreaterThan(0);

      const found = res.body.data.products.some(
        (p: any) =>
          p.name.toLowerCase().includes("velvet") ||
          p.shortDescription?.toLowerCase().includes("velvet")
      );
      expect(found).toBe(true);
    });

    it("GET /api/v1/search?q=nail - should return matching products and matched categories", async () => {
      const res = await request(app).get("/api/v1/search?q=nail");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.products.length).toBeGreaterThan(0);
      expect(res.body.data.matchedCategories.length).toBeGreaterThan(0);
    });

    it("GET /api/v1/search - should return 400 when search query q is missing or empty", async () => {
      const res = await request(app).get("/api/v1/search");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_FAILED");
    });

    it("GET /api/v1/search?q=xyznonexistentterm12345 - should return empty products array without error", async () => {
      const res = await request(app).get("/api/v1/search?q=xyznonexistentterm12345");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalProducts).toBe(0);
      expect(res.body.data.products.length).toBe(0);
    });
  });

  describe("Publication Visibility Gate", () => {
    const testDraftSlug = "test-draft-unpublished-product";

    beforeAll(async () => {
      // Find press-on category
      const cat = await prisma.category.findUnique({ where: { slug: "press-on-nails" } });
      if (cat) {
        await prisma.product.create({
          data: {
            sku: "TEST-UNPUB-001",
            name: "Unpublished Test Draft",
            slug: testDraftSlug,
            categoryId: cat.id,
            basePrice: 999,
            description: "A draft product that should never be visible to the public.",
            isActive: true,
            isPublished: false, // Explicitly unpublished draft
          },
        });
      }
    });

    afterAll(async () => {
      await prisma.product.deleteMany({
        where: { slug: testDraftSlug },
      });
    });

    it("should never return unpublished products in the public product listing", async () => {
      const res = await request(app).get("/api/v1/products?limit=48");
      expect(res.status).toBe(200);
      const slugs = res.body.data.map((p: any) => p.slug);
      expect(slugs.includes(testDraftSlug)).toBe(false);
    });

    it("should return 404 NOT_FOUND when attempting to access an unpublished product by slug", async () => {
      const res = await request(app).get(`/api/v1/products/${testDraftSlug}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("should never return unpublished products in public search results", async () => {
      const res = await request(app).get(`/api/v1/search?q=Unpublished`);
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBe(0);
    });
  });
});
