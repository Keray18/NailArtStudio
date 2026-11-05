# Technical Architecture Specification

## 1. System Architecture Overview

The Nail Art & Beauty E-Commerce platform is engineered as a decoupled, two-tier web application designed for high performance, maintainability, and strict security isolation.

```
┌────────────────────────────────────────────────────────┐
│                        CLIENT                          │
│               Web & Mobile Web Browsers                │
└───────────────────────────┬────────────────────────────┘
                            │
               HTTPS / HTML, JS & Hydration
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FRONTEND TIER                        │
│               Next.js 16 (App Router)                  │
│       TypeScript + Tailwind CSS + Atomic Components    │
│  - Presentation Layer & Client-Side State              │
│  - Centralized Typed API Client (Fetch)                │
│  - No Server Actions accessing DB / No Next API Routes │
└───────────────────────────┬────────────────────────────┘
                            │
              RESTful JSON over HTTP / CORS
                            ▼
┌────────────────────────────────────────────────────────┐
│                    BACKEND TIER                        │
│             Node.js + Express + TypeScript             │
│  - Application Logic & Thin Controllers                │
│  - Zod Request Validation & Error Interceptor          │
│  - Rate Limiting, Helmet & Security Middleware         │
│  - Service Layer (Domain Logic)                        │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
   Prisma Client / TCP Port 5432           │ Cloudinary SDK / HTTPS API
              ▼                            ▼
┌───────────────────────────┐┌───────────────────────────┐
│       DATABASE TIER       ││       MEDIA STORAGE       │
│    PostgreSQL (Prisma)    ││      Cloudinary CDN       │
│ - Relational Data Storage ││ - Product Assets & Media  │
│ - Migrations & Indexes    ││ - Dynamic Transformations │
└───────────────────────────┘└───────────────────────────┘
```

---

## 2. Component Separation & Boundaries

### 2.1 Frontend Tier (`/frontend`)
- **Technology Stack**: Next.js (App Router), TypeScript, Tailwind CSS, ESLint.
- **Role**: Serves the user interface, manages client-side interactivity, handles responsive layout rendering, and coordinates user flows.
- **Architectural Constraints**:
  - Next.js API routes (`/src/app/api/...`) are strictly prohibited for business operations.
  - The frontend has zero knowledge of database credentials, Prisma schemas, or Cloudinary API secrets.
  - All data operations are initiated via the centralized `apiClient` (`frontend/src/services/apiClient.ts`), communicating exclusively via JSON REST endpoints.
  - Reusable presentation primitives (`components/ui`, `components/common`, `components/layout`) are kept separate from domain features (`features/*`).

### 2.2 Backend Tier (`/backend`)
- **Technology Stack**: Node.js, Express.js, TypeScript, Zod, Prisma Client, Cloudinary SDK.
- **Role**: Serves as the single source of truth for business logic, authentication, input validation, transaction management, database queries, and external media orchestration.
- **Layered Structure**:
  1. **Route Layer (`routes/`)**: Maps URI endpoints to controller actions and applies route-specific validation middleware.
  2. **Controller Layer (`controllers/`)**: Thin presentation orchestrators that parse request inputs and pass them to services, returning standardized JSON responses.
  3. **Service Layer (`services/`)**: Encapsulates core business rules, database access (via Prisma), and third-party API integration.
  4. **Data Access Layer (`config/prisma.ts`)**: Manages the Prisma client lifecycle, connection pools, and queries to PostgreSQL.
  5. **Storage Layer (`services/cloudinary.service.ts`)**: Coordinates media uploads, deletes, and URL generation.

### 2.3 Database Tier (PostgreSQL + Prisma ORM)
- **Role**: Relational data store providing ACID compliance for products, variants, inventory, customers, carts, and orders.
- **Access Control**: PostgreSQL is accessible exclusively from the backend host over internal network or TLS-secured connection strings. Prisma ORM handles schema migrations and type-safe query generation.

### 2.4 Media Storage Tier (Cloudinary)
- **Role**: Manages media file persistence, content delivery networks (CDNs), and automatic on-the-fly transformations (resizing, WebP/AVIF format optimization).
- **Security Boundary**: Upload signatures and API secret keys are stored exclusively in backend environment variables. The frontend interacts with Cloudinary solely by rendering public, secure CDN delivery URLs (`https://res.cloudinary.com/...`).

---

## 3. Communication Protocols & Standards

### 3.1 REST API Contract
All communication between frontend and backend occurs via JSON payloads over standard HTTP methods:
- `GET`: Read resources (idempotent, cacheable).
- `POST`: Create resources or submit actions.
- `PUT` / `PATCH`: Update resources.
- `DELETE`: Remove resources.

### 3.2 Standardized JSON Response Specification
All backend endpoints return a consistent JSON envelope to simplify client deserialization:

#### Successful Response:
```typescript
interface ApiResponseSuccess<T> {
  success: true;
  message?: string;
  data: T;
}
```

#### Error Response:
```typescript
interface ApiResponseError {
  success: false;
  message: string;
  error?: unknown;
}
```

### 3.3 Centralized Error Handling & Information Disclosure
- Custom `AppError` instances represent controlled operational errors (e.g., 400 Bad Request, 404 Not Found, 409 Conflict).
- In development (`NODE_ENV=development`), error responses include debug stack traces to accelerate debugging.
- In production (`NODE_ENV=production`), unhandled internal 500 errors are masked to prevent leak of internal paths, database schemas, or infrastructure topology.

---

## 4. Security & Traffic Control

1. **CORS Protection**: The backend enforces strict origin whitelisting using the `FRONTEND_URL` environment setting.
2. **Security Headers**: `helmet` is installed and applied as global middleware to set `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, and `Strict-Transport-Security`.
3. **Rate Limiting**: `express-rate-limit` throttles abusive IP addresses on all `/api/*` endpoints (default: 100 requests per 15-minute window).
4. **Input Sanitization**: Incoming request bodies, query strings, and path parameters are validated via declarative Zod schemas before hitting any controller or service logic.

---

## 5. Health Monitoring Architecture

The system provides `GET /api/health` as an automated health probe:
- **API Status**: Verifies that the Express process is accepting HTTP traffic.
- **Database Status**: Performs a lightweight `SELECT 1` ping via Prisma to verify active PostgreSQL socket connectivity and connection latency.
- **Cloudinary Status**: Checks that required storage credentials are set in the runtime environment.
- **Degraded Grace**: If the database is unreachable or credentials are unconfigured, the endpoint responds with HTTP `503 Service Unavailable` with detailed diagnostics in development, without crashing the server process.

