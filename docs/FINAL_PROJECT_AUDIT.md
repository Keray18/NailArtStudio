# THE NAIL LOUNGE — COMPREHENSIVE REPOSITORY & ARCHITECTURE AUDIT
**Date:** November 15, 2026  
**Auditor Roles:** Principal Full-Stack Engineer, E-Commerce Product Architect, Senior Next.js/React Engineer, Node.js/Express Backend Engineer, PostgreSQL/Prisma Database Architect, Security & Release Engineer  
**Target:** 1-Day Completion Audit & Launch Readiness for The Nail Lounge (Abohar, Punjab, India)  
**Status:** Pre-Implementation Architectural Assessment  

---

## 1. EXECUTIVE SUMMARY & ARCHITECTURE BASELINE

The Nail Lounge is an emerging beauty and nail-art e-commerce business headquartered in Abohar, Punjab, India. The commercial goal is to launch a simple, reliable, aesthetically refined, and trustworthy storefront catering to:
1. Direct beauty consumers seeking handcrafted press-on nails and care sets.
2. Nail artists and beauty enthusiasts purchasing polishes, gels, accessories, and application tools.

### Current System Architecture
- **Frontend:** Next.js 15.5.29 App Router, React 19, TypeScript 5.7, Tailwind CSS 3.4. Decoupled architecture running on `http://localhost:3000`.
- **Backend:** Node.js 26 / Express 4.21, TypeScript 5.7, Zod 3.24, Helmet, CORS, custom Request-ID tracing, Pino logging. Running on `http://localhost:4000`.
- **Database:** PostgreSQL 18.0 on port 5432, Prisma ORM 6.3.0. Schema deployed with 3 migrations; 36 development fixture products currently loaded.
- **Data Contract:** Frontend `HttpCatalogueAdapter` queries Express REST endpoints under `/api/v1` via `ApiClient` (fetch with timeout handling and error mapping).

### Core Audit Finding
The storefront has achieved high visual quality and clean catalogue data-binding for read-only browsing (Homepage, Shop All, Category, Collection, Product Details, and Search). However, **the transaction engine is completely unimplemented**:
1. **Cart & Checkout are purely simulated in browser local storage and session storage.** No orders are sent to or stored in PostgreSQL.
2. **The mandatory minimum order subtotal of ₹999 is not enforced** anywhere—neither on frontend forms nor backend endpoints.
3. **Delivery charges are completely simulated and based on invalid assumptions.** The UI advertises "Complimentary shipping on orders above ₹999" and flat ₹99 fees, whereas the business uses an independent delivery partner charging **₹60/kg** based on total parcel weight.
4. **Product weights in grams do not exist** in the database schema, fixture datasets, or API payloads.
5. **No payment gateway or real payment capture method is configured.**
6. **The merchant has no operational order management interface** to view customer orders or delivery addresses.
7. **The catalogue consists entirely of 36 fictional development fixtures** which cannot be presented as genuine inventory on launch day.

---

## 2. FRONTEND AUDIT: DETAILED ROUTE & COMPONENT INSPECTION

Each route and core component has been inspected against eight strict criteria:
1. **Exists?** File and route present in codebase.
2. **Compiles?** Clean TypeScript build (`tsc --noEmit`) and Next.js compilation (`next build`).
3. **Renders?** Valid HTML generation in SSR and hydration in browser.
4. **Real Data?** Connected to PostgreSQL database via live Express REST APIs.
5. **Functional Interactions?** Clicks, filters, sliders, modals, form inputs operate correctly.
6. **Responsive?** Mobile, tablet, and desktop layouts verified.
7. **Misleading Claims / Placeholders?** Identifies outdated prototype claims or incorrect business promises.
8. **Customer Ready?** Safe to deploy to real paying customers.

| Route / Component | Exists | Compiles | Renders | Real Data | Functional | Responsive | Placeholders / Misleading Claims | Customer Ready? |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|:---:|
| **Homepage (`/`)** | YES | YES | YES | YES | YES | YES | Header displays "Complimentary shipping on orders above ₹999 (Illustrative)". Prototype notice banner rendered. | **NO** (Claims must be fixed) |
| **Shop All (`/shop`)** | YES | YES | YES | YES | YES | YES | Filter drawer, sorting, and price range functional. Shows 36 fictional products. Prototype banner present. | **NO** (Requires real products) |
| **Category Page (`/category/[slug]`)** | YES | YES | YES | YES | YES | YES | Connects to DB categories and filtered products. Prototype banner present. | **NO** (Fictional products) |
| **Collections List (`/collections`)** | YES | YES | YES | YES | YES | YES | Loads 4 lookbooks from DB. Clean card layout. Prototype banner present. | **NO** (Fictional lookbooks) |
| **Collection Detail (`/collections/[slug]`)** | YES | YES | YES | YES | YES | YES | Dynamic SSR loading products in collection. Prototype banner present. | **NO** (Fictional products) |
| **Product Detail (`/products/[slug]`)** | YES | YES | YES | YES | YES | YES | Dynamic metadata, gallery thumbnail switching, variant selection, live stock display. Prototype banner present. | **NO** (Fictional products) |
| **Search Page (`/search`)** | YES | YES | YES | YES | YES | YES | Debounced query calling `/api/v1/search`, keyword highlighting, zero-results empty state. | **NO** (Fictional products) |
| **Cart Drawer (`CartDrawer.tsx`)** | YES | YES | YES | **NO** | YES | YES | **Hardcoded fixture import:** imports `FIXTURE_PRODUCTS` directly for impulse tabs/wipes. Promotes "Free Shipping" over ₹999. | **NO** (Critical fix needed) |
| **Cart Page (`/cart`)** | YES | YES | YES | **NO** | PARTIAL | YES | Pure client localStorage. Displays "Free Shipping Meter" and promo code `STUDIO10`. **Allows checkout below ₹999**. | **NO** (Enforce ₹999 min) |
| **Checkout (`/checkout`)** | YES | YES | YES | **NO** | BROKEN | YES | **Pure simulation in sessionStorage.** Does not post to backend. No ₹999 minimum check. Invented ₹99 express fee. Fake COD / UPI. | **NO** (Blocker) |
| **Order Confirmation (`/order-confirmation/[orderNumber]`)** | YES | YES | YES | **NO** | BROKEN | YES | Reads purely from `sessionStorage`. Displays "Simulated Prototype Confirmation" notice. No server order persistence. | **NO** (Blocker) |
| **Sizing Guide (`/sizing-guide`)** | YES | YES | YES | STATIC | YES | YES | Interactive millimeter calculator for XS/S/M/L nail sizes. Printable chart button. Helpful content. | **YES** |
| **About Us (`/about`)** | YES | YES | YES | STATIC | YES | YES | Abohar studio brand story. Clean editorial typography. Mentions founding location. | **YES** |
| **Contact Us (`/contact`)** | YES | YES | YES | STATIC | PARTIAL | YES | Form triggers client-side `alert()`. Placeholder phone `+91 98765 43210` and email `support@thenaillounge.in`. | **NO** (Need real phone/email) |
| **FAQ Page (`/faq`)** | YES | YES | YES | STATIC | YES | YES | Accordions for wear time, adhesives, damage, water resistance. Accurate nail-care info. | **YES** |
| **Shipping Policy (`/policies/shipping`)** | YES | YES | YES | STATIC | YES | YES | **Misleading:** Claims "free shipping above ₹999" and "standard shipping fee ₹99". Invented courier transit days. | **NO** (Must align with ₹60/kg) |
| **Returns Policy (`/policies/returns`)** | YES | YES | YES | STATIC | YES | YES | Correct cosmetic hygiene policy (non-returnable once opened) with 48h damage replacement terms. | **YES** |
| **Privacy Policy (`/policies/privacy`)** | YES | YES | YES | STATIC | YES | YES | Standard Indian IT Act compliant privacy terms. | **YES** |
| **Terms of Sale (`/policies/terms`)** | YES | YES | YES | STATIC | YES | YES | Legal disclaimer, Abohar jurisdiction, consumer protection rules reference. | **YES** |
| **How to Apply (`/how-to-apply`)** | YES | YES | YES | STATIC | YES | YES | Detailed illustrated guide for jelly tabs vs liquid glue application and removal. | **YES** |
| **Design System (`/design-system`)** | YES | YES | YES | STATIC | YES | YES | Internal tool. Server component returns `notFound()` (404) in production. Omitted from footer in production. | **YES** (Internal only) |
| **Header & Announcement Bar** | YES | YES | YES | STATIC | YES | YES | Announcement bar claims "Complimentary shipping on orders above ₹999". Needs replacement with ₹999 min order notice. | **NO** (Copy fix required) |
| **Footer** | YES | YES | YES | STATIC | YES | YES | Clean responsive 4-column footer. Disables internal link in production. Contains brand disclaimer. | **YES** |
| **Mobile Navigation** | YES | YES | YES | STATIC | YES | YES | Slide-out sheet menu with category shortcuts, contact, and policy links. | **YES** |

---

## 3. BACKEND AUDIT: REST APIS & PERSISTENCE LAYER

### Endpoint Inventory & Status
The Express backend (`backend/src/app.ts`) exposes endpoints under `/api/v1`:

| Method | Route | Module | Purpose | Status | Validation | Database Access | Test Coverage | Security / Architecture Concerns |
|---|---|---|---|:---:|:---:|:---:|:---:|---|
| `GET` | `/health` | Health | Liveness probe (root alias) | COMPLETE | None | None | YES | Redirects to `/api/v1/health` |
| `GET` | `/api/v1/health` | Health | Liveness probe (returns uptime) | COMPLETE | None | None | YES | Public; safe |
| `GET` | `/api/v1/ready` | Health | Readiness probe (pings DB) | COMPLETE | None | `SELECT 1` | YES | Timeout guarded; returns 503 if DB disconnected |
| `GET` | `/api/v1/categories` | Categories | List all active categories with product counts | COMPLETE | None | Prisma `Category.findMany` | YES | Filtered by `isActive: true` |
| `GET` | `/api/v1/categories/:slug` | Categories | Get single category by slug | COMPLETE | Path param | Prisma `Category.findUnique` | YES | Returns 404 for invalid slug |
| `GET` | `/api/v1/collections` | Collections | List all active lookbooks | COMPLETE | None | Prisma `Collection.findMany` | YES | Filtered by `isActive: true` |
| `GET` | `/api/v1/collections/:slug` | Collections | Get single collection with products | COMPLETE | Path param | Prisma `Collection.findUnique` | YES | Returns 404 for invalid slug |
| `GET` | `/api/v1/products` | Products | List/filter products (category, shape, length, price, sort) | COMPLETE | Zod `listProductsSchema` | Prisma `Product.findMany` with count | YES | Enforces `isPublished: true`, limits max 48 items |
| `GET` | `/api/v1/products/:slug` | Products | Full product detail with variants, images, stock | COMPLETE | Path param | Prisma `Product.findUnique` with relations | YES | Enforces `isPublished: true`, calculates ATS stock |
| `GET` | `/api/v1/search` | Search | Keyword search across product names & descriptions | COMPLETE | Zod `searchQuerySchema` | Prisma ILIKE search with joins | YES | Requires `q` param (min 1 char); rejects empty |
| `POST` | `/api/v1/cart/validate` | Cart | Validate cart items, variant prices, stock, and calculate subtotal | **MISSING** | N/A | None | **NO** | Needed to authorize checkout |
| `POST` | `/api/v1/delivery/quote` | Delivery | Authoritative weight & delivery charges quotation | **MISSING** | N/A | None | **NO** | Needed to enforce ₹60/kg rate |
| `POST` | `/api/v1/orders` | Orders | Create and persist genuine guest customer order | **MISSING** | N/A | None | **NO** | **Critical Launch Blocker** |
| `GET` | `/api/v1/orders/:orderNumber` | Orders | Retrieve authenticated order summary by token | **MISSING** | N/A | None | **NO** | Needed for persistent confirmation page |
| `GET` | `/api/v1/owner/orders` | Management | Simple authenticated owner order view | **MISSING** | N/A | None | **NO** | Merchant cannot see customer orders |
| `PATCH` | `/api/v1/owner/orders/:id` | Management | Update order status (CONFIRMED, SHIPPED, etc.) | **MISSING** | N/A | None | **NO** | Merchant cannot mark orders shipped |

### Backend Infrastructure Verification
- **Security Headers:** Configured via `helmet()` with default security headers.
- **CORS Policy:** Strict whitelist checking `FRONTEND_ORIGIN`, `http://localhost:3000`, `http://127.0.0.1:3000`, blocking unapproved origins.
- **Rate Limiting:** In-memory sliding window rate limiter (`100 req/min` per IP), returning standard `429 Too Many Requests` envelope.
- **Error Handling:** Centralized operational `AppError` handling with structured JSON envelopes (`{ success: false, statusCode, error: { code, message, details }, timestamp }`). Production hides internal error stacks.
- **Request Tracing:** `X-Request-Id` header preserved or generated as UUIDv4 and bound to every Pino log line.

---

## 4. DATABASE & PRISMA SCHEMA AUDIT

### Applied Migrations
1. `20261106000000_init`: Base relational schema (categories, products, options, variants, inventory, collections, customers, addresses, orders, order items).
2. `20261107062343_catalogue_enhancements`: Product metadata fields (`materialInfo`, `applicationGuide`, `removalGuide`, `packageContents`).
3. `20261107071648_default_unpublished`: Crucial security gate defaulting `Product.isPublished = false` and `ProductVariant.isPublished = false`.

### Database Schema Deficiencies for Launch
1. **Weight in Grams Missing:**
   - Neither `Product` nor `ProductVariant` contains a `weightGrams` column.
   - Without weight in grams, authoritative delivery calculation at ₹60/kg is impossible.
2. **Delivery Charges Terminology & Weight Snapshot Missing in `orders`:**
   - Table `orders` contains `shippingFee Decimal @default(0.00)`.
   - Table `orders` lacks `deliveryCharge Decimal`, `totalWeightGrams Int`, and `packagingWeightGrams Int`.
3. **Cart Persistence:**
   - Table `carts` and `cart_items` exist in schema but have zero active backend routes or service layer implementation. For a 1-day launch, guest checkout does not require server-side session carts; a stateless order submission endpoint validating cart payloads directly against authoritative product tables is cleaner, faster, and more reliable.

---

## 5. ACTUAL RUNTIME VERIFICATION EVIDENCE

### Process & Port Inspection
Probed active ports using PowerShell `Get-NetTCPConnection`:
- `Port 5432`: PostgreSQL 18.0 (PID 7728) — ACTIVE & LISTENING
- `Port 4000`: Node.js Express Backend (PID 5988) — ACTIVE & LISTENING
- `Port 3000`: Next.js Storefront Server (PID 22768) — ACTIVE & LISTENING
No duplicate processes detected.

### Backend API Live Probes
```
GET http://localhost:4000/api/v1/health   -> HTTP 200 (uptime: 8s)
GET http://localhost:4000/api/v1/ready    -> HTTP 200 (database: connected, latency: 197ms)
GET http://localhost:4000/api/v1/categories -> HTTP 200 (5 categories loaded)
GET http://localhost:4000/api/v1/collections -> HTTP 200 (4 collections loaded)
GET http://localhost:4000/api/v1/products?limit=2 -> HTTP 200 (products loaded with variants & images)
GET http://localhost:4000/api/v1/products/glazed-rose-chrome-almond -> HTTP 200 (full product graph, ATS stock: 12)
GET http://localhost:4000/api/v1/search?q=ruby -> HTTP 200 (matches Kundan Ruby Bridal Coffin)
```

### Storefront Route Live Probes
```
GET http://localhost:3000/                                  -> HTTP 200
GET http://localhost:3000/shop                              -> HTTP 200
GET http://localhost:3000/category/press-on-nails           -> HTTP 200
GET http://localhost:3000/collections                       -> HTTP 200
GET http://localhost:3000/collections/bridal-festive        -> HTTP 200
GET http://localhost:3000/products/glazed-rose-chrome-almond -> HTTP 200
GET http://localhost:3000/search                            -> HTTP 200
GET http://localhost:3000/cart                              -> HTTP 200
GET http://localhost:3000/checkout                          -> HTTP 200
GET http://localhost:3000/order-confirmation/TNL-DEV-12345  -> HTTP 200
GET http://localhost:3000/sizing-guide                      -> HTTP 200
GET http://localhost:3000/about                             -> HTTP 200
GET http://localhost:3000/contact                           -> HTTP 200
GET http://localhost:3000/faq                               -> HTTP 200
GET http://localhost:3000/policies/shipping                 -> HTTP 200
GET http://localhost:3000/policies/returns                  -> HTTP 200
GET http://localhost:3000/policies/privacy                  -> HTTP 200
GET http://localhost:3000/policies/terms                    -> HTTP 200
GET http://localhost:3000/how-to-apply                      -> HTTP 200
GET http://localhost:3000/design-system                     -> HTTP 200 (Dev Mode; guarded in prod)
```

### Automated Vitest Suite
```
RUN v3.2.7 X:/clients/nail art/backend
 ✓ __tests__/inventory.test.ts (6 tests)
 ✓ __tests__/media.test.ts (3 tests)
 ✓ __tests__/contract.test.ts (3 tests)
 ✓ __tests__/env.test.ts (4 tests)
 ✓ __tests__/seedSafety.test.ts (4 tests)
 ✓ __tests__/health.test.ts (4 tests)
 ✓ __tests__/middleware.test.ts (10 tests)
 ✓ __tests__/storefrontFlows.test.ts (9 tests)
 ✓ __tests__/catalogue.test.ts (22 tests)
Test Files: 9 passed | Tests: 65 passed
```

### Manual Verification Boundary Notice
Browser automation tools (e.g. Chrome DevTools protocol driver) were not launched during this audit turn. Visual styling, sticky positioning, responsive drawer open/close transitions, and slider scrubbing have been verified through code inspection and SSR HTML curl validation. End-to-end checkout click-through and form submissions remain subject to manual interactive verification or automated browser testing.

---

## 6. SECURITY & DATA INTEGRITY AUDIT

| Security / Integrity Control | Current Status | Assessment & Vulnerabilities |
|---|:---:|---|
| **Authoritative Server Pricing** | **FAIL** | Storefront cart and checkout calculate totals locally. Because there is no backend order creation endpoint, any client could theoretically submit arbitrary prices. |
| **₹999 Minimum Subtotal Enforcement** | **FAIL** | Completely absent. Users can checkout with a single ₹249 item. Backend has no validation rule for minimum subtotal. |
| **Stock & Variant Validation** | **PARTIAL** | Variant stock is correctly exposed via `/products/:slug` (ATS read model), but checkout does not validate or decrement stock upon order placement. |
| **Delivery Charge Authoritative Calculation** | **FAIL** | Backend has no delivery calculation logic. Frontend uses hardcoded ₹99 or free delivery rules. |
| **Checkout Input Validation** | **PARTIAL** | Frontend has basic regex for 10-digit phone, email, and 6-digit pincode. Backend lacks an order intake Zod schema. |
| **Database Injection & Constraints** | **PASS** | Prisma parameterized queries prevent SQL injection. Schema enforces foreign key constraints and decimal precision. |
| **PII & Customer Data Exposure** | **PASS** | Customer addresses are not exposed via any public GET endpoint. However, order endpoints must use unguessable tokens (`orderAccessToken`). |
| **Exposed Secrets & API Keys** | **PASS** | Checked git tracking and `.env` files. No database passwords or third-party secret tokens are committed. |
| **Rate Limiting** | **PASS** | Global rate limiter active at 100 requests per minute per IP. |
| **Production CORS Whitelist** | **PASS** | Restricted to `env.FRONTEND_ORIGIN` and local development origins. |

---

## 7. CUSTOMER JOURNEY: DESIGN EXPECTATION VS TECHNICAL REALITY

| Step | Expected Customer Journey | Current Technical Reality | Gap Classification |
|:---:|---|---|---|
| **1** | Home: Browse curated lookbooks and new arrivals | Working dynamically from PostgreSQL via API. | COMPLETE |
| **2** | Catalogue: Filter by shape, length, price | Working dynamically with deterministic sorting. | COMPLETE |
| **3** | Product Detail: Select variant (24-pc vs Custom 10) | Working dynamically; live stock displayed. | COMPLETE |
| **4** | Add to Bag: Cart drawer opens with item | Working client-side in React state & localStorage. | COMPLETE (UI) / PARTIAL (Mock add-ons) |
| **5** | Minimum Rule: Enforce ₹999 merchandise subtotal | **NOT ENFORCED.** Button is enabled at any amount. | **CRITICAL GAP (P0)** |
| **6** | Delivery Quote: ₹60/kg based on parcel weight | **NOT CALCULATED.** Shows flat ₹99 or free over ₹999. | **CRITICAL GAP (P0)** |
| **7** | Guest Checkout: Enter name, phone, Abohar/India address | UI exists but saves only to browser `sessionStorage`. | **CRITICAL GAP (P0)** |
| **8** | Payment Selection: Approved payment method | Shows fake COD and Mock UPI with zero gateway or merchant reconciliation path. | **CRITICAL GAP (P0)** |
| **9** | Order Submission: Transactional creation & stock lock | **ENDPOINT DOES NOT EXIST.** Returns 404. | **CRITICAL GAP (P0)** |
| **10** | Order Confirmation: Permanent unique order reference | Reads from session storage; lost if session cleared. Displays simulated prototype notice. | **CRITICAL GAP (P0)** |
| **11** | Merchant Fulfillment: Owner views orders & customer details | **NO OWNER INTERFACE OR ORDER STORAGE.** Merchant is blind to orders. | **CRITICAL GAP (P0)** |

---

## 8. AUDIT CONCLUSION

The Nail Lounge has a solid, well-structured, and aesthetically pleasing foundation for product discovery and browsing. The catalogue layer, PostgreSQL integration, and Next.js App Router setup are production-grade.

However, **the transactional e-commerce engine is completely absent.** The website is currently an interactive visual prototype with a live catalogue viewer. 

To achieve launch readiness in 1 day, the team must implement a lean, robust transaction engine:
1. Enforce ₹999 minimum order merchandise subtotal.
2. Add `weightGrams` and implement server-side delivery calculation at ₹60/kg.
3. Build a real, transactional guest checkout order creation endpoint in Express.
4. Replace simulated order confirmation with authoritative order retrieval.
5. Provide a minimal, secure, authenticated order review mechanism for the merchant.
6. Replace fictional products with real merchant inventory.

