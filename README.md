# VeroScribe Patient Booking

VeroScribe is a Bun/Turborepo prototype for a single-clinic patient booking flow
and physician admin dashboard. It includes a Next.js patient experience, an
admin booking workspace, a Hono API, and Postgres-backed demo scheduling data.

## Stack

- Runtime/workspace: Bun workspaces + Turborepo.
- Frontend: Next.js 15 App Router, React 19, Tailwind CSS v4, `lucide-react`,
  and `clsx`.
- Client state: Zustand for in-memory booking/admin workflow state.
- Forms/validation: React Hook Form with `@hookform/resolvers` and shared Zod
  schemas.
- API: Hono running on Bun.
- Data: Drizzle ORM, PostgreSQL 16, and `postgres-js`.
- Shared contracts: `packages/shared` exports Zod schemas and TypeScript types
  for bookings, physicians, slots, and visit/status values.
- Testing/linting: Vitest + React Testing Library + jsdom for the web app,
  `bun:test` for the API, TypeScript, and ESLint v9 flat config.
- Infrastructure: Docker and Docker Compose for local Postgres and prototype
  production smoke runs.

## Frontend State Model

- Server Components load route data for the main patient and admin pages.
- Zustand owns local client workflow/UI state only:
  - patient booking draft state, selected physician/date/slot, visit type, and
    confirmation id
  - admin physician/status filters, detail layout state, and physician sync
    guard state
- React Hook Form owns form-local field state for time selection and patient
  details, with Zod validation shared with the API.
- The URL owns navigable state such as `/admin/[bookingId]` detail selection.
- Future client server-state caching should use TanStack Query if booking
  mutations, availability caching, background refresh, or optimistic admin
  updates outgrow Server Component loads plus `router.refresh()`.

## Main Routes

- `/book`: choose a physician.
- `/book/[physicianId]/time`: choose visit type, date, and slot.
- `/book/[physicianId]/details`: enter patient details and create a booking.
- `/book/confirmation/[bookingId]`: review the created booking.
- `/admin`: schedule workspace with physician/status filters.
- `/admin/[bookingId]`: schedule workspace with the selected booking detail.
- `/admin/requests`, `/admin/waitlist`, `/admin/patients`,
  `/admin/encounters`, `/admin/reports`: placeholder admin sections.

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

## Prototype Production Docker

For the easiest prototype loop, the production Compose stack resets Postgres,
pushes the Drizzle schema, and seeds demo data before the app starts:

```bash
docker compose up -d
```

Open:

- Web: http://localhost:3000
- Admin: http://localhost:3000/admin
- API health: http://localhost:3001/api/health

Because this is prototype-friendly, each Compose start runs the reset/setup job
and wipes existing demo data.

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

See `PROGRESS.md` for what has been completed and what the next agent should
tackle first. See `FUTURE.md` for ignored local planning notes, including the
future TanStack Query recommendation for client server-state caching.
