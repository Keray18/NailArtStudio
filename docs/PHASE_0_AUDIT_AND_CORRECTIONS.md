# The Nail Lounge — Phase 0 Audit & Remediation Register
**Document Version:** 1.0.0  
**Audit Date:** 2026-11-06  
**Auditor:** Principal Product Architect, Senior E-Commerce UX Strategist & Technical Lead  
**Scope:** Remediation of Phase 0 Architecture, Requirements, and Specifications  

---

## 1. Executive Summary of Audit

A rigorous inspection of the initial Phase 0 blueprint documents was conducted. While the previous blueprint correctly established an independent frontend/backend architecture, ethical merchandising principles, and multi-page information architecture, it contained several critical deficiencies:
1. **Unsubstantiated Marketing & Sizing Claims:** Prematurely asserted that "universal 24-piece sets guarantee fit for 100% of customers" and made unverified claims regarding "damage-free removal", "reusability up to 3x", and "artisan handcrafted in Abohar".
2. **Conflation of Assumptions with Confirmed Business Facts:** Assumed confirmed inventory models, a ₹999 free shipping threshold, Cash on Delivery (COD) availability, specific courier partnerships (Delhivery/Bluedart), delivery SLAs, and return policies before client approval.
3. **Rigid Catalog Schema:** Imposed press-on specific variant fields (`shape`, `length`, `finish`) directly on generic product variant models, creating structural friction for tools, polishes, and accessories.
4. **Security & State Transition Gaps:** Lacked access controls for guest order confirmation PII, missing TTL on inventory reservations, and open Cloudinary signature generation.
5. **Premature Roadmap Sequencing:** Misaligned engineering milestones by attempting backend database setup before validating the visual and interactive UX prototype.

This document serves as the formal remediation register. All corrections have been applied across the affected architecture documents.

---

## 2. Comprehensive Issue Register

| Issue ID | Severity | Source Document | Problem Description | Business or Technical Impact | Proposed Correction | Correction Status | Remaining Dependency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ISSUE-001** | **CRITICAL** | `PRODUCT_REQUIREMENTS.md`, `CONVERSION_STRATEGY.md`, `UX_WIREFRAMES.md` | Stated that "Universal 24-piece sets guarantee fit for 100% of fingers" and eliminate all sizing anxiety. | Misleading advertising; human nail beds vary widely in C-curve, lateral curvature, and width. 24-piece sets offer higher sizing versatility but cannot guarantee universal fit. | Reframe universal sets as multi-size versatility models that reduce sizing friction; remove "guaranteed fit" and "zero returns" claims. | **CORRECTED** | Client confirmation of packaging models |
| **ISSUE-002** | **HIGH** | `PRODUCT_REQUIREMENTS.md`, `INFORMATION_ARCHITECTURE.md` | Unsubstantiated claims of "damage-free removal", "natural nail safe", "15-minute application", and "lasts 2-3 weeks". | Regulatory and consumer trust risk; poor removal or application techniques can damage natural nails; wear time depends on adhesive chemistry and user activity. | Qualify all claims as dependent on proper prep, application method (tabs vs glue), and gentle removal. Add explicit nail care guidance. | **CORRECTED** | Product testing / laboratory validation |
| **ISSUE-003** | **HIGH** | `PRODUCT_REQUIREMENTS.md`, `INFORMATION_ARCHITECTURE.md`, `UX_WIREFRAMES.md` | Unverified manufacturing claims: "Handcrafted in Abohar", "Studio artisan", "Salon-grade ABS plastic". | Inaccurate origin claims violate consumer protection standards if products are outsourced or machine-finished tips. | Reframe Abohar as the brand's founding design studio and fulfillment hub; distinguish between hand-finished designs and manufactured tools/accessories. | **CORRECTED** | Client disclosure of sourcing & manufacturing model |
| **ISSUE-004** | **HIGH** | `PRODUCT_REQUIREMENTS.md`, `INFORMATION_ARCHITECTURE.md`, `UX_WIREFRAMES.md`, `DATABASE_DESIGN.md` | Assumed commercial policies as confirmed facts: ₹999 free shipping, COD availability, Delhivery/Bluedart couriers, 48-hr damage returns. | Premature implementation of business policies that require logistics contracts, cash flow planning, and legal review. | Document these as illustrative development assumptions; state clearly that commercial policies are pending client sign-off. | **CORRECTED** | Client decision on COD, shipping thresholds & couriers |
| **ISSUE-005** | **MEDIUM** | `PRODUCT_REQUIREMENTS.md` | Specific conversion figures (e.g. ">2.8% CVR", "AOV ₹1,299-₹1,899") presented as guaranteed outcomes. | Unsubstantiated performance claims; sets unvalidated expectations before market testing. | Explicitly label all figures as commercial optimization targets and design benchmarks, not verified forecasts. | **CORRECTED** | None |
| **ISSUE-006** | **HIGH** | `DATABASE_DESIGN.md`, `API_CONTRACT_PLAN.md` | Rigid variant schema: `shape`, `length`, `finish`, `setType` columns placed directly on `ProductVariant`. | Corrupts non-press-on products (tools, polishes, kits) with null or irrelevant attributes; prevents flexible attribute expansion. | Specify an extensible option/attribute model (`ProductOption` and `ProductOptionValue` or structured JSONB attributes) segregated by category. | **CORRECTED** | Backend Phase 2/3 implementation |
| **ISSUE-007** | **HIGH** | `DATABASE_DESIGN.md` | Inventory reservation lacked a Time-To-Live (TTL) mechanism; order states lacked an explicit Finite State Machine (FSM). | Stock could be indefinitely locked by abandoned guest checkouts, causing false out-of-stock states. | Specify a 15-minute TTL reservation window during checkout initiation and an explicit finite state transition table for orders. | **CORRECTED** | Backend Phase 2/3 implementation |
| **ISSUE-008** | **HIGH** | `TECHNICAL_ARCHITECTURE.md`, `API_CONTRACT_PLAN.md` | Unauthenticated Cloudinary upload signature generation endpoint (`GET /api/v1/media/upload-signature`). | High security risk: arbitrary public clients could request signatures and consume storage quotas. | Restrict media upload signature generation to authenticated administrative roles only. | **CORRECTED** | Backend Phase 2/3 implementation |
| **ISSUE-009** | **HIGH** | `API_CONTRACT_PLAN.md`, `DATABASE_DESIGN.md`, `INFORMATION_ARCHITECTURE.md` | Order confirmation accessed via predictable sequential ID (`/order-confirmation/:orderNumber`). | PII leak: third parties could guess or enumerate order numbers to view customer names, phone numbers, and addresses. | Require an unguessable cryptographic token (`orderAccessToken` UUID) alongside order number for confirmation page access. | **CORRECTED** | Backend Phase 2/3 implementation |
| **ISSUE-010** | **MEDIUM** | `INFORMATION_ARCHITECTURE.md`, `API_CONTRACT_PLAN.md` | Order tracking endpoint allowed lookup by order number alone. | Privacy exposure of delivery addresses to unauthorized parties. | Enforce dual-factor lookup (Order Number + matching Phone Number or Email). | **CORRECTED** | Backend Phase 2/3 implementation |
| **ISSUE-011** | **HIGH** | `MVP_ROADMAP.md`, `README.md` | Outdated 7-phase roadmap attempted database setup in Phase 1 before UX prototype validation, and lacked payment separation. | Premature backend commitment before storefront design is validated; violates user phase directives. | Realign roadmap to the required 8-phase sequence (Phase 0 to Phase 7) with UX prototype in Phase 1 and backend in Phase 2+. | **CORRECTED** | None |
| **ISSUE-012** | **MEDIUM** | `TECHNICAL_ARCHITECTURE.md`, `DEVELOPMENT_STANDARDS.md` | No formal test catalog strategy or mock data adapter specification for frontend prototype development. | Frontend prototype risks hardcoding temporary data structures that break when connecting to the real backend. | Specify a typed mock catalog adapter with 36 deterministic fixtures covering all edge cases, matching future API response types. | **CORRECTED** | Task B & Prototype execution |

---

## 3. Product & Sizing Corrections

### 3.1 Sizing Versatility vs. "Guaranteed Fit"
- **Previous Claim:** "Universal 24-piece sets guarantee fit for 100% of finger sizes, eliminating sizing anxiety and returns."
- **Corrected Standard:** "Universal 24-piece sets offer multiple size options (typically 12 sizes, 2 of each) designed to accommodate a wide variety of natural nail bed widths without manual pre-measurement. However, natural nail curvature and apex height vary; fit suitability is improved but cannot be biologically guaranteed. Sizing guides and measurement instructions remain essential."

### 3.2 Product Packaging Configurations
- Press-on nail products may be packaged as:
  1. **Multi-Size Sets (e.g. 24 nails):** Higher versatility, suitable for first-time buyers.
  2. **Custom Sized Sets (e.g. 10 nails):** Sized to XS, S, M, L based on customer measurement.
- The system must treat both as configurable product options rather than assuming all inventory conforms to a single packaging standard.

### 3.3 Attribute Isolation by Category
- **Press-on Nails:** Receive attributes for Shape (`Almond`, `Coffin`, `Square`, `Oval`, `Stiletto`), Length (`Short`, `Medium`, `Long`), and Finish (`Glossy`, `Matte`, `Chrome`, `Glazed`).
- **Nail Polish & Gel:** Receive attributes for Volume (`10ml`, `15ml`), Finish (`Creme`, `Shimmer`, `Glitter`), and Cure Method (`UV/LED` or `Air Dry`).
- **Nail Art Accessories:** Receive attributes for Material, Unit Count, and Color Family.
- **Tools & Care Kits:** Receive attributes for Kit Type, Tool Material, and Included Pieces.

---

## 4. Product Claims & Regulatory Remediation

### 4.1 Wear Time & Durability Disclosures
- Any reference to wear duration must be qualified:
  - *Adhesive Jelly Tabs:* Recommended for short-term wear (typically 1–3 days); ideal for temporary occasions and allows set reusability when gently soaked off.
  - *Nail Glue:* Intended for extended wear (typically 1–2 weeks depending on natural nail oiliness, lifestyle, and proper nail surface preparation).
- All claims of "damage-free removal" must emphasize: *"Safe removal requires soaking in warm soapy water with oil; peeling or forcing off press-on nails can cause natural nail delamination."*

### 4.2 Brand & Production Origin Disclosures
- The Nail Lounge is headquartered in **Abohar, Punjab, India**.
- Products must not be advertised as "100% handcrafted in Abohar" unless explicitly confirmed by business operations. The storefront will represent Abohar as the brand's design curation and fulfillment studio, maintaining compliance with Indian Consumer Protection (E-Commerce) Rules, 2020.

---

## 5. Commercial Policy Status Register

The following commercial terms are officially classified as **Unresolved Business Decisions** and will be displayed in the prototype strictly as illustrative placeholders:

| Policy Item | Illustrative Prototype Value | Confirmation Status | Impact if Changed |
| :--- | :--- | :--- | :--- |
| **Free Shipping Threshold** | `₹999` (Illustrative) | Pending Client Decision | Dynamic meter adapts automatically via config constant |
| **Cash on Delivery (COD)** | Available with confirmation (Simulated) | Pending Client Decision | Can be toggled on/off in checkout config |
| **Courier Partners** | Delhivery / Bluedart (Illustrative) | Pending Client Decision | Pincode lookup API adapter handles courier mapping |
| **Delivery Timelines** | `3-5 business days` (Illustrative) | Pending Client Decision | SLA strings updated in configuration |
| **Return Policy** | Hygiene-restricted / 48-hr transit damage | Pending Legal Review | Text updated in policy and PDP accordions |
| **GSTIN Registration** | Pending Business Setup | Pending Client Decision | Tax calculation logic remains modular |

---

## 6. Technical Architecture Corrections (Phase 2+ Specifications)

The following architectural updates have been incorporated into the technical blueprints for future backend implementation:

1. **Flexible Option-Value Schema:** Products have `ProductOption` (e.g. "Size", "Finish", "Volume") and `ProductOptionValue` relations, producing variants with specific combination keys.
2. **Order Security via Access Tokens:** `Order` entity will include an indexed `accessToken VARCHAR(64) NOT NULL UNIQUE` generated cryptographically at order creation. Guest order confirmation and status views require `GET /api/v1/orders/:orderNumber?token=:accessToken`.
3. **Dual-Factor Order Tracking:** Public tracking requires `POST /api/v1/orders/track` with body `{ orderNumber: string, phoneOrEmail: string }`.
4. **TTL-Backed Stock Reservation:** Checkout initialization initiates a 15-minute reservation on variant inventory. If the checkout is not completed within 15 minutes, a cron/worker cleans expired reservations.
5. **Finite State Machine (FSM):** Order status transitions strictly enforce valid next states:
   - `PENDING` → `CONFIRMED` or `CANCELLED`
   - `CONFIRMED` → `PROCESSING` or `CANCELLED`
   - `PROCESSING` → `DISPATCHED`
   - `DISPATCHED` → `DELIVERED` or `RETURNED_TO_ORIGIN`
   - `DELIVERED` → `REFUNDED` (under warranty exception)

