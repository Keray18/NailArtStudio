# The Nail Lounge — E-Commerce Platform

> **Artistry at Your Fingertips**  
> Affordable, premium-grade handcrafted press-on nails, tools, and salon accessories delivered across India from Abohar, Punjab.

---

## 1. Project Overview

The Nail Lounge is a modern, mobile-first beauty e-commerce storefront combining high-fashion editorial aesthetics with social-commerce discovery and frictionless guest checkout.

This repository is organized as an independent, decoupled full-stack architecture:
- **`frontend/`**: Next.js (App Router), TypeScript, Tailwind CSS. Purely presentation, SSR/SSG catalog pages, and client state. Zero database or Prisma dependencies.
- **`backend/`**: Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM. Structured as a Modular Monolith managing all catalog data, inventory, cart synchronization, pincode validation, order placement, and Cloudinary media signatures.
- **`docs/`**: Comprehensive product, UX, architectural, and database blueprints established during **Phase 0 & Phase 1**.

---

## 2. Repository Structure

```text
nail-lounge/
├── docs/                                  # Architectural, UX & Design Blueprint
│   ├── PHASE_0_AUDIT_AND_CORRECTIONS.md   # Issue register & remediation of Phase 0
│   ├── PHASE_1_UX_STRATEGY.md             # IA tiering & page-by-page conversion specs
│   ├── PHASE_1_VISUAL_DIRECTIONS.md       # Editorial vs Modern Commerce comparison & hybrid standard
│   ├── PHASE_1_RESPONSIVE_SPECIFICATIONS.md# Viewport breakpoints (320px–1440px) & touch ergonomics
│   ├── PHASE_1_COMPONENT_INVENTORY.md     # Design tokens, atomic primitives & component specs
│   ├── PHASE_1_ACCEPTANCE_CRITERIA.md     # Journey-by-journey acceptance criteria
│   ├── TEST_CATALOGUE_SPECIFICATION.md    # 36 deterministic development fixtures & edge cases
│   ├── REAL_CATALOGUE_IMPORT_PLAN.md      # Future CSV import contract & migration pipeline
│   ├── PHASE_1_TEST_REPORT.md             # Evidence-based QA test report & journey verification
│   ├── PRODUCT_REQUIREMENTS.md            # Business context, personas & scope boundaries
│   ├── INFORMATION_ARCHITECTURE.md        # 18 proposed + 3 recommended pages
│   ├── CUSTOMER_JOURNEYS.md               # 6 end-to-end customer journey maps & friction audit
│   ├── CONVERSION_STRATEGY.md             # Merchandising axes, sizing & AOV expansion
│   ├── UX_WIREFRAMES.md                   # Desktop & mobile wireframes for all 13 core pages
│   ├── DESIGN_DIRECTION.md                # Design system tokens, typography & grid
│   ├── TECHNICAL_ARCHITECTURE.md          # Decoupled frontend/backend & security
│   ├── DATABASE_DESIGN.md                 # PostgreSQL ER diagram & price snapshots
│   ├── API_CONTRACT_PLAN.md               # REST API endpoints & JSON envelopes
│   ├── DEVELOPMENT_STANDARDS.md           # Coding standards, validation & Git workflow
│   ├── MVP_ROADMAP.md                     # Phases 0 to 7 engineering milestones & dependencies
│   └── OPEN_QUESTIONS.md                  # Critical business decisions requiring founder sign-off
├── frontend/                              # Next.js Storefront Prototype (Phase 1)
│   ├── public/                            # Static brand assets & fixture images
│   ├── src/
│   │   ├── app/                           # Next.js App Router (Storefront pages)
│   │   ├── components/                    # Atomic design system & feature components
│   │   ├── config/                        # Configurable brand parameters
│   │   ├── data/                          # 36 deterministic development fixtures
│   │   ├── hooks/                         # Client hooks (useCart, useWishlist)
│   │   ├── services/                      # Mock catalogue adapter (future REST client interface)
│   │   ├── styles/globals.css             # Tailwind design tokens & font styles
│   │   └── types/                         # TypeScript interfaces (Product, Cart, Order)
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── package.json
└── README.md                              # Master project overview & index
```

---

## 3. Technology Stack

| Layer | Technology | Key Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router) + TypeScript | Editorial beauty presentation, responsive SSR/SSG rendering |
| **Styling** | Tailwind CSS | Design tokens (Ivory `#F8F3EF`, Blush `#E8CFCB`, Rose `#A86F78`, Espresso `#453438`) |
| **Backend (Phase 2+)** | Node.js + Express.js + TypeScript | Modular Monolith REST API gateway & business logic |
| **Database (Phase 2+)**| PostgreSQL + Prisma ORM | Relational data persistence, stock reservation, immutable order snapshots |
| **Media CDN (Phase 3+)**| Cloudinary | Auto-format (WebP/AVIF), dynamic optimization, responsive image delivery |
| **Security** | Helmet + Rate Limiters + Zod | Strict input validation, header hardening, origin whitelisting |

---

## 4. Engineering Roadmap Status

- [x] **Phase 0: Blueprint & Remediation** (Completed & Audited)
- [x] **Phase 1: UX & Visual Design Prototype** (Completed — Pending User Review)
- [ ] **Phase 2: Technical Foundation & Decoupled Setup** (Awaiting Phase 1 Approval)
- [ ] **Phase 3: Backend Catalogue & Media Management**
- [ ] **Phase 4: Production Storefront Integration**
- [ ] **Phase 5: Cart Engine & Guest Checkout Orchestration**
- [ ] **Phase 6: Order Persistence & Launch Readiness**
- [ ] **Phase 7: Payment Gateway Integration & Go-Live**
