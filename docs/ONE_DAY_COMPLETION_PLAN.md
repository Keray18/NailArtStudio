# THE NAIL LOUNGE — 1-DAY COMPLETION & LAUNCH EXECUTION PLAN
**Target Launch Window:** 1 Working Day (Estimated Total Engineering: 8.5 Hours)  
**Roles:** Full-Stack Architect, Next.js Engineer, Express/TypeScript Engineer, PostgreSQL/Prisma Engineer, QA Lead  
**Rule:** No implementation shall begin until the business owner reviews and authorizes this plan.  

---

## 1. REALISTIC ASSESSMENT: CAN THE NAIL LOUNGE LAUNCH IN 1 DAY?

**YES — with one crucial caveat:**
- The **technical engineering work** (data model migration, ₹999 minimum enforcement, ₹60/kg delivery calculation, transactional order creation endpoint, and minimal owner dashboard) requires approximately **8.5 hours of focused engineering**.
- However, **a customer-facing launch requires the merchant's inputs** (real products, prices, stock counts, UPI ID, and contact phone). If the merchant provides these inputs during Block 1/2, the site can realistically be fully live and accepting legitimate orders by the end of the day.

---

## 2. CHRONOLOGICAL EXECUTION BLOCKS

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           1-DAY EXECUTION TIMELINE                              │
├───────────────────┬───────────────────────────────────┬──────────────┬──────────┤
│ Block             │ Scope                             │ Duration     │ Schedule │
├───────────────────┼───────────────────────────────────┼──────────────┼──────────┤
│ Block 1 (0.0–1.5h)│ Copy Remediation & Cleanups       │ 1.5 Hours    │ 09:00    │
│ Block 2 (1.5–3.5h)│ Weight Schema, Delivery & ₹999 Min│ 2.0 Hours    │ 10:30    │
│ [Lunch Break]     │ Merchant Input Review             │ 0.5 Hours    │ 12:30    │
│ Block 3 (4.0–6.5h)│ Real Checkout, Orders & Owner UI  │ 2.5 Hours    │ 13:00    │
│ Block 4 (6.5–8.5h)│ Real Inventory Seed & Release QA  │ 2.0 Hours    │ 15:30    │
│ Go-Live (8.5–9.0h)│ Verification & Authorization      │ 0.5 Hours    │ 17:30    │
└───────────────────┴───────────────────────────────────┴──────────────┴──────────┘
```

---

### BLOCK 1: CRITICAL CORRECTIONS & COPY REMEDIATION (1.5 Hours)
*Objective: Eliminate misleading shipping claims, fix terminology to "Delivery charges", and decouple CartDrawer from fixtures.*

#### Task 1.1: Terminology & Announcement Bar Correction
- **Files Involved:**
  - `frontend/src/components/layout/AnnouncementBar.tsx`
  - `frontend/src/components/layout/Header.tsx`
  - `frontend/src/config/brand.ts`
  - `frontend/src/app/policies/shipping/page.tsx`
- **Scope:**
  - Replace "Complimentary shipping on orders above ₹999" with:  
    *"Studio Handcrafted in Abohar • Minimum Merchandise Order ₹999 • Delivery Charges ₹60/kg"*
  - Globally replace customer-facing text "Shipping Fee" / "Shipping charges" with **"Delivery charges"**.
  - Update `policies/shipping` to state accurate delivery rates (₹60/kg) and remove mentions of free shipping.
- **Dependencies:** None. Can be completed immediately without merchant input.
- **Estimated Time:** 30 min.
- **Acceptance Criteria:** Zero occurrences of "Free shipping" or "Shipping charges" in customer-facing UI.

#### Task 1.2: Decouple CartDrawer from Hardcoded Fixtures
- **Files Involved:**
  - `frontend/src/components/cart/CartDrawer.tsx`
- **Scope:**
  - Remove `import { FIXTURE_PRODUCTS } from "@/data/fixtures"`.
  - Remove hardcoded `impulseTabs` and `impulseWipes` lookups.
  - Replace with either a dynamic add-on fetch or cleanly remove the impulse add-on section for Day 1 launch to keep the drawer lean and error-free.
- **Dependencies:** None.
- **Estimated Time:** 30 min.
- **Acceptance Criteria:** `CartDrawer.tsx` has zero imports of `@/data/fixtures`.

#### Task 1.3: Brand Contact Details Configuration
- **Files Involved:**
  - `frontend/src/config/brand.ts`
  - `frontend/src/app/contact/page.tsx`
- **Scope:**
  - Update official WhatsApp number, support email, and studio address based on merchant input (or configurable environment variables `NEXT_PUBLIC_SUPPORT_WHATSAPP`, `NEXT_PUBLIC_SUPPORT_EMAIL`).
- **Dependencies:** Merchant contact info (defaults to Abohar Studio placeholder if pending).
- **Estimated Time:** 30 min.
- **Acceptance Criteria:** Contact page and WhatsApp support links point to valid channels.

---

### BLOCK 2: WEIGHT ARCHITECTURE, DELIVERY CALCULATION & ₹999 MINIMUM (2.0 Hours)
*Objective: Implement database weight modeling, server-side delivery calculation at ₹60/kg, and enforce the ₹999 minimum order rule.*

#### Task 2.1: Database Migration for Product Weight
- **Files Involved:**
  - `backend/prisma/schema.prisma`
  - Migration script: `20261115_add_product_weight`
- **Scope:**
  - Add `weightGrams Int @default(50)` to `Product` model.
  - Add `deliveryCharge Decimal @default(60.00) @db.Decimal(10, 2)` and `parcelWeightGrams Int @default(150)` to `Order` model.
  - Run `npx prisma migrate dev` and verify migration applies non-destructively to existing 36 records.
- **Dependencies:** Task 1.
- **Estimated Time:** 30 min.
- **Acceptance Criteria:** `weightGrams` column present in PostgreSQL products table with default values.

#### Task 2.2: Backend Delivery Charges Quotation Service & API
- **Files Involved:**
  - `backend/src/modules/delivery/delivery.service.ts`
  - `backend/src/modules/delivery/delivery.controller.ts`
  - `backend/src/modules/delivery/delivery.routes.ts`
  - `backend/src/config/env.ts`
- **Scope:**
  - Implement `POST /api/v1/delivery/quote`.
  - Input: `items: [{ variantId: string, quantity: number }]`.
  - Logic: Query authoritative database product weights. Compute:
    $$\text{Merchandise Weight} = \sum (\text{item.quantity} \times \text{product.weightGrams})$$
    $$\text{Total Parcel Weight} = \text{Merchandise Weight} + \text{PACKAGING_WEIGHT_GRAMS (100g)}$$
    $$\text{Delivery Charge} = \text{CalculateRate}(\text{Total Parcel Weight}, \text{RATE\_PER\_KG}=60, \text{BILLING\_METHOD})$$
  - Output: `{ totalWeightGrams, packagingWeightGrams, deliveryCharge, ratePerKg: 60, billingMethod }`.
- **Dependencies:** Task 2.1.
- **Estimated Time:** 45 min.
- **Acceptance Criteria:** Endpoint returns 200 with exact delivery charges and weight breakdown; returns 400 for empty or invalid items.

#### Task 2.3: Frontend & Backend ₹999 Minimum Order Enforcement
- **Files Involved:**
  - `frontend/src/hooks/useCart.tsx`
  - `frontend/src/components/cart/FreeShippingMeter.tsx` -> `MinimumOrderMeter.tsx`
  - `frontend/src/app/cart/page.tsx`
  - `frontend/src/app/checkout/page.tsx`
  - `backend/src/modules/orders/orders.validator.ts`
- **Scope:**
  - In `useCart.tsx`: compute `isMinimumOrderMet = subtotal >= 999` and `amountNeededForMinimum = Math.max(0, 999 - subtotal)`.
  - Replace `FreeShippingMeter` with `MinimumOrderMeter` displaying progress toward ₹999:  
    *"Add ₹X more to meet the ₹999 minimum order requirement."*
  - In `CartPage.tsx` & `CartDrawer.tsx`: Disable "Proceed to Checkout" button when `subtotal < 999`.
  - In `CheckoutPage.tsx`: Guard with redirect to `/cart` if `subtotal < 999`.
  - In Backend: Validate that `subtotal >= 999.00` before creating order.
- **Dependencies:** Task 2.2.
- **Estimated Time:** 45 min.
- **Acceptance Criteria:** It is impossible for a user to place an order below ₹999 on either frontend or backend.

---

### BLOCK 3: GUEST CHECKOUT, ORDER PERSISTENCE & OWNER WORKFLOW (2.5 Hours)
*Objective: Build real transactional order creation in Express, permanent order confirmation, and minimal authenticated owner order review.*

#### Task 3.1: Backend Order Creation API (`POST /api/v1/orders`)
- **Files Involved:**
  - `backend/src/modules/orders/orders.controller.ts`
  - `backend/src/modules/orders/orders.service.ts`
  - `backend/src/modules/orders/orders.repository.ts`
  - `backend/src/modules/orders/orders.routes.ts`
  - `backend/src/modules/orders/orders.validator.ts`
- **Scope:**
  - Endpoint: `POST /api/v1/orders`.
  - Payload validation (Zod):
    - `customer`: fullName (string, min 2), phone (string, 10 digits regex), email (valid email).
    - `shippingAddress`: addressLine1, addressLine2, landmark, city, state, postalCode (6 digits regex).
    - `paymentMethod`: `UPI_DIRECT` | `COD`.
    - `items`: array of `{ variantId: UUID, quantity: Int (>= 1) }`.
  - Atomic Prisma Transaction (`$transaction`):
    1. Query all variants with product and inventory records.
    2. Verify all items exist, are published, and have `availableToSell >= quantity`.
    3. Calculate authoritative `subtotal` using database variant prices.
    4. Assert `subtotal >= 999.00`.
    5. Calculate authoritative parcel weight and `deliveryCharge` at ₹60/kg.
    6. Calculate `totalAmount = subtotal + deliveryCharge`.
    7. Generate human-readable `orderNumber` (`TNL-${Date.now().toString().slice(-6)}`).
    8. Generate unguessable `orderAccessToken` (UUIDv4).
    9. Decrement `product_inventories.quantity` by `quantity`.
    10. Upsert `Customer` by phone/email.
    11. Insert `Order` and `OrderItem` records.
  - Return: `{ orderNumber, orderAccessToken, subtotal, deliveryCharge, totalAmount, status, paymentMethod, createdAt }`.
- **Dependencies:** Block 2.
- **Estimated Time:** 1 hr 15 min.
- **Acceptance Criteria:** Creates genuine PostgreSQL records; decrements stock; returns 400 for subtotal < 999 or insufficient stock.

#### Task 3.2: Storefront Checkout Integration & Persistent Confirmation
- **Files Involved:**
  - `frontend/src/app/checkout/page.tsx`
  - `frontend/src/app/order-confirmation/[orderNumber]/page.tsx`
  - `frontend/src/services/orderService.ts`
  - `backend/src/modules/orders/orders.routes.ts` (GET `/api/v1/orders/:orderNumber`)
- **Scope:**
  - Connect `CheckoutPage.tsx` `handleSubmit` to call backend `POST /api/v1/orders`.
  - On 200 response, clear cart, store `orderAccessToken`, and route to `/order-confirmation/${orderNumber}?token=${orderAccessToken}`.
  - Update `order-confirmation` page to fetch order details from backend via `GET /api/v1/orders/:orderNumber?token=...`.
  - Remove all "Simulated Prototype Confirmation" notices.
  - Render official order receipt, delivery details, and payment instructions:
    - If `UPI_DIRECT`: Display official Merchant UPI ID, QR code, and UTR reference submission box.
    - If `COD`: Display *"Cash on Delivery Confirmed. Our studio will call your phone to verify before dispatch."*
- **Dependencies:** Task 3.1.
- **Estimated Time:** 45 min.
- **Acceptance Criteria:** Order confirmation renders from backend database records. Page reload retains full order information.

#### Task 3.3: Minimal Authenticated Owner Order Review Page
- **Files Involved:**
  - `backend/src/modules/owner/owner.routes.ts`
  - `backend/src/modules/owner/owner.controller.ts`
  - `frontend/src/app/owner/orders/page.tsx`
  - `backend/src/config/env.ts` (`OWNER_SECRET_KEY`)
- **Scope:**
  - Backend: `GET /api/v1/owner/orders` (guarded by Bearer token header `x-owner-secret`). Returns orders ordered by `createdAt DESC` with customer details, items, weights, and delivery addresses.
  - Backend: `PATCH /api/v1/owner/orders/:id/status` (updates status to `CONFIRMED`, `SHIPPED`, or `DELIVERED`).
  - Frontend: Simple clean page at `/owner/orders` prompting for owner passcode. Displays:
    - Table of orders with date, order number, customer name, phone, address, items, total, and status.
    - Status dropdown to mark Shipped.
    - "WhatsApp Customer" button opening `https://wa.me/91${phone}?text=Hello...` with prefilled dispatch details.
- **Dependencies:** Task 3.1.
- **Estimated Time:** 30 min.
- **Acceptance Criteria:** Merchant can view incoming orders, inspect delivery addresses, and update status without opening raw database tools.

---

### BLOCK 4: REAL INVENTORY SEEDING & RELEASE QA (2.0 Hours)
*Objective: Replace fictional fixtures with genuine products, execute full automated test suite, and perform production build.*

#### Task 4.1: Real Catalogue Seeding Script
- **Files Involved:**
  - `backend/prisma/seedLaunchCatalogue.ts`
  - `backend/package.json` (`npm run seed:launch`)
- **Scope:**
  - Create idempotent seeding script that ingests the merchant's real launch products (names, categories, prices, stock, weights in grams, and image URLs).
  - Explicitly mark real products as `isPublished: true`.
  - Archive or deactivate fictional fixtures (`isPublished: false`).
- **Dependencies:** Merchant product data from Section 1.
- **Estimated Time:** 45 min.
- **Acceptance Criteria:** `SELECT COUNT(*) FROM products WHERE "isPublished" = true` returns exactly the merchant's real products.

#### Task 4.2: Automated Integration Test Suite Updates
- **Files Involved:**
  - `backend/__tests__/storefrontFlows.test.ts`
  - `backend/__tests__/orders.test.ts` (new)
  - `backend/__tests__/delivery.test.ts` (new)
- **Scope:**
  - Update `storefrontFlows.test.ts` Journey 6 (replace 404 assertion with tests for successful order creation).
  - Add unit/integration tests for:
    - Delivery charges calculation at ₹60/kg.
    - Rejection of orders below ₹999.
    - Successful order placement, stock decrement, and order retrieval by token.
    - Owner order listing authentication guard.
- **Dependencies:** Tasks 3.1, 3.2, 3.3.
- **Estimated Time:** 30 min.
- **Acceptance Criteria:** All test files pass with 0 failures (`npm run test:backend`).

#### Task 4.3: Final Production Build & Responsive Smoke Test
- **Files Involved:**
  - Frontend and Backend build targets.
- **Scope:**
  - Execute `npm run type-check:backend` and `npm run type-check:frontend`.
  - Execute `npm run build:frontend` (`next build`).
  - Verify that `/design-system` returns 404 in production mode.
  - Verify mobile viewports (375px, 414px) and desktop viewports (1280px) across PDP, Cart, Checkout, and Order Confirmation.
- **Dependencies:** All previous tasks.
- **Estimated Time:** 45 min.
- **Acceptance Criteria:** Clean zero-error production build. Customer flows verified end-to-end.

---

## 3. SUMMARY OF EFFORT & TIMELINE

| Block | Focus Area | Engineering Effort | Merchant Dependency? |
|---|---|:---:|:---:|
| **Block 1** | Copy Remediation & Terminology | 1.5 Hours | NO (Can proceed immediately) |
| **Block 2** | Weight Architecture, Delivery & ₹999 Min | 2.0 Hours | Minor (Confirm billing increment) |
| **Block 3** | Guest Checkout, Orders & Owner UI | 2.5 Hours | NO (Uses standard UPI/COD flow) |
| **Block 4** | Real Inventory Seeding & Release QA | 2.0 Hours | **YES (Real product data required)** |
| **Total** | **Full 1-Day Completion** | **8.0 – 8.5 Hours** | **Ready for Execution** |

