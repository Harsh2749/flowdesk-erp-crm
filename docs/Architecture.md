# Architecture

## Overview

A two-tier web app: a Vite/React SPA talking to an Express/TypeScript REST API over JSON, backed by PostgreSQL via Prisma.

```
┌─────────────────┐        HTTPS/JSON        ┌──────────────────┐        SQL         ┌──────────────┐
│  React (Vite)    │ ───────────────────────► │  Express + TS API │ ─────────────────► │  PostgreSQL   │
│  Bootstrap 5 UI   │ ◄─────────────────────── │  /api/v1/*        │ ◄───────────────── │  (Neon)       │
└─────────────────┘        JWT Bearer         └──────────────────┘   Prisma Client     └──────────────┘
```

## Backend layering

Each module (customer, product, followup, inventory, challan, auth, dashboard) follows the same layered pattern:

```
Route  →  Middleware (auth, RBAC, Zod validation)  →  Controller  →  Service  →  Repository  →  Prisma
                                                            │
                                                            ▼
                                                   DTO (response shape)
```

- **Routes** (`src/routes/*.routes.ts`): declare the URL, HTTP verb, middleware chain, and controller method. No business logic.
- **Middleware**: `authenticate` (verifies JWT, attaches `req.user`), `authorize(...roles)` (RBAC), `validate(schema)` (Zod, validates body/query/params before the controller runs).
- **Controllers** (`src/controllers/*.controller.ts`): thin — extract request data, call the service, format the response via `sendSuccess`. Wrapped in `asyncHandler` so rejected promises reach the central error middleware.
- **Services** (`src/services/*.service.ts`): all business logic and transaction boundaries live here — e.g. challan status transitions, stock reduction/prevention, follow-up date syncing.
- **Repositories** (`src/repositories/*.repository.ts`): the only files that call `prisma.*` directly. Keeps Prisma query shape out of business logic and makes services testable by mocking a thin interface.
- **DTOs** (`src/dto/*/*.dto.ts`): map Prisma models to the exact shape returned to the client (e.g. `Decimal` → `number`, hides `passwordHash`).
- **Errors** (`src/errors/AppError.ts`): a typed hierarchy (`BadRequestError`, `NotFoundError`, `ConflictError`, etc.) that the central `error.middleware.ts` turns into consistent `{ success, message, errors? }` JSON responses — also maps Zod and known Prisma errors (e.g. unique constraint violations) into the same shape.

## Key design decisions

- **Repository pattern**: chosen so the service layer never imports `@prisma/client` query builders directly, keeping business logic (e.g. the challan state machine) unit-testable without a database.
- **Transactions at the service layer**: every operation that touches more than one table atomically (challan creation + stock reduction + movement logging) runs inside a single `prisma.$transaction`, with stock levels re-checked *inside* the transaction to close the race-condition window between two concurrent requests.
- **Snapshotting over foreign-key-only references**: `ChallanItem` stores `productNameSnapshot`/`productSkuSnapshot`/`unitPriceSnapshot` at creation time so a later product edit or price change never rewrites history.
- **JWT access + refresh pair**: short-lived (15m) access token to limit exposure if leaked; long-lived (7d) refresh token, with the frontend's Axios interceptor handling silent refresh and request queueing during the refresh window.
- **RBAC via middleware composition**: `authenticate` always precedes `authorize(...)`, so role checks never run against an unauthenticated request; roles are enforced identically on the frontend (hiding actions) and backend (actually rejecting them) — the frontend check is UX only, the backend is the real boundary.

## Frontend structure

- **Contexts** (`AuthContext`, `ThemeContext`, `SidebarContext`, `ToastContext`) hold cross-cutting UI state; consumed via matching hooks (`useAuth`, `useTheme`, etc.) rather than prop drilling.
- **Layouts** (`DashboardLayout`, `AuthLayout`, `BlankLayout`) separate chrome (sidebar/navbar) from page content via `<Outlet />`.
- **Routing** (`AppRoutes.tsx`): `ProtectedRoute` gates the entire dashboard layout behind authentication; `RoleRoute` is available for role-gating specific routes if needed beyond the current UI-level hiding.
- **API layer** (`src/api/*.api.ts`): one file per backend module, thin wrappers around a shared `axios` instance that injects the JWT and silently retries once on a 401 via `/auth/refresh`.

## Data flow example: confirming a Sales Challan

1. User clicks "Confirm Challan" → `ChallanStatusActions` shows a `ConfirmDialog`.
2. On confirm, frontend calls `PATCH /api/v1/challans/:id/status` with `{ status: "CONFIRMED" }`.
3. `authenticate` + `authorize(ADMIN, SALES, WAREHOUSE)` run, then `validate(changeChallanStatusSchema)`.
4. `challanController.changeStatus` → `challanService.changeStatus`.
5. Service validates the transition (`DRAFT → CONFIRMED` is legal), opens a `$transaction`, re-reads each line item's product stock, decrements it (throwing `BadRequestError` — which rolls back the whole transaction — if any item would go negative), logs an `InventoryMovement` per item, and updates the challan's status.
6. Response DTO returned; frontend shows a toast and refetches the challan.
