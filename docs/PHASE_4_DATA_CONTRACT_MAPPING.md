# The Nail Lounge — Phase 4 Data Contract Mapping

## 1. Overview

This document specifies the field-level data contract alignment between the Express REST API (`/api/v1`) response DTOs and the Next.js storefront domain models (`Product`, `ProductVariant`, `Collection`, `CategoryInfo`).

All translations are executed through pure, strongly-typed mapper functions located in [frontend/src/services/mappers.ts](file:///x:/clients/nail%20art/frontend/src/services/mappers.ts).

---

## 2. Product Card Mapping (Catalog & Search Grids)

Used by `GET /api/v1/products`, `GET /api/v1/search`, and collection product listings.

| Backend DTO Field (`ProductCardDTO`) | Backend Type | Frontend Domain Field (`Product`) | Frontend Type | Transformation & Mapping Rule |
|---|---|---|---|---|
| `id` | `UUID string` | `id` | `string` | Direct 1:1 assignment |
| `sku` | `string` | `sku` | `string` | Direct 1:1 assignment |
| `name` | `string` | `name` | `string` | Direct 1:1 assignment |
| `slug` | `string` | `slug` | `string` | Direct 1:1 assignment |
| `basePrice` | `number` | `basePrice` | `number` | Direct 1:1 assignment |
| `compareAtPrice` | `number \| null` | `compareAtPrice` | `number \| null` | Direct 1:1 assignment |
| `isFeatured` | `boolean` | `isFeatured` | `boolean` | Direct 1:1 assignment |
| `category.id` | `UUID string` | — | — | Not required by card UI |
| `category.name` | `string` | `category.name` | `string` | Direct 1:1 assignment |
| `category.slug` | `string` | `category.slug` | `CategorySlug` | Typed string cast |
| `primaryImage.url` | `string` | `images[0].url` | `string` | If null, falls back to `/placeholder-product.svg` |
| `primaryImage.altText`| `string \| null`| `images[0].altText`| `string` | If null, defaults to `product.name` |
| `variantCount` | `number` | — | — | Used for listing badge counts |
| `inStock` | `boolean` | `isAvailable` | `boolean` | Direct 1:1 assignment |
| `isLowStock` | `boolean` | `totalStock` | `number` | Synthesized for ethical badge display: `isLowStock ? 2 : 10` |
| `attributes` | `Record<string, string>` | `attributes` | `Record<string, string>` | Mapped to `{ shape, length, finish, colorFamily }` |
| — | — | `variants` | `ProductVariant[]` | Generates a representative primary variant so storefront quick-add operates seamlessly from catalog cards |

---

## 3. Product Detail Mapping (Full PDP Representation)

Used by `GET /api/v1/products/:slug`.

| Backend DTO Field (`ProductDetailDTO`) | Backend Type | Frontend Domain Field (`Product`) | Frontend Type | Transformation & Mapping Rule |
|---|---|---|---|---|
| `id` | `UUID string` | `id` | `string` | Direct 1:1 assignment |
| `sku` | `string` | `sku` | `string` | Direct 1:1 assignment |
| `name` | `string` | `name` | `string` | Direct 1:1 assignment |
| `slug` | `string` | `slug` | `string` | Direct 1:1 assignment |
| `brand` | `string \| null`| `brand` | `string \| null`| Disclosed in PDP origin metadata |
| `countryOfOrigin` | `string \| null`| `countryOfOrigin` | `string \| null`| Disclosed in PDP Legal Metrology section |
| `shortDescription`| `string \| null`| `shortDescription`| `string` | Defaults to empty string if null |
| `description` | `string` | `description` | `string` | Full markdown/editorial narrative |
| `packageContents` | `string[] \| null`| `packageContents` | `string[] \| undefined`| Array of items inside box |
| `applicationGuide`| `string[] \| null`| `applicationGuide`| `string[] \| undefined`| Step-by-step application instructions |
| `removalGuide` | `string[] \| null`| `removalGuide` | `string[] \| undefined`| Damage-free soak-off guide |
| `basePrice` | `number` | `basePrice` | `number` | Base display price in INR |
| `compareAtPrice` | `number \| null` | `compareAtPrice` | `number \| null` | MRP / strikethrough price in INR |
| `images[]` | `Array` | `images[]` | `ProductImage[]` | Ordered by `isPrimary DESC, sortOrder ASC` |
| `variants[]` | `BackendVariantDTO[]` | `variants[]` | `ProductVariant[]` | See Variant Mapping table below |
| `options[]` | `Array` | `options` | `Array` | Normalized variant option tree |
| `collections[]` | `Array<{ slug }>` | `collections` | `string[]` | Mapped to array of collection slugs |
| `relatedProducts` | `ProductCardDTO[]` | `relatedProducts` | `Product[]` | Mapped via `mapProductCardToProduct` |

### 3.1 Variant Level Mapping

| Backend DTO Field (`BackendVariantDTO`) | Backend Type | Frontend Variant Field (`ProductVariant`) | Transformation Rule |
|---|---|---|---|
| `id` | `UUID string` | `id` | Preserved real database UUID |
| `sku` | `string` | `sku` | Merchant SKU code |
| `title` | `string` | `title` | Variant title (e.g. `Multi-Size 24-Piece Set`) |
| `price` | `number` | `price` | Selling price in INR |
| `compareAtPrice` | `number \| null` | `compareAtPrice` | MRP / compare price |
| `availableToSell`| `number` | `stock` | Calculated $\max(0, \text{qty} - \text{reserved})$ |
| `inStock` & `isAvailable` | `boolean` | `isAvailable` | `inStock && isAvailable` |
| `title` / `options` | — | `setType` | Deduces `UNIVERSAL_24`, `CUSTOM_10`, or `STANDARD` |
| `options` / `title` | — | `size` | Extracts `XS`, `S`, `M`, or `L` if present |

---

## 4. Collection Mapping

Used by `GET /api/v1/collections` and `GET /api/v1/collections/:slug`.

| Backend DTO Field (`CollectionSummaryDTO`) | Frontend Domain Field (`Collection`) | Transformation Rule |
|---|---|---|
| `id` | `id` | UUID string |
| `slug` | `slug` | Kebab-case handle |
| `name` | `name` | Collection title |
| `tagline` | `tagline` | Editorial subtitle |
| `description` | `description` | Thematic narrative |
| `bannerImageUrl` | `bannerImage` | Falls back to `/placeholder-product.svg` if null |
| `productCount` | `productCount` | Dynamic count of associated products |

