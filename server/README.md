# Mini ERP + CRM — Server (Phase 1 + Phase 2: Complete Backend)

Phase 1 set up the backend skeleton. Phase 2 (this update) adds every
business module: JWT + RBAC auth, Customer CRM, Follow-up, Product,
Inventory, Sales Challan, and a Dashboard summary endpoint.

## What's included

- Express + TypeScript project, strict compiler settings
- Zod-validated environment config (`src/config/env.ts`) — the app refuses to boot with a bad `.env`
- Winston logger with console + rotating file transports (`src/config/logger.ts`), wired into `morgan` for HTTP access logs
- Prisma client singleton (`src/config/prisma.ts`) with dev-mode query logging and a global-object cache to survive nodemon reloads
- Security middleware: `helmet`, scoped `cors`, global + auth-specific rate limiting
- Central error handling: a typed `AppError` hierarchy, a Zod/Prisma-aware error middleware, and a 404 handler
- Generic `validate(schema)` middleware factory for Zod request validation
- `/api/v1/health` endpoint to confirm the server and DB connection

## Modules (Phase 2)

| Module | Base path | Roles allowed to write | Notes |
|---|---|---|---|
| Auth | `/api/v1/auth` | — (public register/login) | JWT access (15m) + refresh (7d), bcrypt password hashing |
| Dashboard | `/api/v1/dashboard` | any authenticated user | Read-only summary counts |
| Customer | `/api/v1/customers` | ADMIN, SALES (delete: ADMIN only) | CRUD, search, pagination, filter by status/type |
| Follow-up | `/api/v1/followups` | ADMIN, SALES | Add/edit, history per customer, syncs `Customer.followUpDate` |
| Product | `/api/v1/products` | ADMIN, WAREHOUSE (delete: ADMIN only) | CRUD, search, low-stock filter |
| Inventory | `/api/v1/inventory` | ADMIN, WAREHOUSE | Stock in/out (transactional), movement history, low-stock alert |
| Sales Challan | `/api/v1/challans` | ADMIN, SALES (status change also WAREHOUSE) | Draft → Confirmed → Cancelled, auto numbering, product snapshots, stock reduction |

### Key business rules implemented

- **Auto challan numbering**: `CH-YYYY-000001`, sequential per calendar year (`helpers/challanNumber.helper.ts`).
- **Negative stock prevention**: every stock-out and challan confirmation re-checks current stock *inside* the same Prisma `$transaction` right before decrementing, so two concurrent requests can't both pass validation and push stock below zero.
- **Product snapshotting**: `ChallanItem` stores `productNameSnapshot`, `productSkuSnapshot`, `unitPriceSnapshot` at creation time — editing or deleting the product later never changes a historical challan.
- **Challan status state machine**: `DRAFT → CONFIRMED`, `DRAFT → CANCELLED`, `CONFIRMED → CANCELLED` are the only valid transitions; confirming reduces stock, cancelling a confirmed challan restores it. Enforced in `assertValidTransition()` in `challan.service.ts`.
- **RBAC**: `authenticate` (verifies JWT) always runs before `authorize(...roles)` (checks `req.user.role`) on every protected route.

## Folder structure (Phase 1 + Phase 2)

```
server/
├── src/
│   ├── config/         env.ts, logger.ts, prisma.ts, jwt.ts
│   ├── controllers/     auth, dashboard, customer, followup, product, inventory, challan
│   ├── services/        auth, dashboard, customer, followup, product, inventory, challan
│   ├── repositories/     auth, customer, followup, product, inventory, challan
│   ├── routes/           index.ts + one router per module
│   ├── dto/              per-module response DTOs + mappers
│   ├── validators/       per-module Zod schemas
│   ├── middlewares/      auth, role (RBAC), validation, error, rateLimiter
│   ├── errors/           AppError hierarchy
│   ├── interfaces/       express.d.ts (req.user), pagination.interface.ts
│   ├── utils/            asyncHandler, apiResponse, pagination
│   ├── helpers/          challanNumber.helper.ts
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma     (all 7 models + 5 enums)
│   └── seed.ts           (demo users for every role + sample customers/products)
├── .env / .env.example
├── package.json
└── tsconfig.json
```

## Package installation

```bash
cd server
npm install
```

### What was installed and why

**Runtime dependencies**
| Package | Purpose |
|---|---|
| `express` | HTTP server / routing |
| `@prisma/client` | Type-safe DB client generated from `schema.prisma` |
| `zod` | Runtime schema validation (env vars now, DTOs in Phase 2) |
| `jsonwebtoken` | Signing/verifying JWT access & refresh tokens (Phase 2 auth) |
| `bcrypt` | Password hashing (Phase 2 auth) |
| `helmet` | Sets secure HTTP headers |
| `cors` | Restricts cross-origin requests to the configured client origin |
| `express-rate-limit` | Throttles requests to slow brute-force/abuse |
| `winston` | Structured, leveled logging to console + files |
| `morgan` | HTTP request logging, piped into winston |
| `dotenv` | Loads `.env` into `process.env` |

**Dev dependencies**: `typescript`, `ts-node`, `nodemon` (hot reload), `prisma` (CLI for migrate/generate/studio), `@types/*` for the above, plus `eslint`/`jest` scaffolding for later.

### Configure environment variables

```bash
cp .env.example .env
```

Then fill in `DATABASE_URL` with your Neon PostgreSQL connection string, and replace `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` with strong random values, e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Generate the Prisma client and run the dev server

```bash
npm run prisma:generate
npm run dev
```

Visit `http://localhost:5000/api/v1/health` — you should see:

```json
{ "success": true, "message": "Mini ERP + CRM API is running", "timestamp": "..." }
```

## Known limitation of this scaffold

`prisma generate` downloads a query-engine binary from `binaries.prisma.sh` the
first time it runs for a given Prisma version. This requires outbound network
access; in fully offline/sandboxed environments the command will fail until
that domain is reachable (or the engine is cached). It works normally on a
standard development machine or CI runner with internet access.

## Next: Phase 2

Reply `NEXT` to generate the complete backend: Prisma models (User, Customer,
Followup, Product, InventoryMovement, Challan, ChallanItem), auth (JWT +
bcrypt + RBAC), and full controller/service/repository/route/DTO/validator
layers for every required module.
