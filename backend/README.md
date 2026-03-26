# CUFCAI Learn Auth Backend

## 1) Setup

1. Start PostgreSQL using one option:

- Local PostgreSQL service with database `cufcai_learn` and user/password from `.env`
- Docker Compose from this folder:
  - `docker compose up -d`

2. Copy `.env.example` to `.env` and update values if needed.
3. Install dependencies:
   - `npm install`
4. Run migrations:
   - `npm run migrate`
5. Start server:
   - `npm run dev`

Quick local fallback (no PostgreSQL installed):

- In `.env`, set `DATABASE_URL=pgmem://local`
- Run `npm run migrate`
- Run `npm run dev`

Server runs at `http://localhost:4000` by default.

## 1.1) Use A Real Online Database (persistent users)

Use any managed PostgreSQL provider (Neon, Supabase, Railway, Render).

1. Create a PostgreSQL project in your provider dashboard.
2. Copy the provider connection string.
3. In `.env` set:

- `DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require`
- `DB_SSL_MODE=require`

4. Set a strong JWT secret:

- `JWT_SECRET=<long-random-secret>`

5. Run migration once:

- `npm run migrate`

6. Start backend:

- `npm run dev`

After this, all registered users are saved in that online database and remain available after server restarts.

## 2) Auth Endpoints

- `POST /api/auth/register`
  - body: `{ "fullName": "...", "email": "...", "universityId": "...", "password": "..." }`
- `POST /api/auth/login`
  - body: `{ "email": "...", "password": "..." }`
- `POST /api/auth/logout`
  - no body
- `GET /api/auth/me`
  - requires auth cookie

## 3) Behavior

- JWT is stored in HttpOnly cookie.
- Failed logins increment counters.
- Account locks after configured failed attempts.
- `GET /dashboard.html` is protected server-side.

## 4) Run Frontend

Open the site through backend origin, not by direct file path:

- `http://localhost:4000/index.html`
