# The Nail Lounge — Unresolved Business Decisions & Open Questions
**Document Version:** 1.0.0  
**Status:** Requires Client Sign-off Prior to Phase 1 Implementation  

---

## 1. Executive Summary

As technical and product architects, our responsibility is to safeguard the commercial viability, operational feasibility, and legal compliance of **The Nail Lounge**. Writing code before resolving foundational business parameters leads to costly rewrites, misaligned database schemas, and customer fulfillment failures.

The following decisions require explicit founder/client resolution.

---

## 2. High-Impact Commercial & Product Decisions

### Decision 1: Sizing Fulfillment Strategy (Universal 24-Piece vs. Custom 10-Piece Sets)
- **Context:** Press-on nails can be manufactured/packaged in two distinct models:
  - *Model A: Universal 24-Piece Sets:* Each box contains 24 nails across 12 distinct finger sizes (2 of each size). Fits 100% of customers out of the box with zero measurement required.
  - *Model B: Custom 10-Piece Sets:* Sold by specific hand sizes (XS, S, M, L). Requires the customer to measure their nail beds using a ruler. Higher fit risk if the customer measures incorrectly.
- **Architectural Recommendation:** Launch **Model A (Universal 24-Piece Sets)** as the primary/default SKU for all retail styles to eliminate sizing anxiety and minimize size-related returns. Reserve Model B for bespoke/bridal custom orders.
- **Client Question:** *Will The Nail Lounge launch with Universal 24-piece sets, sized 10-piece sets, or both simultaneously?*

---

### Decision 2: Box Package Contents & Standard Application Kit Inclusion
- **Context:** When a customer orders a press-on nail set, what is included in the base box versus what must be purchased separately?
  - *Standard Kit:* Adhesive glue tabs (sheet of 24), liquid nail glue (2g), wooden cuticle pusher, mini buffer file, alcohol prep wipe.
- **Architectural Recommendation:** Include the complete application kit in every press-on nail box. This ensures first-time buyers have everything needed for an immediate, flawless application, driving word-of-mouth satisfaction.
- **Client Question:** *Does every press-on nail purchase include the full application tool kit, or will glue and tools be sold as separate add-ons?*

---

### Decision 3: Cash on Delivery (COD) Policy in India
- **Context:** In the Indian e-commerce beauty segment, Cash on Delivery (COD) represents 50%–70% of consumer orders, but carries an average Return-to-Origin (RTO) rate of 15%–30% due to delivery rejections. Handcrafted press-on nails risk transit damage during repeated courier returns.
- **Architectural Options:**
  - *Option A:* Prepaid-only storefront initially (UPI, Cards, Netbanking via Razorpay). Zero RTO risk, but lower initial conversion rate.
  - *Option B:* Prepaid + COD with an added COD verification fee (e.g., ₹50 non-refundable advance fee or automated WhatsApp delivery confirmation before dispatch).
- **Client Question:** *Will The Nail Lounge offer Cash on Delivery (COD) at launch? If yes, will there be a minimum order value or COD handling fee?*

---

### Decision 4: Logistics & Courier Integration
- **Context:** Shipping will originate from Abohar, Punjab (Pincode: 152116). Standard delivery SLAs must be established for Tier 1 metros (Delhi, Mumbai, Bengaluru) vs Tier 2/3 cities across India.
- **Options:** Shiprocket aggregator, Delhivery Direct, Bluedart, or India Post Speed Post.
- **Client Question:** *Which logistics partner or shipping aggregator will The Nail Lounge integrate with, and what are the actual courier timelines from Abohar?*

---

### Decision 5: Returns & Hygiene Policy for Cosmetic Products
- **Context:** Under Indian Consumer Protection regulations, cosmetic and intimate personal beauty goods carry hygiene restrictions. If a customer opens a box or attempts to apply nails, they cannot be resold.
- **Architectural Recommendation:** Strictly state: *"All press-on nail sales are final due to personal hygiene standards. Free immediate replacements are guaranteed if an unboxing video confirms the parcel arrived damaged or defective in transit within 48 hours of delivery."*
- **Client Question:** *Does this hygiene-restricted return policy match your planned business operations?*

---

### Decision 6: Indian Statutory & Tax Compliance (GST & Legal Metrology)
- **Context:** E-commerce businesses selling across state lines in India must comply with GST registration and Legal Metrology rules.
  - Does the business possess an active GSTIN?
  - Applicable GST rate for artificial nails / cosmetic accessories (typically 18% under HSN Code 3926 or 3304).
  - Registered office address and designated Grievance Officer details for the Contact and Privacy pages.
- **Client Question:** *What is the registered business entity name, GSTIN status, and official studio address in Abohar to be reflected on legal invoices and website footers?*

---

## 3. Recommended Action Plan

1. **Review this document** alongside the accompanying Phase 0 architectural files.
2. **Provide directional sign-off** on Decisions 1 through 6 above.
3. Upon approval, proceed to **Phase 1: Database Setup & Backend Core APIs**.

