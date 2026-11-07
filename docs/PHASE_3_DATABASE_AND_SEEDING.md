# The Nail Lounge — Phase 3 Database & Seeding Architecture

## 1. PostgreSQL 18 Migration History

The database schema is managed via Prisma Migrate against the dedicated development database `the_nail_lounge` running on PostgreSQL 18.

| Migration Name | Applied At | Nature | Changes |
|---|---|---|---|
| `20261106000000_init` | 2026-11-07 05:20 UTC | Baseline | Created 18 core tables (products, variants, inventory, categories, collections, cart, orders, etc.) |
| `20261107062343_catalogue_enhancements` | 2026-11-07 06:23 UTC | Additive / Non-destructive | 1. Removed unverified countryOfOrigin default<br>2. Added `brand` column (`VARCHAR(100)`) to `products`<br>3. Added `isPublished` boolean column to `products` with index<br>4. Added `isPublished` boolean column to `product_variants` with index<br>5. Added `tagline` column (`VARCHAR(255)`) to `collections` |

Current migration status:
```text
2 migrations found in prisma/migrations
Database schema is up to date!
```

---

## 2. Seed Data Architecture

### 2.1 Production Safety Rails
The seed script (`backend/prisma/seed.ts`) incorporates strict safety gates to prevent accidental execution against production databases:
1. **Environment Gate**: Aborts if `NODE_ENV === "production"` unless explicitly overridden with `ALLOW_PRODUCTION_SEED === "true"`.
2. **Host Gate**: Rejects databases hosted on known cloud/managed providers (RDS, Neon, Supabase, Railway) unless specifically permitted.
3. **Graceful Error Recovery**: Tracks failed records per entity and reports structured diagnostic summaries upon completion.

### 2.2 Seeding Command
```bash
# From workspace root:
npm run seed:backend

# From backend directory:
npm run seed
```

### 2.3 Fixture Breakdown
The development fixture dataset contains 36 high-fidelity products across 5 e-commerce categories:

1. **Press-on Nails (18 products)**: Multi-size 24-piece sets and custom 10-piece sets across Almond, Coffin, Square, Oval, and Stiletto shapes; finishes include Glazed Chrome, 3D Gel Art, Cat-Eye Velvet, and French Ombré.
2. **Nail Polish & Gel (5 products)**: High-gloss lacquers, peel-off bases, no-wipe gel top coats, magnetic cat-eye polishes.
3. **Nail Art & Accessories (5 products)**: Chrome powders, Swarovski-style crystals, 3D charms, holographic foil transfers, silicone stamping kits.
4. **Nail-Art Tools (4 products)**: Precision liner brush sets, dual-ended dotting tools, surgical-grade cuticle pushers, portable UV/LED mini curing lamps.
5. **Application & Care Kits (4 products)**: Deluxe prep bundles, extra-strength jelly tabs, brush-on nail glue, nourishing cuticle oil pens.

### 2.4 Idempotency & Verification Evidence
Repeated execution of the seed pipeline produces deterministic, idempotent results:

- **Initial Seeding Run**:
  - Categories: 5 inserted, 0 updated
  - Collections: 4 inserted, 0 updated
  - Products: 36 inserted, 0 updated
  - Variants: 45 inserted/updated
  - Inventory Records: 45 seeded
  - Images: 38 processed
  - Attributes: 96 faceted attributes mapped
  - Failed Records: 0

- **Second Seeding Run (Idempotency Check)**:
  - Categories: 0 inserted, 5 updated
  - Collections: 0 inserted, 4 updated
  - Products: 0 inserted, 36 updated
  - Variants: 45 updated
  - Zero duplicate records created
  - Total elapsed time: 641ms

