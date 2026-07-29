# Deployment

Target stack: **Frontend → Vercel**, **Backend → Render**, **Database → Neon PostgreSQL** (all free-tier friendly, no cost required).

## 1. Database — Neon PostgreSQL

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the pooled connection string (includes `?sslmode=require`).
3. Set it as `DATABASE_URL` in the backend's environment (step 2 below).

## 2. Backend — Render

1. Push this repo to GitHub.
2. In Render: **New → Web Service** → connect the repo → set **Root Directory** to `server`.
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm run start` (runs `node dist/server.js`)
5. Environment variables (Render → Environment tab), mirroring `server/.env.example`:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` (Render's default; Render injects its own `PORT` — the app reads `process.env.PORT`) |
   | `DATABASE_URL` | Neon connection string from step 1 |
   | `JWT_ACCESS_SECRET` | long random string (`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`) |
   | `JWT_REFRESH_SECRET` | a **different** long random string |
   | `JWT_ACCESS_EXPIRES_IN` | `15m` |
   | `JWT_REFRESH_EXPIRES_IN` | `7d` |
   | `BCRYPT_SALT_ROUNDS` | `10` |
   | `CLIENT_ORIGIN` | your deployed Vercel URL (step 3) |
   | `RATE_LIMIT_WINDOW_MS` | `900000` |
   | `RATE_LIMIT_MAX_REQUESTS` | `200` |
   | `LOG_LEVEL` | `info` |

6. After the first deploy, run migrations and seed data via Render's **Shell** tab (or a one-off job):

   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```

7. Confirm `https://<your-render-service>.onrender.com/api/v1/health` returns `{ "success": true, ... }`.

## 3. Frontend — Vercel

1. In Vercel: **New Project** → import the repo → set **Root Directory** to `client`.
2. Framework preset: **Vite**.
3. Build command: `npm run build` — Output directory: `dist`.
4. Environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://<your-render-service>.onrender.com/api/v1` |

5. Deploy. Once live, copy the Vercel URL back into the backend's `CLIENT_ORIGIN` env var on Render (step 2) and redeploy the backend so CORS allows it.

## Environment variable management

- Both `server/.env.example` and `client/.env.example` are committed; the real `.env` files are gitignored.
- Locally: `cp .env.example .env` in each folder and fill in real values.
- In hosting providers: set variables directly in the platform's dashboard (never commit real secrets).
- JWT secrets must be long, random, and different from each other — regenerate them for production rather than reusing the local dev placeholders.

## Local setup (if not deploying)

```bash
# Backend
cd server
cp .env.example .env   # fill in DATABASE_URL + JWT secrets
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev             # http://localhost:5000

# Frontend (separate terminal)
cd client
cp .env.example .env    # VITE_API_BASE_URL=http://localhost:5000/api/v1
npm install
npm run dev              # http://localhost:5173
```

## Docker (optional / bonus)

Minimal Dockerfiles are provided for both services (see `server/Dockerfile` and `client/Dockerfile`) plus a root `docker-compose.yml` that also spins up a local Postgres — useful for fully offline local development without Neon.

```bash
docker compose up --build
```

This starts Postgres on `5432`, the API on `5000`, and the frontend on `5173`. Run migrations/seed once against the containerized DB the same way as above (`docker compose exec server npx prisma migrate deploy && docker compose exec server npm run prisma:seed`).
