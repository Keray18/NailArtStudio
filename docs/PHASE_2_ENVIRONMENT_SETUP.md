# The Nail Lounge — Phase 2: Environment Setup & Developer Guide

**Document Version:** 1.0.0  
**Phase:** Phase 2 (Technical Foundation)  
**Target Environment:** Node.js v20+ (Verified on v24.14.1), npm 11+, PostgreSQL 14+ (Verified on v18)  

---

## 1. Prerequisites & Tooling Inventory

Ensure the following tools are installed on your workstation:
- **Node.js:** v20.x or higher (Verified with `node v24.14.1`)
- **npm:** v10.x or higher (Verified with `npm 11.7.0`)
- **PostgreSQL:** v14 or higher (PostgreSQL 18 server detected locally on port 5432)
- **Git:** Git 2.40+

---

## 2. Directory Layout & Workspaces

The repository is organized as a decoupled monorepo:

```text
the-nail-lounge/
├── frontend/    # Next.js App Router Storefront (Port 3000)
├── backend/     # Express.js REST API & Persistence (Port 4000)
├── docs/        # Architectural and technical documentation
└── package.json # Root workspace orchestrator scripts
```

---

## 3. Environment Variable Configuration

### 3.1 Backend Environment Setup

Create `backend/.env` by copying `backend/.env.example`:

```powershell
Copy-Item backend/.env.example backend/.env
```

| Variable | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | No | `development` | Runtime mode: `development`, `test`, or `production`. |
| `PORT` | No | `4000` | HTTP TCP port for the Express API server. |
| `FRONTEND_ORIGIN` | No | `http://localhost:3000` | CORS whitelisted storefront origin. |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string. |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` (15 mins) | Time window in milliseconds for rate limiter. |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Maximum requests permitted per IP per window. |
| `LOG_LEVEL` | No | `info` | Minimum log level: `debug`, `info`, `warn`, `error`. |

**Example `DATABASE_URL`:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/the_nail_lounge?schema=public"
```

### 3.2 Frontend Environment Setup

The frontend runs in prototype mode without requiring any `.env` file. If connecting to a custom backend URL during development, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

---

## 4. Database Setup & Prisma Workflows

### 4.1 Database Creation
Using `psql`:
```sql
CREATE DATABASE the_nail_lounge;
```

### 4.2 Applying Schema Migrations
Apply the initial migration:
```powershell
npm --prefix backend run prisma:migrate
```

### 4.3 Prisma Client Generation
Whenever `backend/prisma/schema.prisma` is modified, re-generate the Prisma client:
```powershell
npm --prefix backend run prisma:generate
```

### 4.4 Inspecting Database with Prisma Studio
To launch the visual database browser:
```powershell
npx --prefix backend prisma studio --schema prisma/schema.prisma
```
Prisma Studio opens at `http://localhost:5555`.

---

## 5. Development Runbook

### 5.1 Running the Frontend Prototype
```powershell
# From root
npm run dev:frontend

# Or directly in frontend/
cd frontend
npm run dev
```
Visit `http://localhost:3000` in your browser. All 15 storefront pages run against `MockCatalogueAdapter`.

### 5.2 Running the Backend REST API
```powershell
# From root
npm run dev:backend

# Or directly in backend/
cd backend
npm run dev
```
The server listens on `http://localhost:4000`. Test the health check:
- `http://localhost:4000/api/v1/health`
- `http://localhost:4000/api/v1/ready`

### 5.3 Running Backend Automated Tests
```powershell
# From root
npm run test:backend

# Or directly in backend/
cd backend
npm test
```
All 17 tests will execute via Vitest.

