export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface SeedCollection {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  bannerImageUrl: string;
  isFeatured: boolean;
  sortOrder: number;
}

export interface SeedVariant {
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isAvailable: boolean;
  isPublished?: boolean;
  options: { name: string; value: string }[];
}

export interface SeedImage {
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface SeedProduct {
  sku: string;
  name: string;
  slug: string;
  categorySlug: string;
  collections: string[];
  shortDescription: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  packageContents?: string[];
  applicationGuide?: string[];
  removalGuide?: string[];
  attributes: Record<string, string>;
  images: SeedImage[];
  variants: SeedVariant[];
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: "Press-on Nails",
    slug: "press-on-nails",
    description: "Handcrafted, reusable salon-grade press-on nails in iconic shapes, lengths, and finishes.",
    sortOrder: 1,
  },
  {
    name: "Nail Polish & Gel",
    slug: "nail-polish-gel",
    description: "High-shine, chip-resistant liquid lacquers, gel top coats, and magnetic cat-eye formulas.",
    sortOrder: 2,
  },
  {
    name: "Nail Art & Accessories",
    slug: "nail-accessories",
    description: "Chrome powders, 3D charms, silicone stamper tools, and Swarovski-style crystal stones.",
    sortOrder: 3,
  },
  {
    name: "Nail-Art Tools",
    slug: "nail-tools",
    description: "Precision detail liner brushes, surgical steel pushers, nano-glass files, and mini UV/LED lamps.",
    sortOrder: 4,
  },
  {
    name: "Application & Care Kits",
    slug: "application-kits",
    description: "Essential prep kits, extra-strength jelly tabs, liquid adhesives, and dehydrating prep wipes.",
    sortOrder: 5,
  },
];

export const SEED_COLLECTIONS: SeedCollection[] = [
  {
    name: "The Bridal & Festive Edit",
    slug: "bridal-festive",
    tagline: "Opulent craftsmanship for milestone celebrations",
    description: "Intricate pearls, Kundan stone embellishments, and shimmering champagne gold finishes designed for wedding celebrations and grand festive moments.",
    bannerImageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: "The Clean Girl Minimalist",
    slug: "minimalist-edit",
    tagline: "Effortless elegance for everyday sophistication",
    description: "Soft glazed chrome finishes, subtle micro-French lines, and warm translucent nudes tailored for understated elegance.",
    bannerImageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200&auto=format&fit=crop",
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: "The Midnight Velvet Suite",
    slug: "midnight-glam",
    tagline: "Deep tones, magnetic cat-eyes & bold glamour",
    description: "Rich dark hues, magnetic dimensional cat-eye effects, and reflective metallics for evening soirees and after-hours glamour.",
    bannerImageUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1200&auto=format&fit=crop",
    isFeatured: true,
    sortOrder: 3,
  },
  {
    name: "The 9-to-5 Executive Suite",
    slug: "everyday-9-to-5",
    tagline: "Durable, salon-perfect nails for the professional",
    description: "Classic squovals, tailored nudes, and low-profile lengths that blend office decorum with modern polish.",
    bannerImageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
    isFeatured: true,
    sortOrder: 4,
  },
];

export { SEED_PRODUCTS } from "./fixtureProducts";

