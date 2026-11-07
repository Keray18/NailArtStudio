# The Nail Lounge — Phase 2: Open Issues & Operational Items

**Document Version:** 1.0.0  
**Phase:** Phase 2 (Technical Foundation)  
**Status:** Monitored  

---

## 1. Local Database Environment Configuration

| Issue ID | Description | Impact | Action Required | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ENV-01** | **PostgreSQL Local Password Authentication** | A local PostgreSQL 18 service (`postgresql-x64-18`) is active on port 5432, but requires password authentication. | Set `DATABASE_URL` with your local credentials in `backend/.env` and execute `npm --prefix backend run prisma:migrate`. The migration script `backend/prisma/migrations/20261106000000_init/migration.sql` is ready. | Pending user credentials |
| **ENV-02** | **Prisma Connection Pooling in Production** | Default connection pool size is 10 connections. For serverless or high-traffic production environments, PgBouncer or Supabase connection pooling should be configured. | Documented in `PHASE_2_ENVIRONMENT_SETUP.md`. | Ready for production deployment |

---

## 2. External Integration Dependencies (Deferred by Roadmap)

| Dependency | Planned Phase | Current Status | Notes |
| :--- | :--- | :--- | :--- |
| **Cloudinary Media Storage** | Phase 4 (Media & Asset Pipeline) | Deferred | Architecture supports secure signed direct uploads via backend token generation. |
| **Payment Gateway (Razorpay / Cashfree)** | Phase 5 (Checkout & Payments) | Deferred | `PaymentMethod` enum currently supports `COD` (Cash on Delivery) and `ONLINE_MOCK`. |
| **SMS / WhatsApp Gateway (Gupshup / Aisensy)** | Phase 5 (Order Notifications) | Deferred | Guest notifications planned via customer phone number. |
| **India Post Pincode Lookup** | Phase 3 / Phase 4 | Mocked | Currently using deterministic regional mapping in `MockCatalogueAdapter`. Decision needed on whether to bundle static 6-digit postal code table or query government API. |

---

## 3. Scope Gate Confirmation

As mandated by project governance:
- **Phase 3 Catalogue APIs** (products, categories, collections, cart, checkout endpoints) have **not** been started.
- All Phase 2 foundation criteria have been fulfilled and verified.
- Execution is stopped awaiting explicit human approval before Phase 3 authorization.

