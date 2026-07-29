<div align="center">

# ✦ FlowDesk ERP CRM

### A Full-Stack ERP + CRM System for Wholesale/Distribution Businesses

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**[Live Demo](https://flowdesk-erp-frontend.onrender.com)** &nbsp;•&nbsp; **[API Docs](#api-endpoints)** &nbsp;•&nbsp; **[Postman Collection](#testing)** &nbsp;•&nbsp; **[GitHub](https://github.com/Harsh2749/flowdesk-erp-crm)**

</div>

---

## Table of Contents

- [Live Links](#live-links)
- [About](#about)
- [Modules Implemented](#modules-implemented)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Test Login Credentials](#test-login-credentials)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Architecture](#architecture-short-version)
- [Assumptions Made](#assumptions-made)
- [Known Limitations](#known-limitations)
- [Author](#author)

---

## Live Links

| Service                 | URL                                                   |
|-------------------------|-------------------------------------------------------|
| **Frontend (Live App)** | https://flowdesk-erp-frontend.onrender.com            |
| **Backend API**         | https://flowdesk-erp-crm.onrender.com/api/v1          |
| **API Health Check**    | https://flowdesk-erp-crm.onrender.com/api/v1/health   |
| **GitHub Repository**   | https://github.com/Harsh2749/flowdesk-erp-crm         |
| **Postman Collection**  | `postman/ERP-CRM.postman_collection.json`             |

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
- Silent token refresh via an Axios interceptor

### Customer CRM
- Full CRUD (Create, Read, Update, Delete)
- Search by name / business name / mobile / email / GST, with debounce
- Pagination (configurable page size)
- Filter by status and customer type
- Dedicated Customer Detail page

### Follow-up
- Add and edit follow-ups per customer
- Full follow-up history view on the Customer Detail page
- Adding a follow-up automatically syncs the customer's next follow-up date

### Product & Inventory
- Product CRUD (create, edit, delete)
- Stock movements (IN / OUT) — fully transactional
- Complete inventory movement history log
- Low-stock listing (current stock ≤ minimum stock)

### Sales Challan
- Multi-product line items per challan
- Auto challan numbering — format `CH-YYYYMMDD-0001`, sequential per day
- State machine: **Draft → Confirmed → Cancelled**
- Product data snapshotting (name, SKU, price) stored on each challan item at creation time
- **Stock reduction on confirm**, with negative-stock prevention via a conditional atomic update inside a DB transaction
- Automatic restock when a confirmed challan is cancelled

### UI / UX
- Bootstrap 5 based SaaS-style dashboard with sidebar + top navbar
- Reusable common component library (Button, Input, Select, Table, Modal, Pagination, SearchBar, ConfirmDialog, etc.)
- Responsive design — desktop, tablet, and mobile
- Toast notifications for every action (success / error)
- Light/dark theme toggle

---

## Tech Stack

| Layer            | Technology                                                           |
|------------------|----------------------------------------------------------------------|
| **Frontend**     | React 18 + Vite 5 + TypeScript                                       |
| **Styling**      | Bootstrap 5 + React Bootstrap                                        |
| **State**        | React Context (Auth, Theme, Sidebar, Toast)                          |
| **Forms**        | React Hook Form                                                      |
| **HTTP Client**  | Axios (with auto refresh-token retry)                                |
| **Backend**      | Node.js + Express + TypeScript                                       |
| **ORM**          | Prisma                                                               |
| **Database**     | PostgreSQL (Neon)                                                    |
| **Auth**         | JWT (Access + Refresh)                                               |
| **Security**     | bcrypt, Zod validation, Helmet, CORS, RBAC middleware, rate limiting |

---

## Project Structure

```text
flowdesk-erp-crm/
│
├── client/                          # React + Vite + TypeScript frontend
│   ├── public/
│   │   └── robots.txt
│   ├── src/
│   │   ├── api/                     # axios.ts + one api client per module
│   │   ├── components/
│   │   │   ├── common/              # Button, Input, Select, Table, Modal,
│   │   │   │                        # Card, Badge, Loader, Pagination,
│   │   │   │                        # SearchBar, EmptyState, ConfirmDialog
│   │   │   ├── layout/              # Navbar, Sidebar, Footer, Breadcrumb
│   │   │   ├── customer/
│   │   │   └── followup/
│   │   ├── pages/
│   │   │   ├── auth/                # Login, Signup, ForgotPassword, ResetPassword
│   │   │   ├── dashboard/
│   │   │   ├── customer/
│   │   │   ├── followup/
│   │   │   ├── product/
│   │   │   ├── inventory/
│   │   │   ├── challan/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   └── errors/              # NotFound, Unauthorized, ServerError
│   │   ├── layouts/                 # AuthLayout, DashboardLayout, BlankLayout
│   │   ├── routes/                  # AppRoutes, ProtectedRoute, RoleRoute
│   │   ├── context/                 # Auth, Theme, Sidebar, Toast
│   │   ├── hooks/
│   │   ├── constants/
│   │   ├── types/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                          # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/                  # env.ts, logger.ts, prisma.ts
│   │   ├── controllers/
│   │   ├── services/                # Business logic + DB transactions
│   │   ├── repositories/            # Only layer that touches Prisma directly
│   │   ├── routes/
│   │   ├── dto/                     # Zod schemas per module
│   │   ├── entities/                # Type re-exports of Prisma models
│   │   ├── middlewares/             # auth, role (RBAC), validation, error, rate limit
│   │   ├── interfaces/
│   │   ├── enums/
│   │   ├── errors/                  # AppError hierarchy
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts                  # Seeds one user per role
│   ├── uploads/
│   ├── logs/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── postman/
│   └── ERP-CRM.postman_collection.json
│
├── docs/
│   ├── API.md
│   ├── Architecture.md
│   ├── Database.md
│   └── Deployment.md
│
├── .gitignore
├── README.md
├── package.json
└── LICENSE
```

---

## Getting Started

### Prerequisites

| Tool       | Version | Download                |
|------------|---------|-------------------------|
| Node.js    | v18+    | https://nodejs.org      |
| PostgreSQL | v14+    | https://postgresql.org  |
| Git        | Latest  | https://git-scm.com     |

### 1. Clone the Repository

```bash
git clone https://github.com/Harsh2749/flowdesk-erp-crm
cd flowdesk-erp-crm
```

### 2. Backend Setup

```bash
cd server

npm install

cp .env.example .env
# Set DATABASE_URL (Neon or local Postgres) + JWT secrets

npx prisma generate
npx prisma migrate dev --name init
npm run seed

npm run dev
```

Backend runs at: **http://localhost:5000**

### 3. Frontend Setup

```bash
cd client

npm install

cp .env.example .env
# Verify VITE_API_BASE_URL=http://localhost:5000/api/v1

npm run dev
```

Frontend runs at: **http://localhost:5173**

### 4. Verify Everything Works

```bash
curl http://localhost:5000/api/v1/health
# Expected: {"success":true,"message":"API is healthy","timestamp":"..."}
```

Then open **http://localhost:5173** in your browser.

---

## Test Login Credentials

Seeded by `server/prisma/seed.ts` — all four roles share the same password.

| Role      | Email                 | Password       |
|-----------|-----------------------|----------------|
| Admin     | admin@erp.test        | Password@123   |
| Sales     | sales@erp.test        | Password@123   |
| Warehouse | warehouse@erp.test    | Password@123   |
| Accounts  | accounts@erp.test     | Password@123   |

---

## API Endpoints

All routes are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint         | Description                      |
|--------|------------------|----------------------------------|
| POST   | `/auth/register` | Register a new user              |
| POST   | `/auth/login`    | Login with email/password        |
| POST   | `/auth/refresh`  | Refresh access token             |
| GET    | `/auth/me`       | Get current authenticated user   |

### Customers

| Method | Endpoint         | Description                                |
|--------|------------------|--------------------------------------------|
| GET    | `/customers`     | List customers (search, filter, paginated) |
| POST   | `/customers`     | Create a new customer                      |
| GET    | `/customers/:id` | Get customer by ID (with follow-up history)|
| PUT    | `/customers/:id` | Update customer                            |
| DELETE | `/customers/:id` | Delete customer                            |

### Follow-ups

| Method | Endpoint                          | Description                      |
|--------|-----------------------------------|----------------------------------|
| GET    | `/followups/customer/:customerId` | Follow-up history for a customer |
| POST   | `/followups`                      | Add a follow-up                  |
| PUT    | `/followups/:id`                  | Edit a follow-up                 |
| DELETE | `/followups/:id`                  | Delete a follow-up               |

### Products

| Method | Endpoint       | Description                                |
|--------|----------------|--------------------------------------------|
| GET    | `/products`    | List products (search, filter, paginated)  |
| POST   | `/products`    | Create a new product                       |
| GET    | `/products/:id`| Get product by ID                          |
| PUT    | `/products/:id`| Update product                             |
| DELETE | `/products/:id`| Delete product                             |

### Inventory

| Method | Endpoint               | Description                               |
|--------|------------------------|-------------------------------------------|
| GET    | `/inventory/movements` | Movement history (filter by product/type) |
| POST   | `/inventory/movements` | Record a stock IN or OUT movement         |
| GET    | `/inventory/low-stock` | List products at or below minimum stock   |

### Sales Challans

| Method | Endpoint                  | Description                                         |
|--------|---------------------------|-----------------------------------------------------|
| GET    | `/challans`               | List challans (filter by status/customer)           |
| POST   | `/challans`               | Create a challan (Draft or Confirmed)               |
| GET    | `/challans/:id`           | Get challan by ID                                   |
| PATCH  | `/challans/:id/confirm`   | Confirm challan — reduces stock                     |
| PATCH  | `/challans/:id/cancel`    | Cancel challan — restocks items if it was confirmed |

### Dashboard

| Method | Endpoint                      | Description                     |
|--------|-------------------------------|---------------------------------|
| GET    | `/dashboard/summary`          | Summary counts for all modules  |
| GET    | `/dashboard/recent-challans`  | Most recent challans            |

### Query Parameters (list endpoints)

| Parameter      | Type    | Applies to                | Description                      |
|----------------|---------|---------------------------|----------------------------------|
| `page`         | number  | all list endpoints        | Page number (default: 1)         |
| `limit`        | number  | all list endpoints        | Items per page (default: 10)     |
| `search`       | string  | customers, products       | Free-text search                 |
| `status`       | string  | customers, challans       | Filter by status                 |
| `customerType` | string  | customers                 | Retail / Wholesale / Distributor |
| `category`     | string  | products                  | Filter by category               |
| `lowStockOnly` | boolean | products                  | Only products at/below min stock |
| `productId`    | string  | inventory movements       | Filter by product                |
| `type`         | string  | inventory movements       | IN or OUT                        |
| `customerId`   | string  | challans                  | Filter by customer               |

See `docs/API.md` for the complete endpoint reference including request/response schemas.

---

## Environment Variables

### Server (`server/.env`)

| Variable                   | Description                     | Example                          |
|----------------------------|---------------------------------|----------------------------------|
| `DATABASE_URL`             | PostgreSQL connection string    | `postgresql://user:pass@host/db` |
| `JWT_ACCESS_SECRET`        | Secret for access tokens        | 32+ char random string           |
| `JWT_REFRESH_SECRET`       | Secret for refresh tokens       | 32+ char random string           |
| `JWT_ACCESS_EXPIRES_IN`    | Access token lifetime           | `15m`                            |
| `JWT_REFRESH_EXPIRES_IN`   | Refresh token lifetime          | `7d`                             |
| `PORT`                     | Server port                     | `5000`                           |
| `CLIENT_ORIGIN`            | Frontend URL (for CORS)         | `http://localhost:5173`          |
| `BCRYPT_SALT_ROUNDS`       | bcrypt hashing cost             | `10`                             |
| `RATE_LIMIT_WINDOW_MS`     | Rate limit window               | `900000`                         |
| `RATE_LIMIT_MAX_REQUESTS`  | Max requests per window         | `200`                            |

### Client (`client/.env`)

| Variable            | Description          | Example                        |
|---------------------|----------------------|--------------------------------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## Database Schema

```prisma
enum Role {
  ADMIN
  SALES
  WAREHOUSE
  ACCOUNTS
}

model User {
  id       String  @id @default(uuid())
  name     String
  email    String  @unique
  password String
  role     Role    @default(SALES)
  isActive Boolean @default(true)
}

model Customer {
  id           String         @id @default(uuid())
  name         String
  businessName String?
  mobile       String
  email        String?
  gstNumber    String?
  customerType CustomerType   @default(RETAIL)
  address      String?
  status       CustomerStatus @default(LEAD)
  followUpDate DateTime?
  notes        String?
}

model Followup {
  id           String   @id @default(uuid())
  customerId   String
  note         String
  followUpDate DateTime
  createdById  String
}

model Product {
  id           String  @id @default(uuid())
  name         String
  sku          String  @unique
  category     String?
  unitPrice    Decimal @db.Decimal(12, 2)
  currentStock Int     @default(0)
  minStock     Int     @default(0)
  location     String?
}

model InventoryMovement {
  id        String       @id @default(uuid())
  productId String
  quantity  Int
  type      MovementType // IN | OUT
  reason    String?
  createdById String
}

model Challan {
  id            String        @id @default(uuid())
  challanNumber String        @unique   // CH-YYYYMMDD-0001
  customerId    String
  status        ChallanStatus @default(DRAFT)  // DRAFT | CONFIRMED | CANCELLED
  totalQuantity Int           @default(0)
  items         ChallanItem[]
}

model ChallanItem {
  id              String  @id @default(uuid())
  challanId       String
  productId       String
  productNameSnap String
  productSkuSnap  String
  unitPriceSnap   Decimal @db.Decimal(12, 2)
  quantity        Int
}
```

See `docs/Database.md` for the full schema with relations and indexes.

---

## Testing

Business logic — especially stock reduction, negative-stock prevention, and challan state transitions — was validated manually against a running instance using the Postman collection at `postman/ERP-CRM.postman_collection.json`, including deliberately triggering the insufficient-stock error path on challan confirmation.

Both frontend and backend compile cleanly:

```bash
cd server && npx tsc -p tsconfig.json --noEmit
cd client && npx tsc -b
```

---

## Architecture (short version)

**Backend** — Layered architecture: `Route → Middleware (auth/RBAC/validation) → Controller → Service (business logic + transactions) → Repository (Prisma) → PostgreSQL`.

**Frontend** — Context-based auth/theme/toast/sidebar state, an Axios instance with automatic refresh-token retry, and one API client + one page/component set per backend module.

Full write-up with a request-flow example (confirming a challan) in `docs/Architecture.md`.

---

## Assumptions Made

- Simple JWT-based authentication is used per the assignment scope — no OAuth, no email verification, no password-reset email flow. Users are provisioned via the seed script.
- Challan numbering resets per calendar day (`CH-YYYYMMDD-0001`, `CH-YYYYMMDD-0002`, ...) since no numbering scheme was specified.
- Reports, Notifications, Profile, and Settings are intentionally built only as minimal placeholders per the assignment's scope guidance, not as full modules.
- Currency is not locale-formatted on the frontend by default; unit prices are shown as returned by the API.

---

## Known Limitations

- **No automated end-to-end/integration test suite** — business logic was verified manually via Postman against a running instance, including concurrent-request/insufficient-stock scenarios.
- **No file/image upload** (e.g. product images) — listed only as a bonus item in the assignment.
- **No PDF export for challans** — listed only as a bonus item.
- **Signup / Forgot Password / Reset Password pages are placeholders** — present to match the required folder structure, but not wired to backend endpoints, since only login was required and the backend intentionally implements just `/auth/register`, `/auth/login`, `/auth/refresh`, and `/auth/me`.
- **No Docker setup** — listed only as a bonus item; local setup uses plain `npm install`.

---

## Author

**Harsh Raj**

[![GitHub](https://img.shields.io/badge/GitHub-Harsh2749-181717?style=for-the-badge&logo=github)](https://github.com/Harsh2749)
[![Repository](https://img.shields.io/badge/Repository-FlowDesk_ERP_CRM-2ea44f?style=for-the-badge&logo=github)](https://github.com/Harsh2749/flowdesk-erp-crm)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harsh_Raj-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/its-harshraj)

📧 **Email:** harshraj2749@gmail.com

---

## License

This project was developed for assessment and educational purposes.

---

<div align="center">

Made with ❤️ using **React, Node.js, Express.js, Prisma & PostgreSQL**

⭐ **If you found this project helpful, please consider starring the repository!**

🔗 **Repository:** https://github.com/Harsh2749/flowdesk-erp-crm

</div>