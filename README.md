<div align="center">

# ✦ FlowDesk ERP CRM

### A Full-Stack ERP + CRM System for Wholesale/Distribution Businesses

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**[Live Demo](#)** &nbsp;•&nbsp; **[API Docs](#-api-endpoints)** &nbsp;•&nbsp; **[Postman Collection](#-testing)** &nbsp;•&nbsp; **[GitHub](#)**

</div>

---

## Table of Contents

- [Live Links](#-live-links)
- [About](#-about)
- [Features](#-modules-implemented)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Architecture](#-architecture-short-version)
- [Assumptions & Limitations](#-assumptions-made)
- [Author](#-author)

---

## Live Links

| Service                 | URL                                       |
|-------------------------|-------------------------------------------|
| **Frontend (Live App)** | `<add your Vercel URL>`                   |
| **Backend API**         | `<add your Render URL>/api/v1`            |
| **API Health Check**    | `<add your Render URL>/health`            |
| **GitHub Repository**   | `<add your GitHub repo URL>`              |
| **Postman Collection**  | `postman/ERP-CRM.postman_collection.json` |

---

## About

**Mini ERP + CRM Operations Portal** is a full-stack case-study submission — a small ERP/CRM system built for a wholesale/distribution company. It covers customers, products, stock, and sales challans across four role-based users: **Admin**, **Sales**, **Warehouse**, and **Accounts**.

The system enforces role-based access control on every write route, uses real PostgreSQL transactions for stock-critical operations (like confirming a sales challan), and follows a clean layered backend architecture — `Route → Middleware → Controller → Service → Repository → Database`.

---

## Modules Implemented

### Authentication & Roles
- JWT access token (15 min) + refresh token (7 days)
- bcrypt password hashing
- RBAC (Role-Based Access Control) middleware enforced on every write route
- Silent token refresh via Axios interceptor

### Customer CRM
- Full CRUD (Create, Read, Update, Delete)
- Search by name with debounce
- Pagination (configurable page size)
- Filter by status and customer type
- Dedicated Customer Detail page

### Follow-up
- Add and edit follow-ups per customer
- Full follow-up history view
- Automatically syncs the customer's headline "next follow-up" date

### Product & Inventory
- Product CRUD (create, edit, delete)
- Stock In / Stock Out — fully transactional
- Complete inventory movement history log
- Low-stock alert banner

### Sales Challan
- Multi-product line items per challan
- Auto challan numbering — format `CH-YYYY-000001`, resets every calendar year
- State machine: **Draft → Confirmed → Cancelled**
- Product data snapshotting at confirmation time
- **Stock reduction on confirm**, with negative-stock prevention (real DB transaction)
- Automatic restock when a confirmed challan is cancelled

### UI / UX
- Premium dark glassmorphism design with a global background image
- Split-screen authentication pages
- Separate Dashboard (summary) and My Tasks-style full list pages per module
- Responsive design — works on desktop, tablet, and mobile
- Toast notifications for every action (success / error)
- Smooth animations and hover effects throughout

---

## Tech Stack

| Layer                | Technology                                  |
|----------------------|---------------------------------------------|
| **Frontend**         | React 18 + Vite 5 + TypeScript              |
| **Styling**          | Bootstrap 5 + Custom CSS (Glassmorphism)    |
| **State**            | React Context (Auth, Theme, Sidebar, Toast) |
| **HTTP Client**      | Axios (auto refresh-token retry)            |
| **Backend**          | Node.js + Express + TypeScript              |
| **ORM**              | Prisma                                      |
| **Database**         | PostgreSQL                                  |
| **Auth**             | JWT (Access + Refresh)                      |
| **Security**         | bcryptjs, Zod validation, RBAC middleware   |
| **Containerisation** | Docker + Docker Compose                     |

---

## Project Structure

FlowDesk ERP CRM/
│
├── client/ # React + Vite + TypeScript Frontend
│ ├── public/
│ │ ├── favicon.ico
│ │ ├── logo.png
│ │ └── robots.txt
│ ├── src/
│ │ ├── api/
│ │ │ ├── axios.ts # Axios instance with refresh-token retry
│ │ │ ├── auth.api.ts
│ │ │ ├── dashboard.api.ts
│ │ │ ├── customer.api.ts
│ │ │ ├── followup.api.ts
│ │ │ ├── product.api.ts
│ │ │ ├── inventory.api.ts
│ │ │ └── challan.api.ts
│ │ ├── assets/
│ │ │ ├── images/
│ │ │ ├── icons/
│ │ │ └── logos/
│ │ ├── components/
│ │ │ ├── common/ # Button, Input, Select, Table, Modal, Card,
│ │ │ │ # Badge, Loader, Pagination, SearchBar, etc.
│ │ │ ├── layout/ # Navbar, Sidebar, Footer, Breadcrumb
│ │ │ ├── auth/
│ │ │ ├── dashboard/
│ │ │ ├── customer/
│ │ │ ├── followup/
│ │ │ ├── product/
│ │ │ ├── inventory/
│ │ │ └── challan/
│ │ ├── pages/
│ │ │ ├── auth/
│ │ │ │ ├── Login.tsx
│ │ │ │ ├── Signup.tsx
│ │ │ │ ├── ForgotPassword.tsx
│ │ │ │ ├── ResetPassword.tsx
│ │ │ │ └── OAuthCallback.tsx
│ │ │ ├── dashboard/
│ │ │ ├── customer/
│ │ │ ├── followup/
│ │ │ ├── product/
│ │ │ ├── inventory/
│ │ │ ├── challan/
│ │ │ └── errors/
│ │ │ ├── NotFound.tsx
│ │ │ ├── Unauthorized.tsx
│ │ │ └── ServerError.tsx
│ │ ├── layouts/
│ │ │ ├── AuthLayout.tsx
│ │ │ ├── DashboardLayout.tsx
│ │ │ └── BlankLayout.tsx
│ │ ├── routes/
│ │ │ ├── AppRoutes.tsx
│ │ │ ├── ProtectedRoute.tsx
│ │ │ └── RoleRoute.tsx
│ │ ├── context/
│ │ │ ├── AuthContext.tsx
│ │ │ ├── ThemeContext.tsx
│ │ │ ├── SidebarContext.tsx
│ │ │ └── ToastContext.tsx
│ │ ├── hooks/
│ │ │ ├── useAuth.ts
│ │ │ ├── useAxios.ts
│ │ │ ├── useDebounce.ts
│ │ │ ├── usePagination.ts
│ │ │ ├── useSearch.ts
│ │ │ └── useTheme.ts
│ │ ├── services/
│ │ ├── utils/
│ │ ├── constants/
│ │ ├── types/
│ │ ├── styles/
│ │ ├── App.tsx
│ │ ├── main.tsx
│ │ └── vite-env.d.ts
│ ├── .env.example
│ ├── package.json
│ ├── tsconfig.json
│ └── vite.config.ts
│
├── server/ # Node.js + Express + TypeScript Backend
│ ├── src/
│ │ ├── config/
│ │ │ ├── prisma.ts
│ │ │ ├── passport.ts
│ │ │ ├── logger.ts
│ │ │ └── env.ts
│ │ ├── controllers/
│ │ │ ├── auth.controller.ts
│ │ │ ├── dashboard.controller.ts
│ │ │ ├── customer.controller.ts
│ │ │ ├── followup.controller.ts
│ │ │ ├── product.controller.ts
│ │ │ ├── inventory.controller.ts
│ │ │ └── challan.controller.ts
│ │ ├── services/ # Business logic + DB transactions
│ │ │ ├── auth.service.ts
│ │ │ ├── dashboard.service.ts
│ │ │ ├── customer.service.ts
│ │ │ ├── followup.service.ts
│ │ │ ├── product.service.ts
│ │ │ ├── inventory.service.ts
│ │ │ └── challan.service.ts
│ │ ├── repositories/ # Only layer that touches Prisma directly
│ │ ├── routes/
│ │ │ ├── index.ts
│ │ │ ├── auth.routes.ts
│ │ │ ├── dashboard.routes.ts
│ │ │ ├── customer.routes.ts
│ │ │ ├── followup.routes.ts
│ │ │ ├── product.routes.ts
│ │ │ ├── inventory.routes.ts
│ │ │ └── challan.routes.ts
│ │ ├── dto/ # Request/response DTOs per module
│ │ ├── entities/
│ │ │ ├── User.ts
│ │ │ ├── Customer.ts
│ │ │ ├── Followup.ts
│ │ │ ├── Product.ts
│ │ │ ├── InventoryMovement.ts
│ │ │ ├── Challan.ts
│ │ │ └── ChallanItem.ts
│ │ ├── middlewares/
│ │ │ ├── auth.middleware.ts
│ │ │ ├── role.middleware.ts # RBAC enforcement
│ │ │ ├── validation.middleware.ts
│ │ │ ├── error.middleware.ts
│ │ │ └── rateLimiter.middleware.ts
│ │ ├── validators/ # Zod schemas
│ │ ├── interfaces/
│ │ ├── types/
│ │ ├── enums/
│ │ ├── constants/
│ │ ├── helpers/
│ │ ├── utils/
│ │ ├── errors/ # AppError hierarchy
│ │ ├── database/
│ │ ├── app.ts
│ │ └── server.ts
│ ├── prisma/
│ │ ├── schema.prisma
│ │ ├── migrations/
│ │ └── seed.ts # Demo users + sample data
│ ├── uploads/
│ ├── logs/
│ ├── .env
│ ├── .env.example
│ ├── package.json
│ └── tsconfig.json
│
├── postman/
│ └── ERP-CRM.postman_collection.json
│
├── docs/
│ ├── API.md
│ ├── Architecture.md
│ ├── Database.md
│ └── Deployment.md
│
├── .gitignore
├── docker-compose.yml
├── README.md
├── package.json
└── LICENSE

---

## Getting Started

### Prerequisites

| Tool       | Version | Download               |
|------------|---------|------------------------|
| Node.js    | v18+    | https://nodejs.org     |
| PostgreSQL | v14+    | https://postgresql.org |
| Git        | Latest  | https://git-scm.com    |

### 1. Clone the Repository

```bash
git clone <this-repo>
cd mini-erp-crm-portal
```

### 2. Backend Setup

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Copy environment file and fill in your values
cp .env.example .env
# Set DATABASE_URL (Neon or local Postgres) + JWT secrets

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed demo users + sample data
npm run prisma:seed

# Start the development server
npm run dev
```

Backend runs at: **http://localhost:5000**

### 3. Frontend Setup

```bash
# Open a new terminal, navigate to client
cd client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Verify VITE_API_BASE_URL=http://localhost:5000/api/v1

# Start the development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

### 4. Or Run Everything With Docker

Spins up Postgres + API + frontend together:

```bash
docker compose up --build
docker compose exec server npx prisma migrate deploy
docker compose exec server npm run prisma:seed
```

### 5. Verify Everything Works

```bash
# Test backend health
curl http://localhost:5000/health
# Expected: {"status":"ok","timestamp":"..."}
```

Then open **http://localhost:5173** in your browser.

---

## Test Login Credentials

Seeded by `server/prisma/seed.ts` — all four roles share the same password:

| Role      | Email                  | Password         |
|-----------|------------------------|------------------|
| Admin     | admin@minierp.test     | Passw0rd!123     |
| Sales     | sales@minierp.test     | Passw0rd!123     |
| Warehouse | warehouse@minierp.test | Passw0rd!123     |
| Accounts  | accounts@minierp.test  | Passw0rd!123     |

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description                       |
|--------|------------------|-----------------------------------|
| `POST` | `/auth/register` | Register new user                 |
| `POST` | `/auth/login`    | Login with email/password         |
| `POST` | `/auth/refresh`  | Refresh access token              |
| `POST` | `/auth/logout`   | Logout & invalidate refresh token |
| `GET`  | `/auth/me`       | Get current authenticated user    |

### Customers

| Method   | Endpoint         | Description                           |
|----------|------------------|---------------------------------------|
| `GET`    | `/customers`     | List customers (paginated + filtered) |
| `POST`   | `/customers`     | Create a new customer                 |
| `GET`    | `/customers/:id` | Get customer by ID                    |
| `PATCH`  | `/customers/:id` | Update customer                       |
| `DELETE` | `/customers/:id` | Delete customer                       |

### Follow-ups

| Method  | Endpoint                   | Description                          |
|---------|----------------------------|--------------------------------------|
| `GET`   | `/customers/:id/followups` | Get follow-up history for a customer |
| `POST`  | `/customers/:id/followups` | Add a follow-up                      |
| `PATCH` | `/followups/:id`           | Edit a follow-up                     |

### Products & Inventory

| Method    | Endpoint               | Description                          |
|-----------|------------------------|--------------------------------------|
| `GET`     | `/products`            | List products (paginated + filtered) |
| `POST`    | `/products`            | Create a new product                 |
| `PATCH`   | `/products/:id`        | Update product                       |
| `DELETE`  | `/products/:id`        | Delete product                       |
| `POST`    | `/inventory/stock-in`  | Add stock (transactional)            |
| `POST`    | `/inventory/stock-out` | Remove stock (transactional)         |
| `GET`     | `/inventory/movements` | Get movement history                 |

### Sales Challans

| Method  | Endpoint                | Description                          |
|---------|-------------------------|--------------------------------------|
| `GET`   | `/challans`             | List challans (paginated + filtered) |
| `POST`  | `/challans`             | Create a new challan (Draft)         |
| `GET`   | `/challans/:id`         | Get challan by ID                    |
| `PATCH` | `/challans/:id/confirm` | Confirm challan — reduces stock      |
| `PATCH` | `/challans/:id/cancel`  | Cancel challan — restocks items      |

### Query Parameters (list endpoints)

| Parameter | Type   | Description              |
|-----------|--------|--------------------------|
| `page`    | number | Page number (default: 1) |
| `limit`   | number | Items per page           |
| `search`  | string | Search by name           |
| `status`  | string | Filter by status         |

See `docs/API.md` for the complete endpoint reference including request/response schemas.

---

## Environment Variables

### Server (`server/.env`)

| Variable               | Description                  | Example                |                     
|------------------------|------------------------------|------------------------|
| `DATABASE_URL`         | PostgreSQL connection string | `postgresql://...`     |
| `JWT_ACCESS_SECRET`    | Secret for access tokens     | 32+ char random string |
| `JWT_REFRESH_SECRET`   | Secret for refresh tokens    | 32+ char random string |
| `ACCESS_TOKEN_EXPIRY`  | Access token lifetime        | `15m`                  |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime       | `7d`                   |
| `PORT`                 | Server port                  | `5000`                 |
| `CLIENT_URL`           | Frontend URL                 | `http://localhost:5173`|

### Client (`client/.env`)

| Variable            | Description          | Example                        |
|---------------------|----------------------|--------------------------------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(SALES)  // ADMIN | SALES | WAREHOUSE | ACCOUNTS
  createdAt DateTime @default(now())
}

model Customer {
  id                String     @id @default(cuid())
  name              String
  type              String
  status            String     @default("ACTIVE")
  nextFollowupDate  DateTime?
  createdAt         DateTime   @default(now())
}

model Followup {
  id         String   @id @default(cuid())
  customerId String
  note       String
  followupDate DateTime
  createdAt  DateTime @default(now())
}

model Product {
  id        String   @id @default(cuid())
  name      String
  sku       String   @unique
  stock     Int      @default(0)
  price     Decimal
  createdAt DateTime @default(now())
}

model InventoryMovement {
  id        String   @id @default(cuid())
  productId String
  type      String   // IN | OUT
  quantity  Int
  reason    String?
  createdAt DateTime @default(now())
}

model Challan {
  id            String        @id @default(cuid())
  challanNumber String        @unique   // CH-YYYY-000001
  customerId    String
  status        ChallanStatus @default(DRAFT)  // DRAFT | CONFIRMED | CANCELLED
  items         ChallanItem[]
  createdAt     DateTime      @default(now())
}

model ChallanItem {
  id         String  @id @default(cuid())
  challanId  String
  productId  String
  quantity   Int
  unitPrice  Decimal   // snapshot at confirmation time
}
```

See `docs/Database.md` for the full schema with relations and indexes.

---

## Testing

```bash
cd server
npm test
```

11 unit tests covering the `AppError` hierarchy, pagination helpers, and challan-number generation — all passing.

Full end-to-end testing is via the Postman collection (`postman/ERP-CRM.postman_collection.json`) against a running instance, since core business logic — stock reduction, negative-stock prevention, challan state transitions — depends on a real PostgreSQL transaction to verify meaningfully. The unit tests cover the pure-logic pieces that don't require a database.

Both frontend and backend were validated end-to-end during development:

- `npx tsc --noEmit` — zero errors on both projects
- `npx eslint` — zero errors on both projects
- `npm run build` — production build succeeds on both projects (backend compiles to `dist/`, frontend bundles to `client/dist/`, 473 modules, ~132 KB gzipped JS)

---

## Architecture (short version)

**Backend** — Layered architecture:

**Frontend** — Context-based auth/theme/toast/sidebar state, an Axios instance with automatic refresh-token retry, and one API client + one page/component set per backend module.

Full write-up with a request-flow example (confirming a challan) in `docs/Architecture.md`. Frontend details in `client/README.md`.

---

## Assumptions Made

- Simple JWT-based authentication is used per the assignment scope — no OAuth, no email verification, no password-reset email flow. Users are provisioned via the seed script or by an Admin.
- Challan numbering resets per calendar year (`CH-2026-000001`, `CH-2027-000001`, ...) since no numbering scheme was specified.
- Reports, Notifications, Profile, and Settings are intentionally not built out as full modules per the assignment's scope guidance — the Follow-ups page is a lightweight landing screen rather than a standalone module, since the backend only exposes follow-up data scoped to a single customer.
- Currency formatting defaults to INR (`en-IN` locale) given the wholesale/distribution business context; configurable in `client/src/utils/format.ts`.

---

## Known Limitations

- **No automated end-to-end/integration tests against a live database** — priority was placed on complete, correct business logic (verified manually via Postman and by reviewing transaction logic under concurrent-request scenarios) over building a test-database harness.
- **No file/image upload** (e.g. product images) — listed only as a bonus item.
- **No PDF export for challans** — listed only as a bonus item.
- **Signup / Forgot Password / Reset Password pages are placeholders** — present to match the required folder structure, but not wired to backend endpoints, since only login was required and the backend intentionally implements just `/auth/login`, `/auth/refresh`, and `/auth/me`.
- **Prisma engine binary requires outbound internet access** the first time `prisma generate` or `prisma migrate` runs — normal on any dev machine or CI runner; relevant only in fully air-gapped environments.

---

## 👤 Author

**Harsh Raj**

[![GitHub](https://img.shields.io/badge/GitHub-Harsh2749-181717?style=for-the-badge&logo=github)](https://github.com/Harsh2749)

[![Repository](https://img.shields.io/badge/Repository-FlowDesk_ERP_CRM-2ea44f?style=for-the-badge&logo=github)](https://github.com/Harsh2749/flowdesk-erp-crm)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harsh_Raj-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/its-harshraj)

📧 **Email:** harshraj2749@gmail.com

---

## 📄 License

This project was developed for assessment and educational purposes.

---

<div align="center">

Made with ❤️ using **React, Node.js, Express.js, Prisma & PostgreSQL**

⭐ **If you found this project helpful, please consider starring the repository!**

🔗 **Repository:** https://github.com/Harsh2749/flowdesk-erp-crm

</div>