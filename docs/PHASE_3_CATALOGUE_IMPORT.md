# The Nail Lounge — Phase 3 Real Catalogue Import Specification

## 1. Overview & Business Context

The Nail Lounge development environment currently uses 36 high-fidelity development fixtures. When the business owner finalizes their real product line, pricing in INR, physical inventory counts in Abohar, and professional photography, this CSV pipeline ingests the real catalogue without downtime or schema migrations.

---

## 2. CSV File Formats & Schemas

The import pipeline accepts two UTF-8 encoded CSV files:

### 2.1 `products_master.csv`
Contains parent product metadata, categorizations, marketing tags, and descriptions.

| Column Header | Type | Required | Description / Example |
|---|---|---|---|
| `handle` | string | YES | Unique slug: `glazed-rose-chrome-almond` |
| `name` | string | YES | Title: `Glazed Rose Chrome Almond` |
| `category_slug` | string | YES | Existing category slug: `press-on-nails` |
| `collections` | string | NO | Pipe-delimited: `minimalist-edit\|bridal-festive` |
| `short_description` | string | NO | Teaser summary (< 500 chars) |
| `description` | string | YES | Markdown/HTML product description |
| `package_contents` | string | NO | Pipe-delimited list of pack items |
| `application_guide` | string | NO | Pipe-delimited step-by-step instructions |
| `removal_guide` | string | NO | Pipe-delimited removal instructions |
| `brand` | string | NO | Defaults to `The Nail Lounge` |
| `country_of_origin` | string | NO | Legal Metrology origin country |
| `is_featured` | boolean | NO | `true` or `false` (default: `false`) |
| `is_published` | boolean | NO | `true` or `false` (default: `true`) |
| `primary_image_url` | string | YES | HTTPS CDN image URL |
| `gallery_image_urls` | string | NO | Pipe-delimited gallery image URLs |
| `shape` | string | NO | Faceted attribute (e.g. `Almond`) |
| `length` | string | NO | Faceted attribute (e.g. `Medium`) |
| `finish` | string | NO | Faceted attribute (e.g. `Glazed Chrome`) |

### 2.2 `variants_inventory.csv`
Contains SKU-level variant options, pricing, and initial stock.

| Column Header | Type | Required | Description / Example |
|---|---|---|---|
| `product_handle` | string | YES | References `handle` in `products_master.csv` |
| `sku` | string | YES | Unique merchant SKU: `TNL-PRS-001-UNI` |
| `title` | string | YES | Variant title: `Multi-Size 24-Piece Set` |
| `price_inr` | decimal | YES | Selling price in INR: `899.00` |
| `compare_at_price_inr` | decimal | NO | MRP/strikethrough price: `1199.00` |
| `stock_quantity` | integer | YES | Initial physical warehouse inventory: `25` |
| `low_stock_threshold` | integer | NO | Default: `3` |
| `option1_name` | string | NO | e.g. `Set Type & Sizing` |
| `option1_value` | string | NO | e.g. `Multi-Size 24-Piece Set` |
| `option2_name` | string | NO | e.g. `Shape` |
| `option2_value` | string | NO | e.g. `Almond` |
| `option3_name` | string | NO | e.g. `Length` |
| `option3_value` | string | NO | e.g. `Medium` |

---

## 3. Validation & Transaction Safety

1. **Pre-flight Dry Run**: Validates all foreign keys, category existence, duplicate SKUs, and required headers before executing any database write.
2. **Atomic Ingestion**: Each product and its variants are inserted/updated within an ACID PostgreSQL transaction block (`prisma.$transaction`).
3. **Idempotent Upsert**: Running the import multiple times with the same handles updates existing records rather than producing duplicates.
4. **Safety from Zero-Inventory Deletions**: Existing variants with historical orders are deactivated (`isActive = false`) rather than hard deleted.

