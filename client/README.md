# Mini ERP + CRM — Client (Phase 3: Complete Frontend)

React + Vite + TypeScript + Bootstrap 5 frontend for the backend built in Phase 1/2.

## What's included

- **Auth**: JWT login, token persisted in `localStorage`, automatic access-token refresh via Axios interceptor with request queueing during refresh
- **RBAC-aware UI**: create/edit/delete actions are hidden per the same role rules enforced server-side (Admin, Sales, Warehouse, Accounts)
- **Dashboard**: live stat cards (customers, products, low stock, challan counts, follow-ups due today)
- **Customer CRM**: list with search/filter/pagination, create/edit modal, detail page with embedded follow-up history and add/edit follow-up modal
- **Products**: list with search/pagination, create/edit modal, low-stock indicator
- **Inventory**: stock in/out modal (calls the same transactional, negative-stock-safe endpoints as the backend), movement history table, low-stock alert panel
- **Sales Challan**: multi-product dynamic line-item form (react-hook-form `useFieldArray`), live estimated total, save-as-draft vs confirm-and-reduce-stock, detail page with status actions (confirm / cancel) driven by the same state machine as the backend
- **Responsive SaaS shell**: collapsible sidebar (mobile drawer), topbar with theme toggle (light/dark) and user menu, Bootstrap grid throughout
- **Toasts** for every success/error via `react-toastify`

## Package installation

```bash
cd client
npm install
```

**Key dependencies**: `react-router-dom` (routing + protected/role routes), `axios` (API client + refresh interceptor), `react-hook-form` (all forms, including dynamic challan line items via `useFieldArray`), `react-bootstrap` + `bootstrap` (UI), `react-toastify` (notifications), `react-icons` (iconography).

### Configure environment variables

```bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` to your running backend, e.g. `http://localhost:5000/api/v1`.

### Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173`. Log in with any of the seeded demo accounts (see `server/prisma/seed.ts`):

| Role | Email | Password |
|---|---|---|
| Admin | admin@minierp.test | Passw0rd!123 |
| Sales | sales@minierp.test | Passw0rd!123 |
| Warehouse | warehouse@minierp.test | Passw0rd!123 |
| Accounts | accounts@minierp.test | Passw0rd!123 |

### Build for production

```bash
npm run build
```

Output goes to `client/dist/` — deployable as a static site (Vercel, Netlify, Render Static Site).

## Validated

- `npx tsc --noEmit` — zero errors
- `npx eslint "src/**/*.{ts,tsx}"` — zero errors
- `npx vite build` — production build succeeds (473 modules, ~132 KB gzipped JS)

## Scope notes

- Signup / Forgot Password / Reset Password / OAuth Callback pages exist as minimal placeholders to match the required folder structure, but are **not wired to backend endpoints** — the assignment only requires JWT login, and the backend only implements `/auth/login`, `/auth/refresh`, and `/auth/me`. New users are provisioned via `prisma/seed.ts` or directly by an Admin.
- The Follow-ups sidebar page is a landing/explainer screen: the backend only exposes follow-up listing scoped to a single customer (`GET /followups/customer/:customerId`), so day-to-day follow-up work happens from a customer's detail page, matching the actual API surface.

## Next: Phase 4

Reply `NEXT` for testing, Postman collection, README consolidation, deployment docs, architecture documentation, and the final submission checklist.
