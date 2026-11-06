# The Nail Lounge — Engineering & Development Standards
**Document Version:** 1.0.0  
**Status:** Approved Blueprint for Phase 0  

---

## 1. Naming Conventions

Consistency across codebase files, variables, endpoints, and database tables is strictly enforced.

| Domain | Convention | Examples |
| :--- | :--- | :--- |
| **Files & Folders (Frontend)** | `kebab-case` or `PascalCase` for React components | `product-card.tsx`, `ProductCard.tsx`, `use-cart.ts` |
| **Files & Folders (Backend)** | `kebab-case.role.ts` | `products.controller.ts`, `orders.service.ts` |
| **TypeScript Types & Interfaces**| `PascalCase` (No `I` prefix) | `Product`, `ProductVariant`, `CartItem`, `ApiResponse` |
| **Variables & Functions** | `camelCase` | `calculateSubtotal()`, `isStockAvailable`, `fetchProductBySlug()` |
| **Constants & Configs** | `UPPER_SNAKE_CASE` | `FREE_SHIPPING_THRESHOLD`, `MAX_CART_ITEMS` |
| **REST API Routes** | `kebab-case`, plural nouns | `/api/v1/products`, `/api/v1/collections/royal-bridal` |
| **Database Tables & Columns** | `snake_case` (PostgreSQL) / `camelCase` (Prisma schema) | `product_variants`, `order_items`, `created_at` |

---

## 2. Folder Organization Standard

### 2.1 Backend Folder Structure (`/backend`)
```text
backend/
├── prisma/
│   ├── schema.prisma            # Single source of truth for database schema
│   ├── migrations/              # Immutable migration SQL files
│   └── seed.ts                  # Deterministic database seeder
├── src/
│   ├── config/                  # Environment, database, and third-party SDK configs
│   │   ├── env.ts               # Typed Zod environment parser
│   │   ├── prisma.ts            # Singleton Prisma client instance
│   │   └── cloudinary.ts        # Cloudinary SDK credentials configuration
│   ├── middleware/              # Global Express middleware
│   │   ├── error.middleware.ts  # Centralized error handler
│   │   ├── notFound.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── validate.middleware.ts
│   ├── modules/                 # Modular Monolith domain slices
│   │   ├── products/
│   │   ├── categories/
│   │   ├── collections/
│   │   ├── search/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── customers/
│   │   └── media/
│   ├── utils/                   # Shared utility helpers
│   │   ├── apiResponse.ts       # Typed envelope constructors
│   │   ├── appError.ts          # Operational error class
│   │   └── logger.ts            # Structured logger (Winston/Pino)
│   ├── app.ts                   # Express application setup (middleware & routes)
│   └── server.ts                # HTTP server bootstrap & graceful shutdown
├── tsconfig.json
└── package.json
```

### 2.2 Frontend Folder Structure (`/frontend`)
```text
frontend/
├── public/                      # Static assets (favicons, fallback icons)
├── src/
│   ├── app/                     # Next.js App Router pages & layouts
│   │   ├── layout.tsx           # Global root layout (Header, Footer, ToastProvider)
│   │   ├── page.tsx             # Homepage
│   │   ├── shop/                # Catalog routes
│   │   ├── collections/         # Collection routes
│   │   ├── products/[slug]/     # PDP dynamic routes
│   │   ├── cart/                # Dedicated cart page
│   │   ├── checkout/            # Guest checkout flow
│   │   └── order-confirmation/  # Post-purchase receipt
│   ├── components/
│   │   ├── ui/                  # Atomic primitives (button, badge, input, modal, drawer)
│   │   ├── layout/              # Header, Footer, MobileNav, AnnouncementBar
│   │   ├── catalog/             # ProductCard, ProductGrid, FilterSidebar, SortDropdown
│   │   ├── pdp/                 # MediaGallery, SizingSelector, PincodeChecker, Accordions
│   │   └── cart/                # CartDrawer, CartItemRow, FreeShippingMeter
│   ├── hooks/                   # Custom React hooks (useCart, usePincode, useWishlist)
│   ├── services/
│   │   └── apiClient.ts         # Centralized typed HTTP client (NO Prisma here!)
│   ├── styles/
│   │   └── globals.css          # Tailwind directives & CSS custom properties
│   └── types/
│       └── api.ts               # Shared TypeScript API contracts
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 3. Error Handling Architecture

### 3.1 Centralized Backend Error Flow
All operational errors in Express are instantiated via a custom `AppError` class.
- Asynchronous route handlers wrap execution with an `asyncHandler` or rely on Express 5 async boundary.
- Any unhandled exception or business rule violation bubbles up to `error.middleware.ts`.
- In production, stack traces are sanitized to prevent internal path leaks.

```typescript
// backend/src/utils/appError.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, errorCode = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

---

## 4. Input Validation & Type Safety Standards

- **Strict TypeScript:** `noImplicitAny: true`, `strictNullChecks: true`.
- **Runtime Validation via Zod:** Never trust client-provided payloads. Every incoming request body, query parameter, and route parameter must be validated against a Zod schema before invoking business logic.
- **Fail-Fast Validation Middleware:** If Zod validation fails, immediately respond with `400 Bad Request` and detailed field error mappings; do not touch the service or database layer.

---

## 5. Database Migration Best Practices

1. **Never edit existing applied migrations:** Database migrations are immutable audit logs. Any schema adjustment must generate a new migration: `npx prisma migrate dev --name describe_change`.
2. **Explicit Foreign Key Constraints:** All relations must enforce cascading rules (`ON DELETE CASCADE` for variants/images; `ON DELETE RESTRICT` for products with historical order items).
3. **Compound Indexes:** Indexes must reflect actual query patterns (e.g. `(isActive, isFeatured)` or `(shape, finish)` for faceted catalog filters).

---

## 6. Accessibility & Responsive Design Standards

- **Target Compliance:** WCAG 2.1 Level AA.
- **Color Contrast:** All text over backgrounds must exceed a `4.5:1` contrast ratio (`Espresso #453438` on `Ivory #F8F3EF` achieves `10.4:1`).
- **Touch Ergonomics:** All clickable/tappable elements on mobile must have a minimum touch target size of `44x44px`.
- **Keyboard Navigability:** Full tab-order navigation across drawers, modals, filter pills, and quantity selectors. Modals must trap focus when active.
- **Screen Reader Support:** Explicit `aria-label` attributes on icon-only buttons (Wishlist heart, Cart trigger, Drawer close 'X').

---

## 7. Testing Strategy

1. **Unit Testing:** Vitest / Jest for business calculations:
   - Price calculation, discount allocation, free shipping threshold tests.
   - Sizing measurement calculator tests.
2. **Integration Testing:** Supertest against Express API endpoints:
   - Pincode validation endpoint.
   - Order placement with inventory reservation and transaction rollback checks.
3. **End-to-End (E2E) Testing:** Playwright for critical customer journeys:
   - Happy path: Browse catalog → Select Almond set → Add to Bag → Guest Checkout → Order Confirmed.

---

## 8. Git Workflow & Conventional Commits

- **Branching Model:** Trunk-based development with short-lived feature branches:
  - `feat/product-catalog-filters`
  - `feat/guest-checkout-form`
  - `fix/pincode-validation-regex`
- **Conventional Commits Standard:**
  - `feat: add universal 24-piece set selector to PDP`
  - `fix: resolve cart drawer backdrop blur on Safari mobile`
  - `docs: update database schema for order address snapshot`
  - `chore: configure Cloudinary upload signed credentials`

