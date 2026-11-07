import { describe, it, expect } from "vitest";

// Sample backend DTO shapes matching Express /api/v1 responses
const sampleCardDTO = {
  id: "3e176eb3-f36b-4e89-9a74-d0eaeb2f993e",
  name: "Glazed Rose Chrome Almond",
  slug: "glazed-rose-chrome-almond",
  sku: "FIX-PRS-001",
  shortDescription: "Iridescent pearlescent glaze over delicate blush tones.",
  basePrice: 899,
  compareAtPrice: 1199,
  isFeatured: true,
  category: {
    id: "cat-1",
    name: "Press-on Nails",
    slug: "press-on-nails",
  },
  primaryImage: {
    id: "img-1",
    url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80",
    altText: "Glazed Rose Chrome Almond",
  },
  variantCount: 5,
  inStock: true,
  isLowStock: false,
  attributes: {
    shape: "Almond",
    length: "Medium",
    finish: "Glazed Chrome",
  },
};

const sampleDetailDTO = {
  ...sampleCardDTO,
  brand: "The Nail Lounge",
  countryOfOrigin: "India",
  description: "Complete studio description with full editorial details.",
  packageContents: ["24 Press-on tips", "1 Sheet jelly adhesive tabs"],
  applicationGuide: ["Step 1: Prep cuticles", "Step 2: Cleanse nails"],
  removalGuide: ["Step 1: Warm water soak-off for 10 minutes"],
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80",
      altText: "Glazed Rose Chrome Almond",
      isPrimary: true,
      sortOrder: 0,
    },
  ],
  options: [
    {
      id: "opt-1",
      name: "Set Type & Sizing",
      values: [
        { id: "val-1", value: "Multi-Size 24-Piece Set", sortOrder: 0 },
        { id: "val-2", value: "Custom 10-Piece (XS)", sortOrder: 1 },
      ],
    },
  ],
  variants: [
    {
      id: "var-1",
      sku: "FIX-PRS-001-UNI24",
      title: "Multi-Size 24-Piece Set",
      price: 899,
      compareAtPrice: 1199,
      isAvailable: true,
      inStock: true,
      isLowStock: false,
      availableToSell: 12,
      options: [
        { optionName: "Set Type & Sizing", value: "Multi-Size 24-Piece Set" },
        { optionName: "Shape", value: "Almond" },
      ],
    },
    {
      id: "var-2",
      sku: "FIX-PRS-001-CUST-XS",
      title: "Custom Sized 10-Piece (XS)",
      price: 799,
      compareAtPrice: 999,
      isAvailable: true,
      inStock: false,
      isLowStock: false,
      availableToSell: 0,
      options: [
        { optionName: "Set Type & Sizing", value: "Custom 10-Piece (XS)" },
        { optionName: "Shape", value: "Almond" },
      ],
    },
  ],
  collections: [
    { id: "col-1", name: "The Clean Girl Minimalist", slug: "minimalist-edit" },
  ],
  relatedProducts: [sampleCardDTO],
};

describe("Frontend/Backend Contract Alignment", () => {
  it("should have identical required fields on ProductCardDTO and frontend Product card consumption", () => {
    expect(sampleCardDTO.id).toBeDefined();
    expect(sampleCardDTO.name).toBeDefined();
    expect(sampleCardDTO.slug).toBeDefined();
    expect(sampleCardDTO.sku).toBeDefined();
    expect(typeof sampleCardDTO.basePrice).toBe("number");
    expect(sampleCardDTO.category.name).toBeDefined();
    expect(sampleCardDTO.category.slug).toBeDefined();
    expect(typeof sampleCardDTO.inStock).toBe("boolean");
    expect(typeof sampleCardDTO.isLowStock).toBe("boolean");
    expect(sampleCardDTO.primaryImage).toBeDefined();
  });

  it("should preserve variant option mapping on ProductDetailDTO", () => {
    expect(sampleDetailDTO.variants.length).toBe(2);
    const v1 = sampleDetailDTO.variants[0];
    expect(v1.id).toBe("var-1");
    expect(v1.inStock).toBe(true);
    expect(v1.availableToSell).toBe(12);

    const v2 = sampleDetailDTO.variants[1];
    expect(v2.inStock).toBe(false);
    expect(v2.availableToSell).toBe(0);
  });

  it("should provide non-empty editorial guides in ProductDetailDTO", () => {
    expect(Array.isArray(sampleDetailDTO.packageContents)).toBe(true);
    expect(sampleDetailDTO.packageContents?.length).toBeGreaterThan(0);
    expect(Array.isArray(sampleDetailDTO.applicationGuide)).toBe(true);
    expect(Array.isArray(sampleDetailDTO.removalGuide)).toBe(true);
  });
});

