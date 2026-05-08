# VeroScribe Patient Booking

VeroScribe is a scaffolded Bun/Turborepo prototype for a single-clinic patient booking flow and physician admin dashboard.

## Stack

- Bun workspaces + Turborepo
- Next.js 15 App Router + React 19 + Tailwind CSS v4
- Hono API on Bun
- Drizzle ORM + PostgreSQL 16 using `postgres-js`
- Shared Zod schemas in `packages/shared`

## Local Setup

```bash
cp .env.example .env
bun install
docker compose -f docker-compose.dev.yml up -d db
bun run db:push
bun run db:seed
bun run dev
```

Docker-first workflow from the handoff:

```bash
docker compose -f docker-compose.dev.yml up -d db
docker compose -f docker-compose.dev.yml run --rm api bun install
docker compose -f docker-compose.dev.yml run --rm api bun run db:push
docker compose -f docker-compose.dev.yml run --rm api bun run db:seed
docker compose -f docker-compose.dev.yml up --watch
```

Open:

- Web: http://localhost:3000
- API health: http://localhost:3001/api/health

## API

- `GET /api/health`
- `GET /api/physicians`
- `GET /api/physicians/:id`
- `GET /api/physicians/:id/availability`
- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id`

## Handoff Notes

See `PROGRESS.md` for what has been completed and what the next agent should tackle first.
