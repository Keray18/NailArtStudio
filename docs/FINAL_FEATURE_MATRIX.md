# THE NAIL LOUNGE — COMPREHENSIVE FEATURE MATRIX
**Date:** November 15, 2026  
**Status Key:**  
- **COMPLETE:** Implemented and verified working with runtime evidence  
- **PARTIAL:** Implemented but incomplete or deficient  
- **BROKEN:** Implemented but failing or misconfigured  
- **MISSING:** Not implemented  
- **BLOCKED:** Requires merchant decision, credentials, or real business data  
- **DEFER:** Not necessary for initial launch  

**Priority Key:**  
- **P0:** Launch blocker (Must fix before taking real orders)  
- **P1:** Important for launch (Required for operational launch quality)  
- **P2:** Can be deferred (Post-launch enhancement)  

---

## 1. CATALOGUE, BROWSING & PRODUCT DISCOVERY

| Feature | Status | Evidence | Problem | Required Action | Priority | Estimated Effort |
|---|:---:|---|---|---|:---:|:---:|
| **Dynamic Homepage Merchandising** | COMPLETE | `curl http://localhost:3000/` loads hero, featured products, categories, collections from DB. | Displays outdated prototype banner and misleading free shipping claims. | Update banner copy and remove free shipping claim from announcement bar. | P1 | 30 min |
| **Shop All Product Grid & Pagination** | COMPLETE | `frontend/src/app/shop/page.tsx` renders 36 products with sort & filter sidebar. | Products are fictional development fixtures. | Keep grid; replace fixture dataset with real merchant products. | P0 | (Blocked by data) |
| **Facet & Filter Engine** | COMPLETE | URL query params sync with shape, length, finish, price range, and sort dropdown. | None. Filters work cleanly against Express `/api/v1/products`. | None. Maintain existing functionality. | P2 | 0 min |
| **Thematic Lookbooks / Collections** | COMPLETE | `/collections` and `/collections/[slug]` render active collections with product joins. | None. Slugs (`bridal-festive`, `minimalist-edit`, etc.) load reliably. | Maintain existing functionality. | P2 | 0 min |
| **Category Navigation & Routing** | COMPLETE | `/category/[slug]` renders category hero, metadata, and scoped product list. | None. 5 active categories verified. | Maintain existing functionality. | P2 | 0 min |
| **Product Detail Page (PDP) Experience** | COMPLETE | `/products/[slug]` SSR loads full graph, multi-angle gallery, ATS stock, and related styles. | Shows fictional product details and placeholder materials. | Retain layout; populate real descriptions and specifications. | P0 | (Blocked by data) |
| **Multi-Dimensional Variant Selection** | COMPLETE | `ProductDetailClient.tsx` handles Universal 24-pc vs Custom 10-pc (XS/S/M/L) switching. | None. Price and stock update reactively on variant change. | Maintain existing functionality. | P2 | 0 min |
| **Live Debounced Search** | COMPLETE | `/search` queries backend ILIKE search with keyword highlighting and 0-result states. | None. Clean error catching and query debouncing. | Maintain existing functionality. | P2 | 0 min |
| **Responsive Mobile Navigation** | COMPLETE | Mobile hamburger sheet opens cleanly, links to categories, contact, and FAQ. | None. Accessible and touch-friendly. | Maintain existing functionality. | P2 | 0 min |
| **Branded Product Placeholders** | COMPLETE | `frontend/public/placeholder-product.svg` renders elegantly if image fails or is missing. | None. Verified in SSR test. | Maintain existing functionality. | P2 | 0 min |

---

## 2. CART & MERCHANDISE BUSINESS RULES

| Feature | Status | Evidence | Problem | Required Action | Priority | Estimated Effort |
|---|:---:|---|---|---|:---:|:---:|
| **Cart Drawer UI & Interactions** | PARTIAL | `CartDrawer.tsx` opens upon adding item, supports increment, decrement, and removal. | Imports `FIXTURE_PRODUCTS` directly for impulse tabs and wipes add-ons. | Remove hardcoded fixture import; fetch impulse add-ons dynamically or remove for launch. | P0 | 45 min |
| **Cart Persistence** | COMPLETE | `useCart.tsx` stores serialized items in `localStorage.getItem("tnl_cart")` with schema validation. | None for guest experience. Reconciles invalid items gracefully. | Maintain client cart. | P2 | 0 min |
| **Mandatory ₹999 Minimum Subtotal** | MISSING | `useCart.tsx`, `CartPage.tsx`, and `CheckoutPage.tsx` allow checkout at any amount. | **Violates Requirement A.** Customers can check out with orders < ₹999. | 1. Add `isMinimumSubtotalMet` in `useCart`.<br>2. Disable checkout button if `< 999`.<br>3. Enforce strictly on backend order creation. | P0 | 1 hr 15 min |
| **Minimum Order Progress Feedback** | BROKEN | `FreeShippingMeter.tsx` informs users to "Add ₹X more for Free Shipping". | Misleads customers into thinking ₹999 is a free shipping threshold rather than a hard minimum order. | Replace `FreeShippingMeter` with `MinimumOrderMeter` ("Add ₹X more to reach minimum order requirement"). | P0 | 45 min |
| **Cart Page Coupon Code Form** | PARTIAL | `/cart` contains input that accepts prototype code `STUDIO10` for 10% off. | Coupons are hardcoded in client state with no server validation. | Defer coupon functionality or disable input for 1-day launch to avoid margin leakage. | P1 | 30 min |

---

## 3. DELIVERY CHARGES & WEIGHT CALCULATION

| Feature | Status | Evidence | Problem | Required Action | Priority | Estimated Effort |
|---|:---:|---|---|---|:---:|:---:|
| **Product Weight Data Architecture** | MISSING | `backend/prisma/schema.prisma` has no `weightGrams` on `Product` or `ProductVariant`. | Cannot calculate total parcel weight authoritative for courier billing. | Add `weightGrams Int @default(50)` to `Product` via Prisma migration. | P0 | 45 min |
| **Backend Delivery Charge Calculation** | MISSING | Express backend has no delivery quote service or endpoint. | **Violates Requirement B.** Frontend uses hardcoded flat ₹99 or free shipping. | Implement `POST /api/v1/delivery/quote` calculating parcel weight at ₹60/kg + packaging weight. | P0 | 1 hr 30 min |
| **Packaging Allowance Configuration** | MISSING | Codebase has no packaging allowance setting. | Delivery partner bills for complete packaged weight, not bare product weight. | Add configurable `PACKAGING_WEIGHT_GRAMS = 100` in backend config. | P0 | 20 min |
| **Courier Billing Method Config** | BLOCKED | `policies/shipping` claims flat fees. | Business has not confirmed whether delivery partner bills proportionally (e.g. ₹60 * weight/1000) or rounds up to whole kg. | Make billing method a configurable setting (`PROPORTIONAL` vs `CEIL_KG`) and confirm with merchant. | P0 | 30 min |
| **Customer-Facing Terminology** | BROKEN | UI consistently uses "Shipping charges", "Shipping Fee", and "Free Shipping". | **Violates Requirement B:** Must strictly use "Delivery charges" in all customer-facing text. | Global copy update: replace "Shipping" with "Delivery charges". | P0 | 45 min |
| **Authoritative Pincode Serviceability** | BROKEN | `catalogueService.ts` lines 304–326 uses hardcoded client regex guessing Punjab vs Delhi. | Silently invents delivery promises and service areas. | Replace hardcoded mock with clean delivery form accepting standard 6-digit Indian pincode. | P1 | 45 min |

---

## 4. CHECKOUT & ORDER PERSISTENCE

| Feature | Status | Evidence | Problem | Required Action | Priority | Estimated Effort |
|---|:---:|---|---|---|:---:|:---:|
| **Guest Checkout Form UI** | COMPLETE | `/checkout` captures name, phone, email, address, pincode, city, state. | Functional form UI, but does not submit to backend. | Connect form submission to real backend order API. | P0 | 45 min |
| **Backend Order Creation API** | MISSING | `backend/__tests__/storefrontFlows.test.ts` asserts `POST /api/v1/orders` returns 404. | **Core Blocker.** No customer order is ever persisted to PostgreSQL. | Build `POST /api/v1/orders` controller, service, Zod validator, and atomic Prisma transaction. | P0 | 2 hr 30 min |
| **Server-Side Price & Total Calculation** | MISSING | Only client-side arithmetic currently exists in `useCart.tsx`. | Security risk: client could tamper with product prices or delivery fee. | Compute merchandise subtotal, delivery charges, and total amount exclusively on backend. | P0 | 1 hr 00 min |
| **Stock Lock / Reservation** | MISSING | `orders` table has no transactional deduction of `product_inventories`. | Overselling possible; inventory does not decrement on order. | In order creation transaction, verify ATS stock and decrement `quantity` or increment `reservedQuantity`. | P1 | 45 min |
| **Order Confirmation Persistence** | BROKEN | `/order-confirmation/[orderNumber]` reads from `sessionStorage` and displays prototype warning. | Orders cannot be viewed after session expires or by direct link. | Fetch order summary from backend via `GET /api/v1/orders/:orderNumber?token=...`. | P0 | 1 hr 15 min |
| **Idempotent Order Submission** | MISSING | Rapid multiple clicks on "Confirm Order" can submit duplicate orders. | Risk of accidental duplicate orders and stock locks. | Pass `clientRequestId` / idempotency key or frontend submit button debouncing/disable. | P1 | 30 min |

---

## 5. PAYMENT METHODS & RECONCILIATION

| Feature | Status | Evidence | Problem | Required Action | Priority | Estimated Effort |
|---|:---:|---|---|---|:---:|:---:|
| **Cash on Delivery (COD)** | BLOCKED | Dropdown allows selecting COD. | Merchant has not confirmed whether they can accept COD without pre-verification (high RTO risk). | Confirm with merchant: enable COD with mandatory phone verification, or launch prepaid-only. | P0 | (Blocked by decision) |
| **Manual UPI QR / VPA** | BLOCKED | Radio button says "Simulated UPI". | No real UPI ID (VPA), dynamic QR, or payment instructions provided. | Implement simplest legitimate launch flow: Display Merchant UPI ID/QR with UTR reference field. | P0 | 1 hr 15 min |
| **Third-Party Payment Gateway (Razorpay/Cashfree)**| MISSING | Zero gateway SDKs or webhook routes in codebase. | Full payment gateway integration cannot be done without merchant account credentials and KYC. | Evaluate if merchant has active gateway keys; if not, use manual UPI/COD launch path. | P1 | (Blocked by credentials) |

---

## 6. MERCHANT OPERATIONS & ORDER MANAGEMENT

| Feature | Status | Evidence | Problem | Required Action | Priority | Estimated Effort |
|---|:---:|---|---|---|:---:|:---:|
| **Merchant Order Dashboard** | MISSING | Zero administrative routes or interfaces exist. | Merchant has no way to view incoming orders, customer addresses, or contact info. | Implement lightweight authenticated owner order view (e.g. `/owner/orders` with token/basic auth). | P0 | 2 hr 00 min |
| **Order Status Updates** | MISSING | `Order.status` cannot be changed from `PENDING`. | Merchant cannot update orders to `CONFIRMED`, `SHIPPED`, or `DELIVERED`. | Add simple API endpoint `PATCH /api/v1/owner/orders/:id/status`. | P1 | 45 min |
| **Merchant Order Notifications** | MISSING | No email, SMS, or WhatsApp dispatch triggers. | Merchant must manually refresh dashboard to discover new orders. | Add simple automated WhatsApp dispatch link or email notification to merchant. | P1 | 45 min |
| **Full Merchant CMS** | DEFER | No visual admin for product editing or image upload. | Out of scope for 1-day launch; enterprise CMS unnecessary. | Defer. Use structured seed script or direct DB entry for initial inventory. | P2 | Deferred |

---

## 7. CONTENT, POLICIES & PRODUCTION HARDENING

| Feature | Status | Evidence | Problem | Required Action | Priority | Estimated Effort |
|---|:---:|---|---|---|:---:|:---:|
| **Real Product Inventory Data** | BLOCKED | Database seeded with 36 fictional products (`FIX-PRS-001`, etc.). | Fictional products cannot be sold to real customers. | Merchant must provide real product details (names, prices, stock, weights, images). | P0 | (Blocked by data) |
| **Contact Details Verification** | BROKEN | `contact/page.tsx` uses placeholder phone `+91 98765 43210` and email. | Customers cannot reach real business support. | Replace with genuine merchant phone, WhatsApp number, and support email in `brand.ts`. | P0 | 15 min |
| **Shipping Policy Accuracy** | BROKEN | `policies/shipping` claims free shipping over ₹999 and ₹99 flat delivery. | Contradicts ₹60/kg rate and ₹999 minimum order rule. | Rewrite policy to accurately reflect ₹60/kg delivery charges and ₹999 min order. | P0 | 30 min |
| **Returns & Hygiene Policy** | COMPLETE | `policies/returns` contains standard cosmetic non-returnable hygiene terms. | None. Complies with Indian e-commerce consumer regulations. | Retain as approved. | P2 | 0 min |
| **Internal Development Route Guard** | COMPLETE | `/design-system` returns 404 in production; omitted from footer in production. | None. Verified in previous session. | Retain as approved. | P2 | 0 min |
| **Development Banner Suppression** | COMPLETE | `PrototypeNoticeBanner.tsx` hides when `NODE_ENV === "production"`. | None. Dismissible in dev; suppressed in prod. | Retain as approved. | P2 | 0 min |

