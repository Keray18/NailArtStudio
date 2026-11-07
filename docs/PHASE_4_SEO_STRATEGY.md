# The Nail Lounge — Phase 4 SEO & Product Discoverability Strategy

## 1. Overview & Ethical Standards

Phase 4 establishes organic discoverability for The Nail Lounge across search engines and social platforms while maintaining strict ethical merchandising standards:

1. **Zero Fabricated Reviews**: No synthetic 5-star ratings or fabricated customer testimonials appear in metadata or UI.
2. **Authentic Product Attributes**: Structured metadata reflects verified product attributes (dimensions, shape, finish, materials).
3. **No Indexation of Test Deployments**: Search engines are explicitly instructed not to index development fixture builds.

---

## 2. Meta Tag Architecture

### 2.1 Global Layout (`RootLayout`)
```typescript
export const metadata: Metadata = {
  title: {
    default: "The Nail Lounge — Artistry at Your Fingertips",
    template: "%s | The Nail Lounge",
  },
  description: "Affordable, premium-grade handcrafted press-on nails, tools, and salon accessories delivered across India from Abohar, Punjab.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  robots: {
    index: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_DATA_SOURCE === "api",
    follow: true,
  },
};
```

### 2.2 Product Detail Page (`/products/[slug]`)
- **Title**: `<Product Name> | The Nail Lounge`
- **Description**: Excerpted from `product.shortDescription` (or first 160 characters of editorial narrative).
- **Canonical URL**: `https://thenaillounge.in/products/<slug>`
- **OpenGraph**: Image, product title, and category classification for WhatsApp, Instagram, and Pinterest sharing previews.

### 2.3 Category & Collection Pages
- **Category (`/category/[slug]`)**: Dynamic title based on category name (`Press-on Nails | The Nail Lounge`), canonical URL `/category/<slug>`.
- **Collection (`/collections/[slug]`)**: Dynamic title based on curated edit title (`The Bridal & Festive Edit | The Nail Lounge`), collection banner preview image, and canonical URL.

---

## 3. Semantic Heading Hierarchy

Storefront pages maintain strict semantic heading structure:
- `<h1>`: Unique primary page identifier (Product Name, Category Title, or Collection Name).
- `<h2>`: Major sections (e.g., "Trending Handcrafted Styles", "What's Inside the Box", "You May Also Adore").
- `<h3>`: Sub-features or specification headings.
- Visual badges and accents use `<span role="status">` or `<Badge>` primitives to avoid polluting the heading outline.

