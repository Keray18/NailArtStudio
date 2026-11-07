import { describe, it, expect } from "vitest";
import { mediaService } from "../src/modules/media/media.service";

describe("Media Service & Transformations", () => {
  it("should return fallback placeholder url when raw url is empty or falsy", () => {
    const fallback = mediaService.getFallbackPlaceholderUrl();
    expect(mediaService.getOptimizedImageUrl("")).toBe(fallback);
  });

  it("should transform unsplash image URLs with width, format and crop params", () => {
    const unsplashUrl = "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80";
    const optimized = mediaService.getOptimizedImageUrl(unsplashUrl, { width: 600, height: 600 });
    expect(optimized).toContain("w=600");
    expect(optimized).toContain("h=600");
    expect(optimized).toContain("auto=format");
    expect(optimized).toContain("fit=crop");
  });

  it("should return the original URL if not Unsplash and Cloudinary is not configured", () => {
    const plainUrl = "https://cdn.example.com/images/nail-set.jpg";
    const result = mediaService.getOptimizedImageUrl(plainUrl);
    expect(result).toBe(plainUrl);
  });
});

