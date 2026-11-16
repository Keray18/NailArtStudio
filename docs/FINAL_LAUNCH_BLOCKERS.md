# THE NAIL LOUNGE — FINAL LAUNCH BLOCKERS (P0 AUDIT)
**Date:** November 15, 2026  
**Auditor:** Principal Technical Lead & E-Commerce Product Architect  
**Objective:** Identify every issue that prevents taking legitimate customer orders on launch day.  

---

## 1. BLOCKER TAXONOMY

Launch blockers are strictly categorized into three distinct domains:
1. **Technical Code Blockers:** Gaps in backend endpoints, data contracts, and client enforcement that must be engineered.
2. **Merchant Decision Blockers:** Strategic business rules that only the business owner can decide.
3. **Merchant Data Blockers:** Authoritative inventory details, photos, weights, and contact numbers that the business owner must provide.

---

## 2. DETAILED P0 BLOCKER BREAKDOWN

### Blocker 1: Absence of ₹999 Minimum Order Enforcement
- **Classification:** Technical Code Blocker
- **Severity:** P0 (Fatal commercial risk)
- **Current Code Behavior:** 
  In `frontend/src/app/cart/page.tsx`, `CartDrawer.tsx`, and `checkout/page.tsx`, the checkout button is active whenever `items.length > 0`. A customer can add a single ₹249 item and proceed directly through checkout. Furthermore, there is zero backend validation checking `subtotal >= 999`.
- **Business Impact:** 
  Violates core business viability. With small-batch handcrafted press-ons and Abohar parcel dispatch, orders below ₹999 are commercially unviable.
- **Resolution Strategy:**
  1. Add `isMinimumSubtotalMet = subtotal >= 999` to `useCart.tsx`.
  2. Disable the "Proceed to Guest Checkout" button when `subtotal < 999`, displaying a prominent reminder: *"Minimum merchandise order is ₹999 to proceed."*
  3. Enforce strictly on the backend: reject any order creation request with `400 BAD_REQUEST` (`code: "MINIMUM_ORDER_NOT_MET"`) if the authoritative subtotal is below ₹999.00.

---

### Blocker 2: Delivery Charges Architecture & Weight Modeling
- **Classification:** Technical Code Blocker + Merchant Decision Blocker
- **Severity:** P0 (Fatal financial/logistical risk)
- **Current Code Behavior:**
  1. Database schema (`Product`, `ProductVariant`) has **no weight column**.
  2. Frontend advertises "Complimentary shipping on orders above ₹999" (AnnouncementBar, FreeShippingMeter, CartPage, Policies).
  3. Checkout invents an illustrative flat ₹99 standard fee or ₹198 express fee.
- **Business Reality:**
  The business uses an independent delivery partner charging **₹60 per kilogram**, calculated on total parcel weight (products + packaging allowance). Delivery charges do NOT count toward the ₹999 minimum order.
- **Resolution Strategy:**
  1. **Prisma Schema Update:** Add `weightGrams Int @default(50)` to `products` (or variants).
  2. **Configurable Packaging Allowance:** Add `PACKAGING_WEIGHT_GRAMS = 100` to backend config.
  3. **Authoritative Calculation Endpoint:** Implement `POST /api/v1/delivery/quote` taking variant IDs and quantities, calculating:
     $$\text{Total Weight} = \sum (\text{item.quantity} \times \text{item.weightGrams}) + \text{packagingWeightGrams}$$
  4. **Merchant Decision Required:** Does the courier bill proportionally (e.g. $600\text{g} \to ₹36$) or round up to the next full kilogram (e.g. $600\text{g} \to ₹60$)?
     *Engineered as configurable enum: `BILLING_METHOD = "PROPORTIONAL" | "ROUND_UP_KG"`.*
  5. **Terminology Cleanup:** Rename all customer-facing strings from "Shipping" to **"Delivery charges"**.

---

### Blocker 3: Lack of Backend Order Creation & Persistence
- **Classification:** Technical Code Blocker
- **Severity:** P0 (Fatal functional gap)
- **Current Code Behavior:**
  In `frontend/src/app/checkout/page.tsx` line 114, `handleSubmit` creates a fake string `TNL-DEV-XXXXX`, writes it to the browser's `sessionStorage`, and redirects to `/order-confirmation`.
  The backend route `POST /api/v1/orders` does not exist (verified by test `storefrontFlows.test.ts` which asserts it returns 404).
- **Business Impact:**
  Zero orders are recorded in the database. Customer orders are lost the moment the browser tab is closed. The merchant receives nothing.
- **Resolution Strategy:**
  1. Implement `POST /api/v1/orders` in Express.
  2. Implement Zod validation schema: customer full name, 10-digit phone, email, full address lines, 6-digit postal code, city, state, payment method, cart items array `[{ variantId, quantity }]`.
  3. Execute atomic Prisma transaction:
     - Verify variant existence, active publication, and available stock.
     - Calculate authoritative subtotal using database prices.
     - Enforce `subtotal >= 999.00`.
     - Calculate parcel weight and delivery charges at ₹60/kg.
     - Compute final `totalAmount = subtotal + deliveryCharge`.
     - Generate secure `orderNumber` (`TNL-YYYYMMDD-XXXX`) and UUID `orderAccessToken`.
     - Decrement inventory or increase `reservedQuantity`.
     - Create `Customer`, `Address`, `Order`, and `OrderItem` records.
  4. Return sanitized order summary to frontend.

---

### Blocker 4: Unverified Payment Method & Reconciliation
- **Classification:** Merchant Decision Blocker
- **Severity:** P0 (Fatal financial gap)
- **Current Code Behavior:**
  Checkout presents fake radio buttons: "Cash on Delivery (Simulated)" and "Simulated UPI / Netbanking". Neither connects to a real gateway or merchant account.
- **Business Impact:**
  Customers cannot pay, or will believe they paid when no funds were collected. If unverified COD is offered, the business faces massive Return-To-Origin (RTO) courier costs.
- **Resolution Strategy for 1-Day Launch:**
  The merchant must select one of two legitimate, achievable launch options:
  - **Option A (Simplest & Recommended for 1-Day Launch): Direct UPI VPA / Dynamic QR Code + Order Review:**
    - Customer places order with payment method `UPI_DIRECT`.
    - Order confirmation screen displays official Merchant UPI ID (e.g. `thenaillounge@okhdfcbank`) and dynamic UPI QR code for the exact order total.
    - Customer pays via GPay / PhonePe / Paytm and inputs 12-digit UTR / Transaction Reference.
    - Merchant verifies incoming credit in their banking app and marks order `CONFIRMED`.
  - **Option B: Phone-Verified Cash on Delivery (COD):**
    - Customer places order with payment method `COD`.
    - Order is created with status `PENDING_VERIFICATION`.
    - Merchant calls customer on the submitted 10-digit mobile number before packing to confirm dispatch and delivery address.
  - *Note on Third-Party Gateways (Razorpay/Cashfree):* If the merchant does not already have an approved, KYC-verified merchant account with active API keys, integrating a payment gateway is a multi-day external dependency that will break the 1-day launch window.

---

### Blocker 5: Complete Absence of Merchant Order Visibility
- **Classification:** Technical Code Blocker
- **Severity:** P0 (Fatal operational gap)
- **Current Code Behavior:**
  There is zero administrative or owner interface. Even if orders were written to PostgreSQL, the store owner would have to open pgAdmin or run raw SQL queries on port 5432 to find out who ordered and where to ship!
- **Business Impact:**
  Store owner cannot fulfill orders or communicate with customers.
- **Resolution Strategy:**
  Build a **minimal, secure, authenticated Owner Order Review page**:
  1. Simple frontend route: `/owner/orders` (guarded with a secret access token or HTTP Basic Auth configured via `OWNER_DASHBOARD_SECRET`).
  2. Backend route: `GET /api/v1/owner/orders` returning all orders with customer names, phones, delivery addresses, items ordered, total weights, delivery charges, and order statuses.
  3. Status update toggle: `PATCH /api/v1/owner/orders/:id/status` (e.g. `CONFIRMED`, `SHIPPED`, `DELIVERED`).
  4. WhatsApp 1-click dispatch helper: A button that generates a prefilled WhatsApp message to the customer: *"Hello [Name], your Nail Lounge order [TNL-XXXX] has been dispatched from our Abohar studio!"*

---

### Blocker 6: 36 Fictional Development Products in Database
- **Classification:** Merchant Data Blocker
- **Severity:** P0 (Fatal compliance & customer trust gap)
- **Current Code Behavior:**
  Database contains 36 products seeded from `backend/src/data/fixtureProducts.ts` with fictional SKUs (`FIX-PRS-001`), Unsplash stock photos, and placeholder prices.
- **Business Impact:**
  Selling nonexistent products will result in disputes, chargebacks, and brand damage on day one.
- **Resolution Strategy:**
  1. The merchant must provide their initial launch inventory (e.g. 5 to 15 real handcrafted press-on sets and care kits).
  2. Required data per product: Name, Category, Price, Compare-At Price, Stock quantity per variant/size, Weight in grams, and Product Image URL / high-res photo.
  3. Engineer a dedicated idempotent launch import script: `backend/prisma/seedLaunchCatalogue.ts` to cleanly replace fixtures with genuine merchant goods.

---

### Blocker 7: Misleading Customer-Facing Claims & Prototype Artifacts
- **Classification:** Technical Code Blocker
- **Severity:** P0 (Customer trust & legal compliance)
- **Current Code Behavior:**
  1. Header Announcement Bar: *"Complimentary shipping on orders above ₹999 (Illustrative)"*.
  2. Policies (`policies/shipping`): Claims free shipping above ₹999 and flat ₹99 fee.
  3. Cart Drawer: Hardcoded import `import { FIXTURE_PRODUCTS } from "@/data/fixtures"`.
  4. Contact Page: Uses placeholder phone `+91 98765 43210` and email `support@thenaillounge.in`.
- **Resolution Strategy:**
  1. Update Announcement Bar: *"Studio Handcrafted in Abohar • Minimum Order ₹999 • Delivery at ₹60/kg"*.
  2. Update Shipping Policy to accurately state ₹60/kg delivery charges and ₹999 minimum order.
  3. Remove direct fixture import from `CartDrawer.tsx`.
  4. Update `brand.ts` with genuine merchant phone and support email.

---

## 3. SUMMARY: WHAT CAN BE RESOLVED IN CODE VS WHAT REQUIRES THE OWNER

| Blocker ID | Blocker Description | Can Engineers Fix in Code Today? | Requires Merchant Decision / Data? |
|:---:|---|:---:|:---:|
| **B1** | Enforce ₹999 Minimum Merchandise Order | **YES** (1 hr 15 min) | Merchant confirmed (Mandatory requirement) |
| **B2** | Delivery Charges at ₹60/kg & Weight Schema | **YES** (2 hr 15 min) | Needs decision on billing increment (proportional vs rounded kg) |
| **B3** | Real Backend Order Creation API (`POST /api/v1/orders`) | **YES** (2 hr 30 min) | Fully solvable in code |
| **B4** | Payment Method & Reconciliation | **YES** (1 hr 15 min for UPI/COD flow) | **MERCHANT DECISION REQUIRED:** Approve UPI / COD flow |
| **B5** | Minimal Authenticated Owner Order Dashboard | **YES** (2 hr 00 min) | Fully solvable in code |
| **B6** | Replace Fictional Fixtures with Real Products | Tooling ready (1 hr script) | **MERCHANT DATA REQUIRED:** 5–15 real products, photos, weights |
| **B7** | Fix Misleading Copy & Terminology ("Delivery charges") | **YES** (1 hr 00 min) | Needs real merchant WhatsApp/phone number |

