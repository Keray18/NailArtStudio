# The Nail Lounge — Phase 3 Open Issues & Governance Tracking

## 1. Status Overview

Phase 3 (Backend Catalogue, Inventory Read Models, Search & Media Foundation) has completed all implementation criteria. There are zero blocking bugs or architectural regressions.

---

## 2. Deferred Work Items (By Phase Design)

| Item | Current Status | Scheduled Phase | Description |
|---|---|---|---|
| **Frontend API Integration** | Using `MockCatalogueAdapter` | Phase 4 | Switching Next.js data-fetching services from mock memory adapter to live Express `/api/v1` REST endpoints. |
| **Merchant Authentication & CMS** | Public read-only endpoints | Phase 5 | JWT/Session merchant authentication, role-based access control, product create/update mutations, and media upload signatures. |
| **Stock Reservations & Write Locks** | Read-only ATS computation | Phase 6 | Optimistic locking, transactional checkout reservations, decrementing stock on payment confirmation, release timers. |
| **Live Payment Gateway** | None | Phase 6 | Indian payment gateways (Razorpay, Cashfree, or PhonePe UPI) and webhook signature verification. |

---

## 3. Business & Domain Dependencies (Client Action Items)

1. **Cloudinary Production Credentials**:
   - For production launch, provide `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
   - Development operates seamlessly using Unsplash image delivery and fallback beauty placeholders.

2. **Legal Metrology Compliance**:
   - Provide the registered manufacturer/packer legal entity name and complete business address in Abohar, Punjab.
   - Required by Indian Consumer Protection (E-Commerce) Rules and Legal Metrology for pre-packaged commodities.

3. **Final Real Product Catalogue**:
   - Use the schema specified in `docs/PHASE_3_CATALOGUE_IMPORT.md` (`products_master.csv` and `variants_inventory.csv`) to provide finalized pricing, photography URLs, and physical inventory counts.

