# API Documentation

Base URL: `http://localhost:5000/api/v1` (local) — see `docs/Deployment.md` for the deployed URL.

All endpoints except `/health`, `/auth/login`, `/auth/register`, and `/auth/refresh` require:

```
Authorization: Bearer <accessToken>
```

All responses follow this envelope:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { "...": "..." },
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

Errors follow:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { "email": ["Invalid email address"] }
}
```

Import `postman/ERP-CRM.postman_collection.json` for ready-to-run requests covering every endpoint below.

## Auth

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Create a user (`name`, `email`, `password`, `role`) |
| POST | `/auth/login` | public | `{ email, password }` → `{ user, accessToken, refreshToken }` |
| POST | `/auth/refresh` | public | `{ refreshToken }` → new token pair |
| GET | `/auth/me` | any authenticated | Current user profile |

## Dashboard

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/dashboard/summary` | any authenticated | Customer/product/challan/follow-up counts |

## Customers

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/customers?page=&limit=&search=&status=&customerType=` | any authenticated | Paginated, searchable list |
| GET | `/customers/:id` | any authenticated | Single customer |
| POST | `/customers` | ADMIN, SALES | Create |
| PUT | `/customers/:id` | ADMIN, SALES | Update (partial) |
| DELETE | `/customers/:id` | ADMIN | Delete |

## Follow-ups

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/followups/customer/:customerId?page=&limit=` | any authenticated | Follow-up history for one customer |
| POST | `/followups` | ADMIN, SALES | `{ customerId, note, followUpDate }` — also syncs the customer's headline `followUpDate` |
| PUT | `/followups/:id` | ADMIN, SALES | Update note/date |

## Products

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/products?page=&limit=&search=&category=&lowStockOnly=` | any authenticated | Paginated, searchable list |
| GET | `/products/:id` | any authenticated | Single product |
| POST | `/products` | ADMIN, WAREHOUSE | Create (SKU must be unique) |
| PUT | `/products/:id` | ADMIN, WAREHOUSE | Update |
| DELETE | `/products/:id` | ADMIN | Delete |

## Inventory

| Method | Path | Roles | Description |
|---|---|---|---|
| POST | `/inventory/stock-in` | ADMIN, WAREHOUSE | `{ productId, quantity, reason }` — increments stock, logs movement |
| POST | `/inventory/stock-out` | ADMIN, WAREHOUSE | Same shape — decrements stock; **400 if insufficient stock** |
| GET | `/inventory/movements?page=&limit=&productId=` | any authenticated | Movement history |
| GET | `/inventory/low-stock?page=&limit=` | any authenticated | Products where `currentStock <= minStock` |

## Sales Challans

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/challans?page=&limit=&status=&customerId=` | any authenticated | Paginated list |
| GET | `/challans/:id` | any authenticated | Single challan with line items |
| POST | `/challans` | ADMIN, SALES | `{ customerId, items: [{ productId, quantity }], status?: 'DRAFT'|'CONFIRMED' }`. Auto-generates `challanNumber`; if `status: 'CONFIRMED'`, stock is reduced atomically and **rejected with 400 if any item would go negative** |
| PUT | `/challans/:id` | ADMIN, SALES | Replace customer/items — **draft challans only** |
| PATCH | `/challans/:id/status` | ADMIN, SALES, WAREHOUSE | `{ status }` — valid transitions: `DRAFT→CONFIRMED`, `DRAFT→CANCELLED`, `CONFIRMED→CANCELLED` (restocks). Any other transition returns 400 |

## Health

| Method | Path | Roles | Description |
|---|---|---|---|
| GET | `/health` | public | Liveness check |

## Example: end-to-end challan flow

```bash
# 1. Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sales@minierp.test","password":"Passw0rd!123"}'

# 2. Create a confirmed challan (reduces stock immediately)
curl -X POST http://localhost:5000/api/v1/challans \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "<customerId>",
    "items": [{ "productId": "<productId>", "quantity": 5 }],
    "status": "CONFIRMED"
  }'

# 3. Attempting to over-sell returns 400, not a negative stock count
curl -X POST http://localhost:5000/api/v1/inventory/stock-out \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "productId": "<productId>", "quantity": 999999, "reason": "test" }'
# => 400 { "success": false, "message": "Insufficient stock for '...'. Available: X, requested: 999999" }
```
