# Database

PostgreSQL via Prisma. Full schema: `server/prisma/schema.prisma`.

## Entity-relationship summary

```
User ──< Customer ──< Followup
  │           │
  │           └──< Challan ──< ChallanItem >── Product ──< InventoryMovement
  │
  └──< InventoryMovement (createdBy)
  └──< Challan (createdBy)
  └──< Followup (createdBy)
  └──< Customer (createdBy)
```

## Tables

### `users`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text | |
| email | text | unique |
| passwordHash | text | bcrypt, salt rounds from `BCRYPT_SALT_ROUNDS` |
| role | enum `Role` | `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS` |
| isActive | boolean | default true |
| createdAt / updatedAt | timestamp | |

### `customers`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name, phone, businessName | text | required |
| email, gstNumber, address, notes | text | optional |
| customerType | enum | `RETAIL`, `WHOLESALE`, `DISTRIBUTOR` |
| status | enum | `LEAD` (default), `ACTIVE`, `INACTIVE` |
| followUpDate | timestamp | nullable; kept in sync with the latest `Followup.followUpDate` |
| createdById | uuid, FK → users | |
| indexes | | `businessName`, `phone`, `status` |

### `followups`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| customerId | uuid, FK → customers | `onDelete: Cascade` |
| note | text | |
| followUpDate | timestamp | |
| createdById | uuid, FK → users | |

### `products`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name, category | text | |
| sku | text | unique |
| unitPrice | decimal(12,2) | |
| currentStock, minStock | int | default 0 |
| warehouseLocation | text | nullable |
| isActive | boolean | default true |
| indexes | | `sku`, `category` |

### `inventory_movements`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| productId | uuid, FK → products | |
| quantity | int | always positive; direction is in `movementType` |
| movementType | enum | `IN`, `OUT` |
| reason | text | |
| createdById | uuid, FK → users | |
| indexes | | `productId`, `createdAt` |

### `challans`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| challanNumber | text | unique, format `CH-YYYY-000001`, generated server-side |
| customerId | uuid, FK → customers | |
| totalQuantity | int | sum of item quantities, denormalized for list-view performance |
| status | enum | `DRAFT` (default), `CONFIRMED`, `CANCELLED` |
| createdById | uuid, FK → users | |
| indexes | | `status`, `customerId` |

### `challan_items`
| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| challanId | uuid, FK → challans | `onDelete: Cascade` |
| productId | uuid, FK → products | |
| productNameSnapshot, productSkuSnapshot | text | copied from Product **at creation time** |
| unitPriceSnapshot | decimal(12,2) | copied from Product **at creation time** |
| quantity | int | |
| indexes | | `challanId` |

**Why snapshotting**: `ChallanItem` never joins back to `Product` for display — it stores its own copy of name/SKU/price. Editing a product's price next month doesn't rewrite last month's challan totals.

## Migrations

This project ships the schema only (`prisma/schema.prisma`); no `migrations/` folder is checked in because the target database (Neon) is created fresh per deployment. Generate the initial migration locally:

```bash
cd server
npx prisma migrate dev --name init
```

This creates `prisma/migrations/<timestamp>_init/migration.sql` and applies it to `DATABASE_URL`. Commit the generated `migrations/` folder after running this once — subsequent schema changes should use `prisma migrate dev --name <description>` to keep an incremental history.

For deployment, use `prisma migrate deploy` (see `docs/Deployment.md`) instead of `migrate dev`, since `deploy` never prompts and never drifts from the checked-in migration history.

## Seeding

`server/prisma/seed.ts` creates one user per role and a handful of sample customers/products (two intentionally below `minStock` to demonstrate the low-stock alert). Run with:

```bash
npm run prisma:seed
```
