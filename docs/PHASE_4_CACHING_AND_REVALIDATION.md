# The Nail Lounge — Phase 4 Caching, Data Fetching & Revalidation Policy

## 1. Caching Strategy Overview

In e-commerce architectures, balancing search engine crawl performance, initial page delivery speed, and accurate inventory representation is critical. Phase 4 adopts a **Server-Rendered on Demand (SSR)** approach for dynamic catalogue routes.

```
Request ──> Next.js Server (App Router)
                  │
                  ▼
          dynamic = "force-dynamic"
                  │
                  ▼
         HttpCatalogueAdapter ──> Express API (/api/v1) ──> PostgreSQL
                  │
                  ▼
          Fresh HTML & DTOs Delivered to Client
```

---

## 2. Page Fetch Boundaries & Revalidation

| Route | Execution Boundary | Rendering Policy | Rationale |
|---|---|---|---|
| `/` (Homepage) | Server Component | `force-dynamic` | Displays current featured styles, live collection updates, and real-time category counts without requiring a redeployment. |
| `/shop` (Shop All) | Client Component (Suspense) | Client-side fetch on filter change | Dynamic faceted filtering across 6 dimensions with instant UI feedback and URL query synchronization. |
| `/category/[slug]` | Server Component | `force-dynamic` | SEO-optimized initial HTML delivery with category-specific metadata. |
| `/collections` | Server Component | `force-dynamic` | Delivers thematic lookbook metadata with dynamic product count badges. |
| `/collections/[slug]` | Server Component | `force-dynamic` | Curated editorial collection views with associated member products. |
| `/products/[slug]` | Server Component + Client Child | `force-dynamic` | Ensures search engine bots and social crawlers receive authentic metadata while client child manages instant variant switching. |
| `/search` | Client Component (Suspense) | On-demand client fetch | Triggered upon user query submission; supports debounced typing and suggestion chips. |

---

## 3. Network Resilience & Timeout Controls

All network requests dispatched by [frontend/src/services/apiClient.ts](file:///x:/clients/nail%20art/frontend/src/services/apiClient.ts) enforce strict resiliency standards:

1. **AbortController Timeouts**: Default timeout of 8,000ms (`timeoutMs`). If the backend takes longer to respond, the request is cleanly aborted to free up browser and server threads.
2. **Correlation ID Forwarding**: Every request generates an `X-Request-Id` UUID, allowing end-to-end tracing across Next.js and Express backend logs.
3. **Error Classification**: Translates HTTP errors into typed `ApiClientError` classes (`NOT_FOUND`, `VALIDATION_FAILED`, `TIMEOUT_ERROR`, `NETWORK_ERROR`).

---

## 4. Inventory Accuracy Disclosure

- Public customer inventory indicators (`inStock`, `Only X Left`) reflect the Available-to-Sell (ATS) read model at the moment of page fetch.
- Phase 4 does not perform transactional database write locks during catalogue browsing.
- Authoritative reservation locks, optimistic concurrency checks, and order decrement timers are scheduled for **Phase 6 (Checkout & Order Lifecycle)**.

