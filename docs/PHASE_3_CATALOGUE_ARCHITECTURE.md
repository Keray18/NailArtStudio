# The Nail Lounge — Phase 3 Catalogue Architecture

## 1. System Overview

Phase 3 establishes the database-backed product catalogue, search engine, inventory read models, and media management foundation for **The Nail Lounge** (Abohar, Punjab, India). 

The catalogue architecture strictly adheres to a decoupled, layered design that completely separates presentation, HTTP transport, business domain logic, and persistence concerns.

```
                    ┌────────────────────────────┐
                    │ Next.js Frontend Prototype │
                    │   (MockCatalogueAdapter)   │
                    └────────────────────────────┘
                                  │ (Phase 4 HTTP Migration)
                                  ▼
                    ┌────────────────────────────┐
                    │      Express API Server    │
                    │         (/api/v1)          │
                    └─────────────┬──────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐     ┌──────────────────┐
│ Categories Router│    │ Products Router  │     │ Search Router    │
│   & Controller   │    │   & Controller   │     │   & Controller   │
└────────┬─────────┘    └────────┬─────────┘     └────────┬─────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌──────────────────┐    ┌──────────────────┐     ┌──────────────────┐
│Categories Service│    │ Products Service │     │  Search Service  │
└────────┬─────────┘    └────────┬─────────┘     └────────┬─────────┘
         │                       │                        │
         │              ┌────────┴────────┐               │
         │              ▼                 ▼               │
         │     ┌─────────────────┐ ┌───────────────┐     │
         │     │Inventory Service│ │ Media Service │     │
         │     └─────────────────┘ └───────────────┘     │
         │                       │                        │
         ▼                       ▼                        ▼
┌──────────────────┐    ┌──────────────────┐     ┌──────────────────┐
│Categories Repo   │    │ Products Repo    │     │  Search Repo     │
└────────┬─────────┘    └────────┬─────────┘     └────────┬─────────┘
         │                       │                        │
         └───────────────────────┼────────────────────────┘
                                 ▼
                     ┌───────────────────────┐
                     │   Prisma ORM Client   │
                     └───────────┬───────────┘
                                 ▼
                     ┌───────────────────────┐
                     │ PostgreSQL 18 Server  │
                     │  (the_nail_lounge)    │
                     └───────────────────────┘
```

---

## 2. Layered Responsibilities

| Layer | Responsibility | Isolation Constraints |
|---|---|---|
| **Routers (`*.routes.ts`)** | Route definition, HTTP method mapping, async exception routing to `next(err)`. | Zero business logic; passes control straight to controller. |
| **Validators (`*.validator.ts`)** | Request query/params/body validation using Zod schemas with coercions and bounds. | Pure functional validation; raises operational `AppError` on schema failure. |
| **Controllers (`*.controller.ts`)** | Extracts inputs, triggers validation, invokes domain services, formats standardized HTTP responses (`sendSuccess`). | Zero Prisma or direct database access; no SQL queries. |
| **Domain Services (`*.service.ts`)** | Business logic, DTO mapping, ATS calculation, stock status determination, media URL transforms. | Framework-agnostic pure TypeScript; receives repositories via dependency injection. |
| **Repositories (`*.repository.ts`)** | Database queries via Prisma Client; relation joins, filters, deterministic ordering, pagination. | Returns domain model records or counts; encapsulates all Prisma data access. |
| **Database (`PostgreSQL 18`)** | ACID persistence, referential integrity, unique constraints, foreign keys, and indexes. | Dedicated development database `the_nail_lounge`. |

---

## 3. Module Boundaries

### 3.1 Catalogue Module (`/modules/catalogue`)
- **`categories`**: Manages hierarchical product categories (`press-on-nails`, `nail-polish-gel`, `nail-accessories`, `nail-tools`, `application-kits`). Computes dynamic product counts.
- **`collections`**: Curated marketing groupings (`bridal-festive`, `minimalist-edit`, `midnight-glam`, `everyday-9-to-5`). Supports editorial taglines, banners, and curated product arrays.
- **`products`**: Public product listings with multi-dimensional faceted filtering (shape, length, finish), bounded pagination, multi-key sorting, and comprehensive detail queries with variant option structures and related product recommendations.
- **`search`**: Full-text keyword matching across product name, SKU, short/full descriptions, and attribute values, with complementary category shortcuts.

### 3.2 Inventory Read Model (`/modules/inventory`)
- Calculates Available-to-Sell (`ATS = max(0, physicalQuantity - reservedQuantity)`).
- Determines public customer stock indicators (`inStock`, `isLowStock`, `availableToSell`).
- Strictly read-only: zero mutations or reservation locks executed in Phase 3.

### 3.3 Media Module (`/modules/media`)
- Generates responsive, optimized CDN image URLs with dynamic resizing and format conversion.
- Provides fallback placeholder handling when product assets are missing or during local development without live Cloudinary keys.

---

## 4. Architectural Guarantees & Constraints

1. **Non-Destructive Database Operations**: All schema changes and seeds use additive migrations and idempotent upserts.
2. **Deterministic Pagination**: All paginated queries enforce a secondary sort on `id ASC` to eliminate pagination flicker.
3. **Bounded Result Sets**: Default page limit is 12, hard ceiling is 48 items to prevent Denial-of-Service memory exhaustion.
4. **Zero Frontend Disruption**: Frontend Next.js prototype remains completely untouched and functional via `MockCatalogueAdapter`.

