# Nail Art & Beauty E-Commerce — Platform Technical Foundation

> **Phase 0:** Technical Foundation & Infrastructure Setup

This repository contains the decoupled technical foundation for a production-oriented e-commerce application specializing in nail art and beauty products.

---

## Architecture Overview

The system strictly follows a decoupled, two-tier architecture:

```
[ Frontend: Next.js (App Router) ] 
       │
       │ HTTP / REST APIs (JSON)
       ▼
[ Backend: Node.js + Express + TypeScript ]
       │                               │
       ▼                               ▼
[ Database: PostgreSQL (Prisma ORM) ] [ Media Storage: Cloudinary CDN ]
```

### Architectural Principles & Boundaries
- **Strict Decoupling**: `/frontend` and `/backend` are independent applications with separate `package.json` configurations and dependencies. No monorepo orchestrator or shared packages are used.
- **No Next.js Backend APIs**: All business logic, Prisma ORM operations, database queries, and third-party credential management are strictly contained within the backend.
- **REST Communication**: The Next.js frontend interacts with the backend solely through standardized REST API endpoints via a centralized, typed API client (`apiClient`).
- **Security & Secret Isolation**: Cloudinary secrets and database connection credentials reside exclusively in the backend environment. The frontend only consumes public configuration variables (`NEXT_PUBLIC_*`).

---

## Folder Structure

```text
nail-art/
├── .gitignore                    # Global git ignore configuration
├── README.md                     # Technical foundation documentation
├── docs/
│   └── ARCHITECTURE.md           # In-depth architectural specification
├── frontend/
│   ├── .env.example              # Frontend environment template
│   ├── .gitignore                # Frontend-specific git ignore
│   ├── eslint.config.mjs         # ESLint configuration
│   ├── next.config.ts            # Next.js configuration
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # Frontend TypeScript configuration
│   ├── public/                   # Static assets (favicons, SVGs)
│   └── src/
│       ├── app/                  # Next.js App Router (layout, page)
│       ├── components/
│       │   ├── common/           # Shared utility components (Spinners, etc.)
│       │   ├── layout/           # Global shell components (Header, Footer)
│       │   └── ui/               # Reusable atomic UI (Button, Badge)
│       ├── features/             # Feature-specific modules (Health status card)
│       ├── hooks/                # Custom React hooks (useHealthCheck)
│       ├── lib/                  # Utilities, errors, and client config
│       ├── services/             # Typed API services (apiClient, healthService)
│       ├── styles/               # Global CSS & Tailwind styling
│       └── types/                # TypeScript interfaces and response schemas
└── backend/
    ├── .env.example              # Backend environment template
    ├── .gitignore                # Backend-specific git ignore
    ├── package.json              # Backend dependencies and scripts
    ├── tsconfig.json             # Backend TypeScript configuration
    ├── prisma/
    │   └── schema.prisma         # Prisma schema and datasource configuration
    └── src/
        ├── app.ts                # Express application setup & middleware assembly
        ├── server.ts             # Server entrypoint & graceful shutdown listeners
        ├── config/               # Environment, Prisma, and Cloudinary configs
        ├── controllers/          # Request controllers (thin controllers)
        ├── middleware/           # Central error, 404, rate limiting, and Zod validation
        ├── routes/               # API route definitions (/api/health, etc.)
        ├── services/             # Core business logic & storage integrations
        ├── utils/                # API response standardizers and error classes
        └── validators/           # Zod schema definitions and request contracts
```

---

## Prerequisites

Before starting, ensure the following are installed:
- **Node.js**: `v20.x` or higher (Recommended: `v22.x` or `v24.x`)
- **npm**: `v10.x` or higher
- **PostgreSQL**: `v14` or higher (local installation or hosted instance e.g., Supabase / Neon / AWS RDS)
- **Cloudinary Account**: Cloud name, API key, and API secret (for media asset management)

---

## Environment Variable Setup

Both applications require their own `.env` configuration file based on the provided `.env.example` templates.

### 1. Backend (`/backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Configure the following variables:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for Express API server | `5000` |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/nail_art_db?schema=public` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud account name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |

### 2. Frontend (`/frontend/.env.local`)

Copy `frontend/.env.example` to `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
```

Configure the following variable:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL accessible from browser/client | `http://localhost:5000/api` |

---

## Database Setup & Prisma Migrations

Prisma ORM manages migrations and database schema generation for PostgreSQL.

### Initial Setup Steps:
1. Ensure your PostgreSQL server is active and the target database is created:
   ```sql
   CREATE DATABASE nail_art_db;
   ```
2. Verify `DATABASE_URL` in `backend/.env`.
3. Generate the Prisma Client:
   ```bash
   npm run prisma:generate --prefix backend
   ```
4. Create and run the initial migration:
   ```bash
   npm run prisma:migrate --prefix backend
   ```
5. *(Optional)* Launch Prisma Studio to visualize database records:
   ```bash
   npm run prisma:studio --prefix backend
   ```

---

## Installation & Running Locally

Install dependencies for each application independently:

### 1. Backend Installation & Startup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Start in development mode (hot reloading via tsx)
npm run dev

# Or build and run production artifact:
npm run build
npm start
```

Backend will be accessible at: `http://localhost:5000`

### 2. Frontend Installation & Startup

Open a separate terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Or compile production build:
npm run build
npm start
```

Frontend will be accessible at: `http://localhost:3000`

---

## Health-Check Endpoint

The backend provides a standardized health check endpoint to monitor API uptime and database connectivity:

```http
GET /api/health
```

### Sample Response (Healthy):
```json
{
  "success": true,
  "message": "System is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2026-11-05T12:00:00.000Z",
    "uptimeSeconds": 142,
    "environment": "development",
    "services": {
      "database": {
        "status": "connected",
        "latencyMs": 14
      },
      "cloudinary": {
        "status": "configured"
      }
    }
  }
}
```

### Degraded Response (Database Unreachable or Missing Credentials):
Status code: `503 Service Unavailable`
```json
{
  "success": true,
  "message": "System is degraded",
  "data": {
    "status": "degraded",
    "timestamp": "2026-11-05T12:00:00.000Z",
    "uptimeSeconds": 12,
    "environment": "development",
    "services": {
      "database": {
        "status": "disconnected",
        "error": "Environment variable not found: DATABASE_URL."
      },
      "cloudinary": {
        "status": "unconfigured"
      }
    }
  }
}
```

---

## Next Steps

Following approval of Phase 0:
- **Phase 1**: Domain Data Modeling & Product Catalog APIs (Categories, Products, Variants, Inventory, Cloudinary asset uploads).

