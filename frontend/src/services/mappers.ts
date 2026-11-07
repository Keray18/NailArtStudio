import {
  Product,
  ProductVariant,
  Collection,
  CategorySlug,
  NailShape,
  NailLength,
  NailFinish,
  ColorFamily,
} from "@/types";

// ============================================================================
// Backend Response DTO Interfaces
// ============================================================================

export interface BackendProductCardDTO {
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

export interface BackendVariantDTO {
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

export interface BackendProductDetailDTO {
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
  variants: BackendVariantDTO[];
  attributes: Record<string, string>;
  collections: {
    id: string;
    name: string;
    slug: string;
  }[];
  relatedProducts: BackendProductCardDTO[];
}

export interface BackendCollectionSummaryDTO {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  bannerImageUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  productCount: number;
}

export interface BackendCollectionDetailDTO extends BackendCollectionSummaryDTO {
  products: BackendProductCardDTO[];
}

export interface BackendCategorySummaryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  productCount: number;
}

export interface BackendSearchResponseDTO {
  query: string;
  totalProducts: number;
  products: BackendProductCardDTO[];
  matchedCategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

// ============================================================================
// DTO Mappers: Backend -> Frontend Domain Model
// ============================================================================

/**
 * Maps a single backend ProductCardDTO to the frontend Product domain model.
 */
export function mapProductCardToProduct(dto: BackendProductCardDTO): Product {
  const images = dto.primaryImage
    ? [
        {
          id: dto.primaryImage.id,
          url: dto.primaryImage.url,
          altText: dto.primaryImage.altText || dto.name,
          isPrimary: true,
        },
      ]
    : [
        {
          id: "placeholder",
          url: "/placeholder-product.svg",
          altText: dto.name,
          isPrimary: true,
        },
      ];

  // Provide representative variant so client quick-add functions with valid properties
  const representativeVariant: ProductVariant = {
    id: `${dto.id}-primary`,
    sku: dto.sku,
    title: "Standard",
    setType: "STANDARD",
    price: dto.basePrice,
    compareAtPrice: dto.compareAtPrice,
    stock: dto.inStock ? 10 : 0,
    isAvailable: dto.inStock,
  };

  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    slug: dto.slug,
    category: {
      name: dto.category.name,
      slug: dto.category.slug as CategorySlug,
    },
    collections: [],
    shortDescription: dto.shortDescription || "",
    description: dto.shortDescription || "",
    basePrice: dto.basePrice,
    compareAtPrice: dto.compareAtPrice,
    images,
    variants: [representativeVariant],
    attributes: {
      shape: dto.attributes?.shape as NailShape | undefined,
      length: dto.attributes?.length as NailLength | undefined,
      finish: dto.attributes?.finish as NailFinish | undefined,
      colorFamily: dto.attributes?.colorFamily as ColorFamily | undefined,
    },
    isFeatured: dto.isFeatured,
    isNewArrival: false,
    totalStock: dto.inStock ? (dto.isLowStock ? 2 : 10) : 0,
    isAvailable: dto.inStock,
  };
}

/**
 * Maps a full backend ProductDetailDTO to the frontend Product domain model.
 */
export function mapProductDetailToProduct(dto: BackendProductDetailDTO): Product {
  const images =
    dto.images && dto.images.length > 0
      ? dto.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.altText || dto.name,
          isPrimary: img.isPrimary,
        }))
      : [
          {
            id: "placeholder",
            url: "/placeholder-product.svg",
            altText: dto.name,
            isPrimary: true,
          },
        ];

  const variants: ProductVariant[] = dto.variants.map((v) => {
    // Deduce setType and size for Press-on nails
    let setType: "UNIVERSAL_24" | "CUSTOM_10" | "STANDARD" = "STANDARD";
    let size: "XS" | "S" | "M" | "L" | null = null;

    const lowerTitle = v.title.toLowerCase();
    if (lowerTitle.includes("24-piece") || lowerTitle.includes("multi-size") || lowerTitle.includes("universal")) {
      setType = "UNIVERSAL_24";
    } else if (lowerTitle.includes("custom") || lowerTitle.includes("10-piece")) {
      setType = "CUSTOM_10";
    }

    // Check size from options or title
    const sizeOpt = v.options.find(
      (o) => o.optionName.toLowerCase().includes("size") || o.value.match(/^(XS|S|M|L)$/i)
    );
    if (sizeOpt) {
      const match = sizeOpt.value.match(/\b(XS|S|M|L)\b/i);
      if (match) size = match[1].toUpperCase() as "XS" | "S" | "M" | "L";
    } else {
      const titleMatch = v.title.match(/\((XS|S|M|L)\)/i);
      if (titleMatch) size = titleMatch[1].toUpperCase() as "XS" | "S" | "M" | "L";
    }

    return {
      id: v.id,
      sku: v.sku,
      title: v.title,
      setType,
      size,
      shape: (dto.attributes?.shape as NailShape) || null,
      length: (dto.attributes?.length as NailLength) || null,
      finish: (dto.attributes?.finish as string) || null,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      stock: v.availableToSell,
      isAvailable: v.isAvailable && v.inStock,
    };
  });

  const totalStock = dto.variants.reduce((sum, v) => sum + v.availableToSell, 0);
  const isAvailable = dto.variants.some((v) => v.inStock && v.isAvailable);

  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    slug: dto.slug,
    category: {
      name: dto.category.name,
      slug: dto.category.slug as CategorySlug,
    },
    collections: dto.collections ? dto.collections.map((c) => c.slug) : [],
    shortDescription: dto.shortDescription || "",
    description: dto.description || "",
    packageContents: dto.packageContents || undefined,
    applicationGuide: dto.applicationGuide || undefined,
    removalGuide: dto.removalGuide || undefined,
    basePrice: dto.basePrice,
    compareAtPrice: dto.compareAtPrice,
    images,
    variants,
    attributes: {
      shape: dto.attributes?.shape as NailShape | undefined,
      length: dto.attributes?.length as NailLength | undefined,
      finish: dto.attributes?.finish as NailFinish | undefined,
      colorFamily: dto.attributes?.colorFamily as ColorFamily | undefined,
    },
    isFeatured: dto.isFeatured,
    isNewArrival: false,
    totalStock,
    isAvailable,
  };
}

/**
 * Maps a BackendCollectionSummaryDTO to the frontend Collection domain model.
 */
export function mapCollectionSummaryToCollection(dto: BackendCollectionSummaryDTO): Collection {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    tagline: dto.tagline || "",
    description: dto.description || "",
    bannerImage: dto.bannerImageUrl || "/placeholder-product.svg",
    productCount: dto.productCount || 0,
  };
}

