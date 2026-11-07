export interface ProductListQuery {
  page?: number;
  limit?: number;
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  shape?: string;
  length?: string;
  finish?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest";
  q?: string;
}

export interface ProductCardDTO {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  primaryImage: {
    id: string;
    url: string;
    altText: string | null;
  } | null;
  variantCount: number;
  inStock: boolean;
  isLowStock: boolean;
  attributes: Record<string, string>;
}

export interface ProductDetailVariantDTO {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  isAvailable: boolean;
  inStock: boolean;
  isLowStock: boolean;
  availableToSell: number;
  options: {
    optionName: string;
    value: string;
  }[];
}

export interface ProductDetailDTO {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string | null;
  countryOfOrigin: string | null;
  shortDescription: string | null;
  description: string;
  packageContents: string[] | null;
  applicationGuide: string[] | null;
  removalGuide: string[] | null;
  basePrice: number;
  compareAtPrice: number | null;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
  options: {
    id: string;
    name: string;
    values: {
      id: string;
      value: string;
      sortOrder: number;
    }[];
  }[];
  variants: ProductDetailVariantDTO[];
  attributes: Record<string, string>;
  collections: {
    id: string;
    name: string;
    slug: string;
  }[];
  relatedProducts: ProductCardDTO[];
}

