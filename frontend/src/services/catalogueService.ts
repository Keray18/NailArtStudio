import { Product, Collection, CategorySlug, NailShape, NailFinish, NailLength } from "@/types";
import { FIXTURE_PRODUCTS, FIXTURE_COLLECTIONS } from "@/data/fixtures";
import { apiClient, ApiClientError } from "./apiClient";
import {
  BackendProductCardDTO,
  BackendProductDetailDTO,
  BackendCollectionSummaryDTO,
  BackendCollectionDetailDTO,
  BackendCategorySummaryDTO,
  BackendSearchResponseDTO,
  mapProductCardToProduct,
  mapProductDetailToProduct,
  mapCollectionSummaryToCollection,
} from "./mappers";

export interface ProductFilters {
  category?: CategorySlug;
  collection?: string;
  shape?: NailShape;
  length?: NailLength;
  finish?: NailFinish;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: "featured" | "price-asc" | "price-desc" | "newest";
  page?: number;
  limit?: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
}

export interface ICatalogueService {
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getFeaturedProducts(): Promise<Product[]>;
  getCategories(): Promise<CategoryInfo[]>;
  getCollections(): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<Collection | null>;
  getProductsByCategory(category: CategorySlug): Promise<Product[]>;
  getProductsByCollection(collectionSlug: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  validatePincode(pincode: string): Promise<{ city: string; state: string; isServiceable: boolean; estimatedDays: string }>;
}

export type CatalogueRepository = ICatalogueService;

/**
 * Development Mock Adapter
 * Explicitly consumed when NEXT_PUBLIC_DATA_SOURCE="mock".
 */
export class MockCatalogueAdapter implements ICatalogueService {
  private products: Product[] = FIXTURE_PRODUCTS;
  private collections: Collection[] = FIXTURE_COLLECTIONS;

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    let result = [...this.products];

    if (!filters) return result;

    if (filters.category) {
      result = result.filter((p) => p.category.slug === filters.category);
    }

    if (filters.collection) {
      result = result.filter((p) => p.collections.includes(filters.collection!));
    }

    if (filters.shape) {
      result = result.filter((p) => p.attributes?.shape === filters.shape);
    }

    if (filters.length) {
      result = result.filter((p) => p.attributes?.length === filters.length);
    }

    if (filters.finish) {
      result = result.filter((p) => p.attributes?.finish === filters.finish);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.basePrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.basePrice <= filters.maxPrice!);
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.isAvailable && p.totalStock > 0);
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.basePrice - b.basePrice);
          break;
        case "price-desc":
          result.sort((a, b) => b.basePrice - a.basePrice);
          break;
        case "newest":
          result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
          break;
        case "featured":
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return result;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const found = this.products.find((p) => p.slug === slug);
    return found || null;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.products.filter((p) => p.isFeatured && p.isAvailable);
  }

  async getCategories(): Promise<CategoryInfo[]> {
    return [
      { id: "cat-1", name: "Press-on Nails", slug: "press-on-nails", description: "Handcrafted salon-grade press-ons", productCount: 18 },
      { id: "cat-2", name: "Nail Polish & Gel", slug: "nail-polish-gel", description: "High-pigment formulas", productCount: 6 },
      { id: "cat-3", name: "Nail Art & Accessories", slug: "nail-accessories", description: "Chrome powders & accents", productCount: 5 },
      { id: "cat-4", name: "Nail-Art Tools", slug: "nail-tools", description: "Lamps & precision brushes", productCount: 4 },
      { id: "cat-5", name: "Application & Care Kits", slug: "application-kits", description: "Preparation & removal kits", productCount: 3 },
    ];
  }

  async getCollections(): Promise<Collection[]> {
    return this.collections;
  }

  async getCollectionBySlug(slug: string): Promise<Collection | null> {
    const found = this.collections.find((c) => c.slug === slug);
    return found || null;
  }

  async getProductsByCategory(category: CategorySlug): Promise<Product[]> {
    return this.products.filter((p) => p.category.slug === category);
  }

  async getProductsByCollection(collectionSlug: string): Promise<Product[]> {
    return this.products.filter((p) => p.collections.includes(collectionSlug));
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        p.attributes?.shape?.toLowerCase().includes(q) ||
        p.attributes?.finish?.toLowerCase().includes(q)
    );
  }

  async validatePincode(pincode: string): Promise<{ city: string; state: string; isServiceable: boolean; estimatedDays: string }> {
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        city: "",
        state: "",
        isServiceable: false,
        estimatedDays: "",
      };
    }

    const state = cleanPin.startsWith("15") ? "Punjab" : cleanPin.startsWith("11") ? "Delhi" : cleanPin.startsWith("40") ? "Maharashtra" : "India";
    const city = cleanPin.startsWith("152116") ? "Abohar (Local Express)" : cleanPin.startsWith("15") ? "Bathinda / Punjab" : cleanPin.startsWith("11") ? "New Delhi" : "Metro Center";
    const estimatedDays = cleanPin.startsWith("152116") ? "Same Day / Next Day" : cleanPin.startsWith("15") ? "2–3 Business Days" : "3–5 Business Days";

    return {
      city,
      state,
      isServiceable: true,
      estimatedDays,
    };
  }
}

/**
 * Production-ready HTTP Catalogue Adapter.
 * Connects directly to the Express REST API (/api/v1).
 * Never silently falls back to mock fixture data on API failure.
 */
export class HttpCatalogueAdapter implements CatalogueRepository {
  constructor(private client = apiClient) {}

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filters) {
      if (filters.category) params.category = filters.category;
      if (filters.collection) params.collection = filters.collection;
      if (filters.shape) params.shape = filters.shape;
      if (filters.length) params.length = filters.length;
      if (filters.finish) params.finish = filters.finish;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.inStockOnly) params.inStockOnly = true;
      if (filters.sortBy) params.sort = filters.sortBy;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      else params.limit = 48; // Bounded fetch for full catalog views
    }

    const dtos = await this.client.get<BackendProductCardDTO[]>("/products", { params });
    return dtos.map(mapProductCardToProduct);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const cleanSlug = slug.trim().toLowerCase();
      const dto = await this.client.get<BackendProductDetailDTO>(`/products/${cleanSlug}`);
      return mapProductDetailToProduct(dto);
    } catch (error) {
      if (error instanceof ApiClientError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const dtos = await this.client.get<BackendProductCardDTO[]>("/products", {
      params: { limit: 12, sort: "featured" },
    });
    return dtos.filter((d) => d.isFeatured).map(mapProductCardToProduct);
  }

  async getCategories(): Promise<CategoryInfo[]> {
    const dtos = await this.client.get<BackendCategorySummaryDTO[]>("/categories");
    return dtos.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      productCount: c.productCount,
    }));
  }

  async getCollections(): Promise<Collection[]> {
    const dtos = await this.client.get<BackendCollectionSummaryDTO[]>("/collections");
    return dtos.map(mapCollectionSummaryToCollection);
  }

  async getCollectionBySlug(slug: string): Promise<Collection | null> {
    try {
      const cleanSlug = slug.trim().toLowerCase();
      const dto = await this.client.get<BackendCollectionDetailDTO>(`/collections/${cleanSlug}`);
      return mapCollectionSummaryToCollection(dto);
    } catch (error) {
      if (error instanceof ApiClientError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async getProductsByCategory(category: CategorySlug): Promise<Product[]> {
    const dtos = await this.client.get<BackendProductCardDTO[]>("/products", {
      params: { category, limit: 48 },
    });
    return dtos.map(mapProductCardToProduct);
  }

  async getProductsByCollection(collectionSlug: string): Promise<Product[]> {
    const dtos = await this.client.get<BackendProductCardDTO[]>("/products", {
      params: { collection: collectionSlug, limit: 48 },
    });
    return dtos.map(mapProductCardToProduct);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.trim();
    if (!q) return [];

    try {
      const response = await this.client.get<BackendSearchResponseDTO>("/search", {
        params: { q, limit: 48 },
      });
      return response.products.map(mapProductCardToProduct);
    } catch (error) {
      if (error instanceof ApiClientError && error.statusCode === 400) {
        return [];
      }
      throw error;
    }
  }

  async validatePincode(pincode: string): Promise<{ city: string; state: string; isServiceable: boolean; estimatedDays: string }> {
    // Client pincode heuristic for Punjab & Indian metro serviceability
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        city: "",
        state: "",
        isServiceable: false,
        estimatedDays: "",
      };
    }

    const state = cleanPin.startsWith("15") ? "Punjab" : cleanPin.startsWith("11") ? "Delhi" : cleanPin.startsWith("40") ? "Maharashtra" : "India";
    const city = cleanPin.startsWith("152116") ? "Abohar (Local Express)" : cleanPin.startsWith("15") ? "Bathinda / Punjab" : cleanPin.startsWith("11") ? "New Delhi" : "Metro Center";
    const estimatedDays = cleanPin.startsWith("152116") ? "Same Day / Next Day" : cleanPin.startsWith("15") ? "2–3 Business Days" : "3–5 Business Days";

    return {
      city,
      state,
      isServiceable: true,
      estimatedDays,
    };
  }
}

/**
 * Factory for creating the active catalogue repository.
 * In API mode (default), connects directly to Express REST endpoints.
 * Never allows fictional fixtures in a production build.
 */
export function createCatalogueService(): CatalogueRepository {
  const dataSource = (process.env.NEXT_PUBLIC_DATA_SOURCE || "api").toLowerCase();
  const isProduction = process.env.NODE_ENV === "production";

  if (dataSource === "mock") {
    if (isProduction) {
      throw new Error(
        "[SECURITY VIOLATION] MockCatalogueAdapter cannot be activated in a PRODUCTION environment build."
      );
    }
    return new MockCatalogueAdapter();
  }

  return new HttpCatalogueAdapter();
}

// Active singleton repository export
export const catalogueService: CatalogueRepository = createCatalogueService();
