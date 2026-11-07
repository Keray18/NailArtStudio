export interface CollectionSummaryDTO {
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

export interface CollectionDetailDTO extends CollectionSummaryDTO {
  products: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    basePrice: number;
    compareAtPrice: number | null;
    primaryImage: {
      url: string;
      altText: string | null;
    } | null;
    category: {
      name: string;
      slug: string;
    };
    inStock: boolean;
  }[];
}

