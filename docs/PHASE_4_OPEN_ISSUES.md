# The Nail Lounge — Phase 4 Open Issues & Governance Tracking

## 1. Phase 4 Completion Status

Phase 4 (Storefront API Integration) has fulfilled all integration requirements. The Next.js storefront communicates directly with the Express backend REST APIs and PostgreSQL 18 database in API mode. All visual designs, responsive layouts, and interactive prototype journeys remain preserved.

---

## 2. Deliberately Deferred Work Items (By Phase Design)

| Work Item | Current Prototype Status | Target Phase | Implementation Scope |
|---|---|---|---|
| **Merchant CMS & Authentication** | Read-only public APIs | Phase 5 | Merchant authentication, JWT/session tokens, role-based controls, product mutations, and image uploads. |
| **Transactional Checkout Engine** | Non-transactional prototype | Phase 6 | Authoritative server-side pricing validation, coupon codes, and shipping fee calculation. |
| **Inventory Write Locks & Decrements**| Read-only ATS calculation | Phase 6 | Stock reservation locks during checkout sessions, payment confirmation decrements, and expiration release timers. |
| **Live Payment Gateway** | Simulated prototype checkout | Phase 7 | Indian payment gateways (Razorpay, Cashfree, or PhonePe UPI) and webhook signature verification. |

---

## 3. Business Dependencies & Action Items for Launch

1. **Merchant Registered Business Details**:
   - Provide the legal entity business name and registered operating address in Abohar, Punjab, for inclusion in Legal Metrology disclosures and invoice templates.
2. **Production Media Storage**:
   - Set up production Cloudinary account and configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
3. **Real Product Catalogue Ingestion**:
   - Use the CSV import pipeline specified in [docs/PHASE_3_CATALOGUE_IMPORT.md](file:///x:/clients/nail%20art/docs/PHASE_3_CATALOGUE_IMPORT.md) to upload finalized inventory counts, retail prices, and studio photography when ready.

---

## 4. Phase 5 Readiness Recommendation

Phase 4 is complete, fully tested, and ready for owner review. The technical foundation is decoupled, secure, and production-ready for **Phase 5 (Merchant CMS & Authentication)** or **Phase 6 (Cart Engine & Checkout Orchestration)**.

