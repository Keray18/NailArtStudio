# The Nail Lounge — Phase 4 Integration Architecture

## 1. System Integration Overview

Phase 4 establishes real-time HTTP connectivity between the approved Next.js storefront and the Express/PostgreSQL backend catalogue.

```
                    ┌────────────────────────────┐
                    │ Next.js 15 App Router      │
                    │ (Storefront Presentation)  │
                    └─────────────┬──────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌──────────────────────────────┐          ┌──────────────────────────────────┐
│ Server Components (SSR)      │          │ Client Components (Interactive)  │
│ • Homepage (/)               │          │ • Shop All (/shop) [URL Sync]    │
│ • Category Page (/category/) │          │ • PDP Interactive Views          │
│ • Collections (/collections/)│          │ • Search (/search) [Debounced]   │
│ • PDP Container (/products/) │          │ • Cart Drawer (useCart Hook)     │
└──────────────┬───────────────┘          └────────────────┬─────────────────┘
               │                                           │
               └───────────────────┬───────────────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │    CatalogueRepository     │
                    │   (ICatalogueService)      │
                    └──────────────┬─────────────┘
                                   │
                    ┌──────────────┴─────────────┐
                    │ Factory: createCatalogueService()
                    │ (NEXT_PUBLIC_DATA_SOURCE)  │
                    └───────┬────────────┬───────┘
                            │            │
         ┌──────────────────┘            └──────────────────┐
         │ (dataSource === "api")                           │ (dataSource === "mock")
         ▼                                                  ▼
┌──────────────────────────────┐                   ┌──────────────────────────┐
│    HttpCatalogueAdapter      │                   │   MockCatalogueAdapter   │
│  (Real Express REST Client)  │                   │ (Local Static Fixtures)  │
└──────────────┬───────────────┘                   └──────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Express API Server (/api/v1) │
│ • /categories                │
│ • /collections               │
│ • /products                  │
│ • /search                    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ PostgreSQL 18 (the_nail_lounge)
└──────────────────────────────┘
```

---

## 2. Environment Selection & Operational Modes

The catalogue repository is resolved by `createCatalogueService()`:

1. **API Mode (Default / Production Mode)**:
   - Configured via `NEXT_PUBLIC_DATA_SOURCE="api"` (or omitting parameter).
   - Base URL points to `NEXT_PUBLIC_API_URL` (defaulting to `http://localhost:4000/api/v1`).
   - All data fetching queries the live Express backend.
   - **Fail-Fast Policy**: If the backend is unavailable or a network timeout occurs, `HttpCatalogueAdapter` raises a visible `ApiClientError`. It **never** silently falls back to mock fixture data.

2. **Development Mock Mode**:
   - Explicitly enabled via `NEXT_PUBLIC_DATA_SOURCE="mock"`.
   - Strictly prohibited in production builds (`NODE_ENV === "production"` throws a fatal security exception).
   - Retained for offline UI prototyping and component styling tests.

---

## 3. Page-Level Integration Breakdown

### 3.1 Homepage (`/`)
- **Server Component**: Fetches featured products, active categories with live product counts, and curated collections in parallel via `Promise.all`.
- **Empty States**: If a collection has no active styles or featured products are absent, renders an editorial fallback rather than crashing or displaying broken layouts.

### 3.2 Shop All (`/shop`)
- **Client Component with Suspense**: Synchronizes multi-dimensional filters (category, shape, length, finish, price range, in-stock toggle, and sort key) with URL query parameters.
- **Browser Navigation**: Supports browser back/forward buttons, sharing filtered URLs, and bookmarking search queries.

### 3.3 Categories (`/category/[slug]`) & Collections (`/collections/[slug]`)
- **Server Components**: Resolves metadata and member products from backend relationship tables (`Product.categoryId` and `CollectionProduct`).
- **Dynamic SEO**: Produces dedicated OpenGraph tags, canonical URLs, and meta descriptions per entity.

### 3.4 Product Detail Page (`/products/[slug]`)
- **Server Component Wrapper**: Handles initial data fetching, 404 resolution via `notFound()`, and dynamic metadata generation.
- **Client Component (`ProductDetailClient`)**: Manages variant selection, pricing recalculation, and stock checks.
- **Variant Identification**: Guarantees that the selected variant passed to the cart uses the authentic PostgreSQL variant UUID.

### 3.5 Search (`/search`)
- **Client Component**: Connects to `GET /api/v1/search?q=...`.
- **Debounced Interaction**: Submits search queries via URL parameter updates to avoid unbounded network requests on keystrokes.
- **State Handling**: Distinct UX representations for Initial State, Loading Spinners, Matching Results, No Matches Found, and Search Service Outages.

---

## 4. Cart Storefront Compatibility

- The existing prototype cart (`useCart` hook) stores cart items in `localStorage` under `tnl_cart`.
- Reconciles saved entries on mount, stripping corrupted or incomplete records.
- Cart entries maintain real backend product IDs and variant UUIDs.
- **Non-Transactional Guarantee**: The checkout prototype remains explicitly non-transactional. Zero live order mutations or payment captures occur during Phase 4.

