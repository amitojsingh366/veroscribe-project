# VeroScribe Patient Booking

VeroScribe is a Bun/Turborepo prototype for a single-clinic patient booking flow
and physician admin dashboard. It includes a Next.js patient experience, an
admin booking workspace, a Hono API, and Postgres-backed demo scheduling data.

## How To Run

```bash
cp .env.example .env
bun install
docker compose -f docker-compose.dev.yml up -d db
bun run db:push
bun run db:seed
bun run dev
```

Open:

- Web: http://localhost:3000
- Patient flow: http://localhost:3000/book
- Admin dashboard: http://localhost:3000/admin
- API health: http://localhost:3001/api/health

For a prototype production smoke run:

```bash
docker compose up -d
```

The production Compose path resets Postgres, pushes the Drizzle schema, and
seeds demo data before the app starts, so it is intentionally not
data-preserving.

Useful checks:

```bash
bun run typecheck
bun run lint
bun run test
```

## What I Built

- A four-step patient booking flow:
  - choose a physician
  - pick visit type, date, and time
  - enter patient details
  - view booking confirmation
- An admin schedule workspace with physician switching, search, status tabs,
  route-driven booking detail panels, booking status actions, rescheduling, and
  dynamic summary cards.
- A Hono API for physicians, availability, bookings, booking detail, and booking
  updates.
- A Drizzle/Postgres data model with seeded physicians, May 2026 availability
  slots, and demo bookings across multiple physicians.
- Shared Zod schemas and TypeScript types for booking, physician, slot, status,
  and visit-type contracts.
- Placeholder admin routes for future Requests, Waitlist, Patients, Encounters,
  and Reports sections.

Main routes:

- `/book`
- `/book/[physicianId]/time`
- `/book/[physicianId]/details`
- `/book/confirmation/[bookingId]`
- `/admin`
- `/admin/[bookingId]`

## Key Decisions

- **Stack:** Bun workspaces, Turborepo, Next.js 15 App Router, React 19,
  Tailwind CSS v4, Hono, Drizzle ORM, PostgreSQL 16, `postgres-js`, Zod,
  Zustand, React Hook Form, Vitest/RTL/jsdom, `bun:test`, ESLint, Docker, and
  Docker Compose.
- **State model:** Server Components load route data. Zustand owns only local
  workflow/UI state such as booking selections and admin filters. React Hook
  Form owns form-local state. The URL owns navigable detail state like
  `/admin/[bookingId]`.
- **Validation:** Zod schemas live in `packages/shared` so frontend forms and
  API routes use the same contracts.
- **Admin routing:** booking detail is URL-driven instead of hidden local state,
  which makes refresh, back/forward, and direct links easier to reason about.
- **Prototype data:** availability is persisted as concrete slot rows generated
  by seed data. This keeps the patient booking flow realistic without building a
  full physician availability editor yet.
- **Future server state:** TanStack Query is documented as the preferred next
  step if admin mutations, background refresh, optimistic updates, or client
  caching needs grow beyond Server Component loads plus `router.refresh()`.

## What I Would Improve With More Time

- Add authentication and role-based access for physicians, clinic admins, and
  front-desk users.
- Replace seeded availability with physician-managed schedule templates,
  date-specific overrides, buffers, slot holds, and regeneration logic.
- Add stronger API coverage for conflict cases, invalid reschedules, and status
  transition rules.
- Add more web tests for the booking flow, admin filters, route-driven detail
  panel, rescheduling, and responsive behavior.
- Introduce TanStack Query for client server-state caching once the admin
  workspace needs optimistic updates or background refresh.
- Implement real admin Requests, Waitlist, Patients, Encounters, and Reports
  workflows instead of prototype placeholders.
- Generate and commit Drizzle migrations after the schema stabilizes.

## API

- `GET /api/health`
- `GET /api/physicians`
- `GET /api/physicians/:id`
- `GET /api/physicians/:id/availability`
- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id`
