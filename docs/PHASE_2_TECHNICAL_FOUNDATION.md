# The Nail Lounge — Phase 2: Technical Foundation Blueprint

**Document Version:** 1.0.0  
**Phase:** Phase 2 (Technical Foundation)  
**Author:** Principal Full-Stack Architect & Senior Node.js/TypeScript Engineer  
**Status:** Implemented & Verified  

---

## 1. Executive Summary & Architecture Overview

Phase 2 establishes the production-oriented technical foundation for **The Nail Lounge** (Abohar, Punjab, India). It introduces a decoupled **Modular Monolith** backend while strictly preserving the approved Next.js frontend visual prototype, its 36-product mock catalogue, and all user-facing interactions.

```
the-nail-lounge/
├── frontend/                     # Next.js App Router (React 19, Tailwind CSS, TypeScript)
│   ├── src/
│   │   ├── app/                  # 15 Prerendered Storefront Routes
│   │   ├── components/           # Reusable UI & Layout Components
│   │   ├── services/
│   │   │   ├── apiClient.ts      # Singleton Typed REST Client (Zero Prisma)
│   │   │   └── catalogueService.ts # Repository Pattern (Mock active, HTTP ready)
│   │   └── data/                 # 36-Product & 6-Collection Local Fixtures
│   └── package.json
│
├── backend/                      # Node.js + Express Modular Monolith (TypeScript, Prisma)
│   ├── prisma/
│   │   ├── schema.prisma         # Multi-Category PostgreSQL Schema
│   │   └── migrations/           # Versioned SQL Migrations (20261106000000_init)
│   ├── src/
│   │   ├── config/               # Zod-validated Environment (env.ts)
│   │   ├── lib/                  # Prisma Client Singleton & Health Ping (prisma.ts)
│   │   ├── middleware/           # Error, NotFound, RequestId, Validate, RateLimit
│   │   ├── modules/
│   │   │   └── health/           # Liveness (/health) & Readiness (/ready)
│   │   ├── utils/                # Logger, AppError, ApiResponse envelopes
│   │   ├── app.ts                # Express application factory & pipeline
│   │   └── server.ts             # HTTP listen, port binding & graceful shutdown
│   ├── __tests__/                # Vitest Test Suite (17 passing unit/integration tests)
│   ├── .env.example              # Documented Environment Variable Template
│   ├── tsconfig.json             # Strict TypeScript configuration
│   └── package.json
│
├── docs/                         # Architecture, Blueprints & Operational Docs
├── README.md                     # Root Developer Documentation & Runbooks
└── package.json                  # Workspace automation scripts
```

---

## 2. Architectural Boundaries & Decoupling Mandates

The technical foundation enforces four inviolable architectural boundaries:

1. **Zero Prisma in Frontend:**  
   Prisma ORM, database connection strings, and native SQL drivers are strictly banned from `frontend/`. The frontend communicates exclusively via HTTP JSON REST contracts over `/api/v1`.
2. **No Next.js Business API Routes:**  
   The frontend contains no `app/api/*` routes for business transactions. Express owns all domain logic, pricing integrity, inventory reservation, and persistence.
3. **Repository Pattern for Seamless Prototype Transition:**  
   The frontend defines `CatalogueRepository` in `frontend/src/services/catalogueService.ts`. During Phase 1 and Phase 2, `MockCatalogueAdapter` remains the active singleton, allowing the visual prototype to run standalone without requiring a local PostgreSQL instance or live backend. An `HttpCatalogueAdapter` is simultaneously implemented in `catalogueService.ts` to enable one-line activation during Phase 4.
4. **Typed API Client Abstraction:**  
   `frontend/src/services/apiClient.ts` encapsulates all outgoing requests, injecting request correlation IDs (`X-Request-Id`), enforcing strict timeouts (8,000ms via `AbortController`), and normalizing API errors into strongly typed `ApiClientError` instances.

---

## 3. Backend Core Pipeline & Middleware Chain

The Express application pipeline (`backend/src/app.ts`) is configured with defensive, layered middleware:

```mermaid
flowchart TD
    ClientReq[Incoming Client Request] --> TrustProxy[Trust Proxy Configuration]
    TrustProxy --> HelmetSec[Helmet Security Headers]
    HelmetSec --> CorsCheck[CORS Whitelist Validation]
    CorsCheck --> ReqId[RequestId Middleware: Assign/Propagate X-Request-Id]
    ReqId --> BodyParsers[Bounded JSON & URL-Encoded Parsers 1MB Limit]
    BodyParsers --> ReqLogger[Structured Request Logging on Finish]
    ReqLogger --> RateLimiter[Global In-Memory Rate Limiter]
    RateLimiter --> ApiRouter[API Router: /api/v1]
    
    subgraph Routes [/api/v1]
        HealthLive[GET /api/v1/health: Liveness Probe]
        HealthReady[GET /api/v1/ready: Readiness DB Probe]
    end
    
    ApiRouter --> HealthLive
    ApiRouter --> HealthReady
    ApiRouter --> RouteNotFound[Unmatched Route]
    
    RouteNotFound --> NotFoundMW[Centralized NotFound Middleware 404]
    NotFoundMW --> ErrMW[Centralized Error Middleware]
    HealthReady -.->|Exception Thrown| ErrMW
```

### 3.1 Component Specifications

| Middleware / Module | File Path | Operational Behavior |
| :--- | :--- | :--- |
| **Environment Parser** | `src/config/env.ts` | Uses Zod schema to parse and validate `process.env`. Fails fast on server bootstrap if mandatory variables (`DATABASE_URL`, `PORT`) are missing or malformed. |
| **Correlation ID** | `src/middleware/requestId.middleware.ts` | Captures incoming `X-Request-Id` or generates a UUIDv4. Injects `req.id` and sets `X-Request-Id` response header for end-to-end tracing. |
| **Request Validation** | `src/middleware/validate.middleware.ts` | Reusable factory `validateRequest({ body, query, params })`. Parses incoming input using Zod schemas and forwards structured `ValidationError` with field-level details on failure. |
| **Rate Limiter** | `src/middleware/rateLimit.middleware.ts` | Sliding-window in-memory rate limiter tracking IP addresses. Returns `X-RateLimit-*` headers and `Retry-After` on status 429. Tiered: `globalRateLimiter` (100 req/15 min) and `sensitiveRateLimiter` (20 req/15 min). |
| **Structured Logger** | `src/utils/logger.ts` | Outputs JSON formatted logs in production; colorized readable output in development. Automatically includes correlation `requestId`, timestamp, level, and contextual metadata. |
| **Operational Errors** | `src/utils/appError.ts` | Extensible `AppError` hierarchy (`BadRequestError`, `ValidationError`, `NotFoundError`, `ConflictError`, `DatabaseError`, `TooManyRequestsError`). |
| **Centralized Error Handler** | `src/middleware/error.middleware.ts` | Traps all synchronous and asynchronous errors. Formats uniform `ApiErrorResponse` envelope. Maps Prisma error codes (e.g. `P2002` -> 409 Conflict, `P2025` -> 404 Not Found). Redacts internal stacks in production. |
| **404 Catch-All** | `src/middleware/notFound.middleware.ts` | Intercepts unmapped endpoints and produces standard JSON 404 response. |

---

## 4. Graceful Shutdown & Process Lifecycle

`backend/src/server.ts` orchestrates process termination on `SIGINT`, `SIGTERM`, `unhandledRejection`, and `uncaughtException`:

1. Flags server state `isShuttingDown = true` to prevent concurrent shutdown triggers.
2. Arms a hard 10-second watchdog timer: if active connections do not drain within 10 seconds, `process.exit(1)` is forced to prevent zombie processes.
3. Closes HTTP listener (`server.close()`), ceasing acceptance of incoming sockets while allowing in-flight requests to complete.
4. Executes `disconnectPrisma()`, gracefully draining and releasing PostgreSQL connection pool handles.
5. Emits structured log event confirming clean termination and exits with status 0 (or 1 on unhandled exception).

