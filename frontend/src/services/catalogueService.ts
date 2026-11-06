import { Product, Collection, CategorySlug, NailShape, NailFinish, NailLength } from "@/types";
import { FIXTURE_PRODUCTS, FIXTURE_COLLECTIONS } from "@/data/fixtures";

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
}

export interface ICatalogueService {
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getFeaturedProducts(): Promise<Product[]>;
  getCollections(): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<Collection | null>;
  getProductsByCategory(category: CategorySlug): Promise<Product[]>;
  getProductsByCollection(collectionSlug: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  validatePincode(pincode: string): Promise<{ city: string; state: string; isServiceable: boolean; estimatedDays: string }>;
}

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

    return this.products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.shortDescription.toLowerCase().includes(q);
      const matchCat = p.category.name.toLowerCase().includes(q);
      const matchShape = p.attributes?.shape?.toLowerCase().includes(q);
      const matchFinish = p.attributes?.finish?.toLowerCase().includes(q);
      return matchName || matchDesc || matchCat || matchShape || matchFinish;
    });
  }

  async validatePincode(pincode: string): Promise<{ city: string; state: string; isServiceable: boolean; estimatedDays: string }> {
    const cleanPin = pincode.trim();
    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      return { city: "", state: "", isServiceable: false, estimatedDays: "" };
    }

    // Deterministic Indian postal regions mapping for prototype
    const prefix = cleanPin.substring(0, 2);
    let state = "Punjab";
    let city = "Abohar";
    let estimatedDays = "2–3 business days";

    if (cleanPin === "152116") {
      city = "Abohar";
      state = "Punjab";
      estimatedDays = "1–2 business days (Local Studio Dispatch)";
    } else if (prefix === "14" || prefix === "15" || prefix === "16") {
      state = "Punjab / Chandigarh";
      city = "Chandigarh / Ludhiana";
      estimatedDays = "2–3 business days";
    } else if (prefix === "11") {
      state = "Delhi NCR";
      city = "New Delhi";
      estimatedDays = "2–4 business days";
    } else if (prefix === "40" || prefix === "41") {
      state = "Maharashtra";
      city = "Mumbai / Pune";
      estimatedDays = "3–5 business days";
    } else if (prefix === "56") {
      state = "Karnataka";
      city = "Bengaluru";
      estimatedDays = "3–5 business days";
    } else {
      state = "India";
      city = "Rest of India";
      estimatedDays = "4–6 business days";
    }

    return {
      city,
      state,
      isServiceable: true,
      estimatedDays,
    };
  }
}

// Singleton export of catalogue service adapter
export const catalogueService: ICatalogueService = new MockCatalogueAdapter();

