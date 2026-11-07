# The Nail Lounge — E-Commerce Platform

> **Artistry at Your Fingertips**  
> Affordable, premium-grade handcrafted press-on nails, tools, and salon accessories delivered across India from Abohar, Punjab.

---

## 1. Project Overview

The Nail Lounge is a modern, mobile-first beauty e-commerce storefront combining high-fashion editorial aesthetics with social-commerce discovery and frictionless guest checkout.

The repository is organized as a decoupled, production-oriented **Modular Monolith**:
- **`frontend/`**: Next.js (App Router), React 19, TypeScript, Tailwind CSS. Purely presentation, responsive SSR/SSG catalog pages, and client state. Zero database or Prisma dependencies.
- **`backend/`**: Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM. Structured as a Modular Monolith managing catalog data, inventory, cart synchronization, guest checkout, and security controls.
- **`docs/`**: Comprehensive architectural, UX, database, and operational documentation established across Phase 0, Phase 1, and Phase 2.

---

## 2. Repository Structure

```text
the-nail-lounge/
├── frontend/                               # Next.js Storefront Prototype (Phase 1)
│   ├── public/                             # Static brand assets & fixture images
│   ├── src/
│   │   ├── app/                            # 15 Prerendered Storefront Routes
│   │   ├── components/                     # Atomic design system & feature components
│   │   ├── config/                         # Configurable brand parameters
│   │   ├── data/                           # 36 deterministic development fixtures
│   │   ├── hooks/                          # Client hooks (useCart, useWishlist)
│   │   ├── services/
│   │   │   ├── apiClient.ts                # Centralized typed HTTP client (Zero Prisma)
│   │   │   └── catalogueService.ts         # Repository pattern (Mock active, HTTP ready)
│   │   ├── styles/globals.css              # Tailwind design tokens & font styles
│   │   └── types/                          # TypeScript domain types (Product, Cart, Order)
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                                # Express.js Modular Monolith REST API (Phase 2 & Phase 3)
│   ├── prisma/
│   │   ├── schema.prisma                   # Multi-Category PostgreSQL Schema
│   │   ├── seed.ts                         # Deterministic, Idempotent Development Seeder
│   │   └── migrations/                     # Versioned SQL Migrations (20261106000000_init, 20261107062343_catalogue_enhancements)
│   ├── src/
│   │   ├── config/env.ts                   # Zod-validated Environment Parser
│   │   ├── lib/prisma.ts                   # Prisma Singleton & Health Check
│   │   ├── middleware/                     # Error, NotFound, RequestId, Validate, RateLimit
│   │   ├── modules/
│   │   │   ├── health/                     # Health (/health) & Readiness (/ready) probes
│   │   │   ├── inventory/                  # Inventory Read Model & ATS Calculations
│   │   │   ├── media/                      # Media transformations & CDN placeholder fallback
│   │   │   └── catalogue/                  # Categories, Collections, Products & Search modules
│   │   ├── utils/                          # Logger, AppError, ApiResponse envelopes
│   │   ├── app.ts                          # Express application factory & middleware pipeline
│   │   └── server.ts                       # HTTP server bootstrap & graceful shutdown
│   ├── __tests__/                          # Vitest Test Suite (46 Passing Tests across 6 suites)
│   ├── .env.example                        # Documented environment template
│   ├── tsconfig.json                       # Strict backend TypeScript config
│   └── package.json
│
├── docs/                                   # Architectural, UX & Operational Blueprints
│   ├── PHASE_3_CATALOGUE_ARCHITECTURE.md   # Layered catalogue architecture & module boundaries
│   ├── PHASE_3_API_CONTRACTS.md            # Comprehensive REST contracts & JSON envelopes
│   ├── PHASE_3_DATABASE_AND_SEEDING.md     # PostgreSQL migrations & deterministic fixture seeding
│   ├── PHASE_3_INVENTORY_READ_MODEL.md     # Available-to-Sell (ATS) formulas & stock indicators
│   ├── PHASE_3_MEDIA_STRATEGY.md           # Cloudinary foundation & responsive image delivery
│   ├── PHASE_3_CATALOGUE_IMPORT.md         # Real catalogue CSV import specification
│   ├── PHASE_3_TEST_REPORT.md              # 46/46 passing backend tests & full build verification
│   ├── PHASE_3_OPEN_ISSUES.md              # Phase tracking, governance & client action items
│   ├── PHASE_2_TECHNICAL_FOUNDATION.md     # Phase 2 architecture, lifecycle & pipeline
│   ├── PHASE_2_DATABASE_IMPLEMENTATION.md  # Multi-category schema, models & migrations
│   ├── PHASE_2_API_CONVENTIONS.md          # REST envelopes, status codes & correlation IDs
│   ├── PHASE_2_ENVIRONMENT_SETUP.md        # Workstation setup & runbook
│   ├── PHASE_2_SECURITY_BASELINE.md        # Defense-in-depth, Helmet, CORS & Rate Limits
│   ├── PHASE_2_TEST_REPORT.md              # 17/17 Passing tests & build report
│   ├── PHASE_2_OPEN_ISSUES.md              # Environment credentials & roadmap gates
│   ├── PHASE_1_UX_STRATEGY.md              # IA tiering & page-by-page conversion specs
│   ├── PHASE_1_VISUAL_DIRECTIONS.md        # Editorial vs Modern Commerce comparison
│   ├── PHASE_1_RESPONSIVE_SPECIFICATIONS.md# Viewport breakpoints (320px–1440px)
│   ├── PHASE_1_COMPONENT_INVENTORY.md      # Design tokens, atomic primitives & components
│   ├── PHASE_1_ACCEPTANCE_CRITERIA.md      # Journey-by-journey acceptance criteria
│   ├── PHASE_1_TEST_REPORT.md              # Phase 1 prototype QA test report
│   ├── TEST_CATALOGUE_SPECIFICATION.md     # 36 deterministic fixtures & edge cases
│   ├── REAL_CATALOGUE_IMPORT_PLAN.md       # CSV import contract & migration pipeline
│   ├── PRODUCT_REQUIREMENTS.md             # Business context, personas & scope boundaries
│   ├── TECHNICAL_ARCHITECTURE.md           # Decoupled frontend/backend & security
│   ├── DATABASE_DESIGN.md                  # Relational schema & price snapshots
│   ├── API_CONTRACT_PLAN.md                # REST API endpoints & JSON envelopes
│   └── MVP_ROADMAP.md                      # Phases 0 to 7 engineering milestones
│
├── README.md                               # Master project overview & index
└── package.json                            # Root workspace orchestration scripts
```

---

## 3. Technology Stack

| Layer | Technology | Key Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js App Router (15.5) + React 19 + TypeScript | Editorial beauty presentation, responsive SSR/SSG rendering |
| **Styling** | Tailwind CSS 3.4 | Design tokens (Ivory `#F8F3EF`, Blush `#E8CFCB`, Rose `#A86F78`, Espresso `#453438`) |
| **Backend** | Node.js + Express.js 4.21 + TypeScript | Modular Monolith REST API gateway & business logic |
| **Database** | PostgreSQL 14+ / 18 + Prisma ORM 6.3 | Relational persistence, stock tracking, immutable order snapshots |
| **Testing** | Vitest 3.2 + Supertest | Unit and integration test suite |
| **Security** | Helmet + Rate Limiters + Zod | Strict input validation, header hardening, origin whitelisting |

---

## 4. Engineering Roadmap Status

- [x] **Phase 0: Blueprint & Remediation** (Completed & Audited)
- [x] **Phase 1: UX & Visual Design Prototype** (Completed & Approved)
- [x] **Phase 2: Technical Foundation & Database Activation** (Completed & Verified)
- [x] **Phase 3: Backend Catalogue, Inventory Read Models, Search & Media Foundation** (Completed & Verified)
- [x] **Phase 4: Production Storefront API Integration** (Completed & Verified)
- [ ] **Phase 5: Merchant CMS & Authentication** (Next Milestone)
- [ ] **Phase 6: Cart Engine, Stock Reservations & Guest Checkout**
- [ ] **Phase 7: Payment Gateway Integration & Go-Live**

---

## 5. Quick Start & Developer Runbook

### 5.1 Installation & Database Setup
```powershell
# Install dependencies
npm --prefix frontend install
npm --prefix backend install

# Apply database migrations
npm run prisma:migrate

# Seed development catalogue (36 products, 5 categories, 4 collections)
npm run seed:backend
```

### 5.2 Running the Applications
```powershell
# Run Next.js frontend prototype (http://localhost:3000)
npm run dev:frontend

# Run Express backend REST API (http://localhost:4000)
npm run dev:backend
```

### 5.3 Quality Assurance & Verification
```powershell
# Run backend test suite (Vitest)
npm run test:backend

# Check TypeScript types across both codebases
npm run type-check:frontend
npm run type-check:backend

# Build production bundles
npm run build:frontend
npm run build:backend

# Validate Prisma database schema
npm run prisma:validate
```
