/**
 * The Nail Lounge — Media Service & Cloudinary Foundation
 * Manages image URL optimization, placeholders, and media metadata.
 * Strictly read-only in Phase 3: No unauthenticated public upload endpoints.
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif";
}

export class MediaService {
  private cloudName: string;
  private isConfigured: boolean;

  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
    this.isConfigured = Boolean(
      this.cloudName && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
    );
  }

  /**
   * Returns whether live Cloudinary credentials are configured.
   */
  public hasCloudinaryConfig(): boolean {
    return this.isConfigured;
  }

  /**
   * Transforms or formats an image URL for optimal responsive delivery.
   * If URL is from Unsplash or local, preserves safe CDN query parameters.
   * If URL is Cloudinary, can apply dynamic f_auto,q_auto,w_* transforms.
   */
  public getOptimizedImageUrl(rawUrl: string, options: ImageOptimizationOptions = {}): string {
    if (!rawUrl) {
      return this.getFallbackPlaceholderUrl();
    }

    // Cloudinary transformation (Only applied if target URL matches configured cloud name)
    if (this.cloudName && rawUrl.includes(`res.cloudinary.com/${this.cloudName}/`)) {
      const parts = rawUrl.split("/upload/");
      if (parts.length === 2) {
        const transforms: string[] = ["f_auto", "q_auto"];
        if (options.width) transforms.push(`w_${options.width}`);
        if (options.height) transforms.push(`h_${options.height}`);
        return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
      }
    }

    // Unsplash parameter transformation
    if (rawUrl.includes("images.unsplash.com")) {
      try {
        const urlObj = new URL(rawUrl);
        if (options.width) urlObj.searchParams.set("w", String(options.width));
        if (options.height) urlObj.searchParams.set("h", String(options.height));
        urlObj.searchParams.set("auto", "format");
        urlObj.searchParams.set("fit", "crop");
        return urlObj.toString();
      } catch {
        return rawUrl;
      }
    }

    return rawUrl;
  }

  /**
   * Safe, designated development placeholder image when no product image is available.
   * Explicitly signals visual reference status so temporary media is not misrepresented
   * as actual inventory photography.
   */
  public getFallbackPlaceholderUrl(): string {
    return "/placeholder-product.svg";
  }
}

export const mediaService = new MediaService();

