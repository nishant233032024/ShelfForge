# ShelfForge

A full-stack personal book manager built with the MERN stack and Next.js. Clean architecture, JWT cookie auth with express-jwt, and a calm list-based shelf UI.

Candidate: Nishant · nishantghuge@hotmail.com

## Features

- Sign up, log in, log out, and session restore via `GET /api/auth/me`
- Protected book APIs using express-jwt (no Passport.js)
- Add, edit, delete books (title, author, tags, status)
- Optional short notes on each book (up to 280 characters)
- Quick status updates from the dashboard and the full shelf
- Compound filters: status + author + applicable tags from your own shelf
- Paginated book list (default 8, max 20)
- Dashboard summary, completion rate, finished-this-month, reading insight
- Favorite authors panel — rediscover voices you return to most
- HTTP-only `accessToken` cookie auth

## Tech stack

**Frontend:** Next.js (App Router), React JSX, Tailwind CSS, fetch  
**Backend:** Node.js, Express, MongoDB Atlas, Mongoose  
**Auth:** jsonwebtoken, express-jwt, bcryptjs, cookie-parser  
**Security extras:** helmet, cors, express-rate-limit

## Architecture

```text
ShelfForge/
  frontend/     Next.js App Router UI (Vercel)
  backend/      Express API (Render or similar)
```

- Controllers stay thin; routes, models, middleware, and utils stay separated
- Ownership always comes from `req.auth` / `req.currentUser`, never from the client body
- Books render as a responsive list, not cards

## Setup

### 1. MongoDB Atlas

Create a cluster, database user, and connection string. Allow network access for your machine / host.

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Fill in:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=...
JWT_SECRET=...
CLIENT_URL=http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Open http://localhost:3000

## API summary

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/signup` | public + rate limit |
| POST | `/api/auth/login` | public + rate limit |
| POST | `/api/auth/logout` | public |
| GET | `/api/auth/me` | protected |
| GET | `/api/books?page&limit&status&tag&author` | protected |
| GET | `/api/books/summary` | protected |
| GET | `/api/books/tags` | protected |
| GET | `/api/books/authors` | protected |
| POST | `/api/books` | protected |
| PATCH | `/api/books/:bookId` | protected |
| PATCH | `/api/books/:bookId/status` | protected |
| DELETE | `/api/books/:bookId` | protected |

## Deployment

- **Frontend:** Vercel — set root to `frontend`
  - `BACKEND_URL=https://your-api.onrender.com` (used by Next.js `/api` rewrites)
  - Production browser calls same-origin `/api/*` so JWT cookies stay first-party
- **Backend:** Render (or similar) — start with `npm start`, set `PORT`, `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
- **Database:** MongoDB Atlas connection string via env

CORS uses `CLIENT_URL` with credentials enabled. Cookies use `secure: true` in production.

## Deployment links

- Frontend: https://shelfforge.vercel.app
- Backend: https://shelfforge-api.onrender.com
- GitHub: https://github.com/nishant233032024/ShelfForge

## Trade-offs

- JWT lives in an HTTP-only cookie to reduce client-side token exposure
- express-jwt keeps protected-route middleware clean and Passport-free
- No refresh-token rotation — assignment scope stays focused
- Author filter is exact (case-insensitive), not free-text search — keeps indexes and UX clear

## Future improvements

- Automated unit/integration tests
- Title free-text search
- Optimistic UI updates
- Richer toast feedback
- End-to-end coverage
- CSRF hardening if the deployment surface grows
