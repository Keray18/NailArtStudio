# The Nail Lounge — Technical Architecture Document
**Document Version:** 1.0.0  
**Status:** Approved Blueprint for Phase 0  

---

## 1. System Architecture Overview

The Nail Lounge is architected as two decoupled, independent applications:
1. **Frontend Application:** Next.js (App Router), TypeScript, Tailwind CSS. Responsible exclusively for presentation, UI components, client-side routing, and rendering.
2. **Backend Application:** Node.js, Express.js, TypeScript, Prisma ORM. Responsible for business logic, data persistence, cart/order validation, search indexing, media signature generation, and transactional workflows.

```mermaid
graph TD
    Client[Web Browser / Mobile Client]
    
    subgraph Frontend [Frontend: Next.js App Router]
        UI[Tailwind UI Components / Pages]
        ClientStore[Client State / Cart / Wishlist / Recents]
        ApiClient[Centralized Typed API Client: services/apiClient.ts]
        UI --> ClientStore
        UI --> ApiClient
    end
    
    subgraph Backend [Backend: Express.js Modular Monolith]
        ApiRouter[Express Router: /api/v1]
        Middleware[Auth/RateLimit/Validation Middleware]
        
        %% Modules
        ModProd[Products Module]
        ModCat[Categories Module]
        ModCol[Collections Module]
        ModSearch[Search Module]
        ModCart[Cart Module]
        ModCheckout[Checkout Module]
        ModOrder[Orders Module]
        ModCustomer[Customers Module]
        ModPromo[Promotions Module]
        ModMedia[Media Module]
        ModNotify[Notifications Module]
        
        ApiRouter --> Middleware
        Middleware --> ModProd
        Middleware --> ModCat
        Middleware --> ModCol
        Middleware --> ModSearch
        Middleware --> ModCart
        Middleware --> ModCheckout
        Middleware --> ModOrder
        Middleware --> ModCustomer
        Middleware --> ModPromo
        Middleware --> ModMedia
        Middleware --> ModNotify
        
        PrismaService[Centralized Prisma Client: config/prisma.ts]
        ModProd --> PrismaService
        ModCat --> PrismaService
        ModCol --> PrismaService
        ModSearch --> PrismaService
        ModCart --> PrismaService
        ModCheckout --> PrismaService
        ModOrder --> PrismaService
        ModCustomer --> PrismaService
        ModPromo --> PrismaService
    end
    
    subgraph Infrastructure [Data & Cloud Services]
        Postgres[(PostgreSQL Database)]
        Cloudinary[(Cloudinary Media CDN)]
        MailService[(Email / WhatsApp Gateway)]
    end
    
    Client -->|HTTP / React SSR| Frontend
    ApiClient -->|REST API over JSON / HTTPS| ApiRouter
    PrismaService -->|Database Protocol| Postgres
    ModMedia -->|Upload Signatures & Admin SDK| Cloudinary
    ModNotify -->|API Dispatch| MailService
```

---

## 2. Architectural Boundaries & Decoupling Mandates

### 2.1 Complete Frontend / Backend Decoupling
- **Zero Prisma in Frontend:** Prisma ORM must **never** be imported, bundled, or referenced anywhere in the `frontend/` codebase. Doing so is a strict architectural violation.
- **No Next.js Business API Routes:** The frontend will not implement Next.js API route handlers (`app/api/*`) for storefront business logic. All business rules, inventory queries, pricing calculations, and order creations reside solely in Express.js.
- **Centralized Typed API Client:** All network communication from the frontend to the backend flows through a singleton API client (`frontend/src/services/apiClient.ts`). This client encapsulates:
  - Base URL configuration via `NEXT_PUBLIC_API_URL`.
  - Request timeouts (`AbortController` after 8,000ms).
  - Strongly typed request/response generic wrappers (`ApiResponse<T>`).
  - Standardized error normalizer converting HTTP errors into user-friendly `AppError` objects.

---

## 3. Backend Architecture: Modular Monolith

Rather than introducing fragile microservices or an unstructured monolithic spaghetti codebase, the backend is organized as a **Modular Monolith**. Each domain entity is encapsulated in a dedicated self-contained module containing its own routes, controller, service layer, data validation schema, and TypeScript types.

```text
backend/src/modules/
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.routes.ts
│   ├── products.validator.ts
│   └── products.types.ts
├── categories/
├── collections/
├── search/
├── cart/
├── checkout/
├── orders/
├── customers/
├── promotions/
├── media/
└── notifications/
```

### 3.1 Module Descriptions & Responsibilities

| Module | Core Responsibilities | Key Dependencies |
| :--- | :--- | :--- |
| **Products** | CRUD operations, catalog pagination, shape/finish filtering, variant management, inventory checks. | Prisma (`Product`, `ProductVariant`, `ProductAttribute`) |
| **Categories** | Category hierarchy, slugs, parent-child mappings, category metadata. | Prisma (`Category`) |
| **Collections** | Thematic collections (Bridal, Festive), curated sorting, collection hero banners. | Prisma (`Collection`, `CollectionProduct`) |
| **Search** | Typo-tolerant keyword search, faceted aggregation, autocomplete query suggestions. | Prisma (`Product`, PostgreSQL full-text search) |
| **Cart** | Session-based cart persistence, guest cart merge, line item quantity validation against live stock. | Prisma (`Cart`, `CartItem`, `ProductInventory`) |
| **Checkout** | Pincode delivery validation, pricing integrity verification, stock reservation, order payload validation. | Modules: `Cart`, `Products`, `Customers` |
| **Orders** | Order persistence, order number generation (`TNL-YYYY-XXXXX`), status transition, order lookup. | Prisma (`Order`, `OrderItem`, `Address`) |
| **Customers** | Guest customer record lookup, address deduplication, contact information. | Prisma (`Customer`, `Address`) |
| **Promotions** | Promo coupon code evaluation, bundle discount calculation, free shipping threshold verification. | Prisma (`Promotion`, `Bundle`) |
| **Media** | Cloudinary signature generation for secure direct client uploads, asset optimization URLs. | Cloudinary Node SDK |
| **Notifications** | Transactional order confirmation emails, WhatsApp dispatch notification triggers. | Nodemailer / WhatsApp Business API |

---

## 4. Media Pipeline & Cloudinary Strategy

High-fidelity imagery is paramount for a luxury beauty storefront, but heavy unoptimized images destroy mobile conversion rates.

```mermaid
sequenceDiagram
    autonumber
    participant Client as Admin / Studio Uploader
    participant Backend as Express Backend (/api/v1/media)
    participant Cloudinary as Cloudinary CDN
    participant Postgres as PostgreSQL DB

    Client->>Backend: Request upload signature (folder, timestamp)
    Backend->>Backend: Generate SHA-256 HMAC signature using API Secret
    Backend->>Client: Return signed parameters { signature, timestamp, apiKey }
    Client->>Cloudinary: Direct POST upload with media file + signature
    Cloudinary->>Client: Return asset details { public_id, secure_url, format, width, height }
    Client->>Backend: Submit Product payload with public_id and secure_url
    Backend->>Postgres: Save ProductImage record with publicId and metadata
```

### 4.1 On-The-Fly Media Transformations
- All image URLs rendered by the Next.js frontend apply Cloudinary transformation parameters:
  - `f_auto` (Automatic modern format delivery: WebP / AVIF based on browser support).
  - `q_auto:good` (Perceptually lossless visual quality compression).
  - `c_fill,w_800,h_1000` (Enforce consistent 4:5 vertical aspect ratio for nail cards).
  - Responsive `srcset` generation for `375w`, `640w`, `1024w`, `1280w`.

---

## 5. Security & Data Protection Architecture

1. **HTTP Security Headers:** Implemented via `helmet` in Express (HSTS, X-Content-Type-Options, Frameguard against clickjacking).
2. **Strict CORS Policy:** Restricted strictly to configured frontend origin (`ALLOWED_ORIGINS=http://localhost:3000,https://thenaillounge.in`).
3. **API Rate Limiting:**
   - Global API limiter: `100 requests per 15 minutes` per IP.
   - High-sensitivity limiter (Checkout & Order Placement): `10 requests per 15 minutes` per IP to prevent order spamming and inventory locking attacks.
4. **Input Sanitization & Validation:** Every incoming HTTP request body, query parameter, and route parameter is validated using strict **Zod** schemas in Express middleware before reaching the controller.
5. **SQL Injection Immunity:** Guaranteed through Prisma ORM's parameterized query engine.

---

## 6. Environment Configuration Standard

Environment variables are isolated per application and validated at startup using typed schemas.

### Backend `.env` Schema
```bash
# Server Configuration
NODE_ENV=development
PORT=5000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/nail_lounge_db?schema=public

# Security & CORS
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary CDN
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Order & Brand Settings
BRAND_NAME="The Nail Lounge"
FREE_SHIPPING_THRESHOLD=999
CURRENCY_CODE=INR
```

### Frontend `.env.local` Schema
```bash
NEXT_PUBLIC_APP_NAME="The Nail Lounge"
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER=+919876543210
```

