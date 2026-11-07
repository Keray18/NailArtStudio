# The Nail Lounge — Phase 2: Database Implementation & Schema Guide

**Document Version:** 1.0.0  
**Phase:** Phase 2 (Technical Foundation)  
**Database Engine:** PostgreSQL 14+ (Compatible with PostgreSQL 18)  
**ORM:** Prisma 6.3.0  
**Schema File:** `backend/prisma/schema.prisma`  
**Migration Path:** `backend/prisma/migrations/20261106000000_init/migration.sql`  

---

## 1. Schema Design Philosophy

The database schema is architected to satisfy three critical business demands:
1. **Multi-Category Flexibility:** Accommodates high-complexity press-on nails (shapes, lengths, finishes, custom vs. universal sizing) alongside liquid polishes (volume, shade codes, curing requirements), accessories, nail-art tools, and prep kits.
2. **Immutable Transactional Integrity:** Orders, line items, and addresses are strictly snapshotted at the moment of checkout, ensuring future catalog edits or price updates never mutate historical financial records.
3. **Frictionless Guest Purchasing:** No customer passwords or mandatory registration. Customers are represented as guest entities keyed by phone and email, while orders are protected by cryptographic UUID access tokens (`orderAccessToken`).

---

## 2. Multi-Category Option-Value Architecture

Rather than hardcoding nail-specific columns into the `products` table (which would pollute records for polishes, tools, or kits), the catalog implements a **Normalized Option-Value Pattern**:

```mermaid
erDiagram
    Product ||--|{ ProductOption : "defines (e.g. Size, Shape, Finish)"
    ProductOption ||--|{ ProductOptionValue : "enumerates (e.g. Universal 24, Almond)"
    Product ||--|{ ProductVariant : "has sellable SKUs"
    ProductVariant ||--|{ VariantOptionValue : "maps"
    ProductOptionValue ||--|{ VariantOptionValue : "assigned to"
    ProductVariant ||--|| ProductInventory : "tracks stock"
```

### 2.1 Category Mapping Matrix

| Category | Example Options (`ProductOption`) | Example Values (`ProductOptionValue`) | Faceted Search Attributes (`ProductAttribute`) |
| :--- | :--- | :--- | :--- |
| **Press-on Nails** | `Set Type & Size`, `Shape`, `Finish`, `Length` | `Universal 24-pc`, `Custom 10-pc (M)`, `Almond`, `Chrome Glazed`, `Medium` | `shape=Almond`, `finish=Chrome`, `length=Medium` |
| **Nail Polish & Gel** | `Volume`, `Shade Code` | `15 ml`, `Shade #04 Velvet Rose` | `finish=Glazed`, `curing=UV/LED`, `type=Gel Polish` |
| **Nail Accessories** | `Pack Size`, `Gem Color` | `50 pcs`, `Iridescent Aurora` | `type=Crystals`, `material=Glass` |
| **Nail Art Tools** | `Brush Tip Size`, `Lamp Wattage` | `Fine Line 9mm`, `48W Smart Sensor` | `type=Lamps`, `usage=Professional` |
| **Application & Care Kits** | `Kit Configuration` | `Standard Prep`, `Deluxe Salon Kit` | `type=Prep Kit` |

---

## 3. Entity-Relationship & Model Inventory

### 3.1 Catalog & Merchandising Models

1. **`categories`**
   - Self-referencing hierarchical table via `parentId` (e.g. `press-on-nails` -> `bridal-press-ons`).
   - Indexes: `slug` (unique), `parentId`, composite `(isActive, sortOrder)`.
   - Foreign key constraint: `parentId REFERENCES categories(id) ON DELETE SET NULL`.
2. **`products`**
   - Core product definition: `sku` (unique), `name`, `slug` (unique), `basePrice` (Decimal 10,2), `compareAtPrice` (Decimal 10,2), `countryOfOrigin` (defaults to 'India' for metrology compliance).
   - Long-form markdown content: `packageContents`, `applicationGuide`, `removalGuide`, `materialInfo`.
   - Indexes: `slug`, `categoryId`, composite `(isActive, isFeatured)`, `basePrice`.
3. **`product_images`**
   - Cloudinary CDN media asset: `url`, `publicId`, `altText`, `sortOrder`, `isPrimary`.
   - Cascade delete on product removal.
4. **`product_variants` & `variant_option_values`**
   - Sellable units with dedicated `sku`, `title`, and variant-specific `price` and `compareAtPrice`.
   - Many-to-many relationship with `product_option_values`.
5. **`product_inventories`**
   - 1-to-1 atomic stock tracking for each variant: `quantity`, `reservedQuantity`, `lowStockThreshold`.
   - Prevents stock overselling during simultaneous checkout attempts.
6. **`collections` & `collection_products`**
   - Curated lookbooks (e.g. "Bridal & Wedding", "Festive Glamour").
   - Many-to-many relationship supporting custom sorting per collection.

### 3.2 Customer, Cart & Order Models

1. **`customers`**
   - Guest entity: `phone` (primary contact for Indian WhatsApp & SMS dispatch updates), `email` (optional), `fullName`, `isGuest` (defaults to `true`).
   - Indexes: `phone`, `email`.
2. **`addresses`**
   - Structured Indian delivery addresses: `addressLine1`, `addressLine2`, `landmark`, `city`, `state`, `postalCode` (6-digit Indian PIN code).
   - Cascade delete on customer removal.
3. **`carts` & `cart_items`**
   - Server-side guest cart persistence keyed by unique `sessionToken`.
   - Supports anonymous cart recovery across browser sessions.
4. **`orders`**
   - Financial and logistical order master record.
   - Status Enums:
     - `OrderStatus`: `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`.
     - `PaymentMethod`: `COD` (Cash on Delivery), `ONLINE_MOCK` (Razorpay/UPI simulated).
     - `PaymentStatus`: `PENDING`, `PAID`, `FAILED`, `REFUNDED`.
   - Snapshot field: `shippingAddressSnapshot` stored as native PostgreSQL `JSONB`.
   - Access control: `orderAccessToken` (UUID) ensures guest shoppers can view their receipt (`/order-confirmation/:orderNumber`) without exposing public order scraping vulnerabilities.
5. **`order_items`**
   - Immutable line item snapshots: `productName`, `variantTitle`, `sku`, `unitPrice` (Decimal 10,2), `quantity`, `lineTotal` (Decimal 10,2).

---

## 4. Migration Status & Execution Instructions

### 4.1 Static Verification Status
The Prisma schema has been validated and the migration SQL script generated:
- `npx prisma validate --schema backend/prisma/schema.prisma` -> **PASSED**
- `npx prisma format --schema backend/prisma/schema.prisma` -> **PASSED**
- Client code generation into `backend/node_modules/@prisma/client` -> **PASSED**
- Baseline migration script generated: `backend/prisma/migrations/20261106000000_init/migration.sql` (15,858 bytes).

### 4.2 Applying Migrations to Local PostgreSQL
A PostgreSQL 18 server is detected running locally on port 5432 (`postgresql-x64-18`). To apply the migration against your local database:

1. Create a dedicated database in PostgreSQL:
   ```powershell
   # Using psql with your administrative postgres password
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE the_nail_lounge;"
   ```
2. Create `.env` in `backend/` from `.env.example`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/the_nail_lounge?schema=public"
   ```
3. Execute Prisma migration deploy:
   ```powershell
   npm --prefix backend run prisma:migrate
   ```
   Or run the generated SQL directly:
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d the_nail_lounge -f backend/prisma/migrations/20261106000000_init/migration.sql
   ```

