# VeroScribe Patient Booking

This is a Bun/Turborepo prototype for a single-clinic patient booking flow
and physician admin dashboard. It includes a Next.js patient experience, an
admin booking workspace, a Hono API, and Postgres-backed demo scheduling data.

## How To Run

Start with the prototype Docker path. It is the easiest way to see the app
running with fresh demo data:

```bash
cp .env.example .env # first time only
docker compose up -d
```

This builds the local images, pushes the Drizzle schema, and seeds demo data
before the app starts. Existing Docker volume data is preserved; demo seed data
is inserted only when the database is empty.

Open:

- Web: http://localhost:3000
- Patient flow: http://localhost:3000/book
- Admin dashboard: http://localhost:3000/admin
- API health: http://localhost:3001/api/health

For active development after you have checked the prototype, use dev mode:

```bash
bun install
docker compose -f docker-compose.dev.yml up -d db
bun run db:push
bun run db:seed
bun run dev
```

Dev mode runs the API and web app through Turborepo with local hot reload while
Postgres stays in Docker.

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
- A responsive patient and admin UI designed for both desktop and mobile review.
- A Hono API for physicians, availability, bookings, booking detail, and booking
  updates.
- A Drizzle/Postgres data model with seeded physicians, May 2026 availability
  slots, and demo bookings across multiple physicians.
- Shared Zod schemas and TypeScript types for booking, physician, slot, status,
  and visit-type contracts.
- Sonner toast feedback for booking requests, admin booking actions,
  rescheduling, API errors, and intentionally unimplemented prototype buttons.
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

### Stack

Bun workspaces, Turborepo, Next.js 15 App Router, React 19, Tailwind CSS v4,
Hono, Drizzle ORM, PostgreSQL 16, `postgres-js`, Zod, Zustand, React Hook Form,
Vitest/RTL/jsdom, `bun:test`, ESLint, Docker, and Docker Compose.

Supporting tools include `@hono/zod-validator` for request validation,
Drizzle Kit for schema push/migrations, `dotenv` for local configuration,
`lucide-react` for icons, `clsx` for conditional class names,
`sonner` for lightweight toast notifications, `@tailwindcss/postcss` for
Tailwind v4 processing, Testing Library +
`jest-dom` for web assertions, and shared ESLint/TypeScript config packages
inside the monorepo.

### Docker For Local Reproducibility

I used Docker because I like compartmentalizing the different services in a
project: web, API, database, and setup tasks all have clear boundaries. Docker
also makes process management, logs, environment variables, networking, and
database lifecycle easier to reason about during review. Most importantly, I
wanted the prototype to be easy for other people to run without depending on
their local OS, installed Postgres version, or machine-specific setup. The main
run path is therefore Docker-based and OS-agnostic. `docker compose up -d`
preserves an existing Postgres volume; it pushes the current schema and seeds
demo data only when the database has no physician records.

### JavaScript End To End

I kept both the frontend and backend in the JavaScript/TypeScript ecosystem:
Next.js and React on the frontend, Hono on Bun for the backend, and shared
TypeScript/Zod contracts between them.

### Hono And Drizzle

I had been meaning to try Hono and Drizzle, and this booking prototype was a good
opportunity because it needed a small typed API, a real relational data model,
and fast iteration. I have used Prisma and Postgres separately before, so
choosing Drizzle with `postgres-js` was a useful way to compare against my Prisma
experience and experiment with a lighter SQL-first TypeScript stack. It was also
a good excuse to try something different after writing a lot of Python
Flask/FastAPI-style backend code in other projects.

### Design And Tailwind

I used Tailwind CSS because I have years of extensive prior experience with it,
and it let me move quickly on breakpoint-based responsive layouts, spacing,
states, and polish without introducing a separate component styling system.
Tailwind was also easy to pair-program with because the design decisions stayed
close to the JSX, which made it straightforward to iterate with AI tools while
keeping the UI consistent across patient and admin screens. The visual direction
is heavily inspired by Veroscribe's public landing page at
https://www.veroscribe.com/ so the prototype feels connected to the existing
brand rather than like a generic scheduling demo.

### Real Database Over Mock-Only Data

I chose Postgres instead of only mock data because persisted state made the
prototype easier to test across sessions, desktop, and mobile. It also let me
seed blocked availability, booked slots, cancelled bookings, and enough demo
data to compare views realistically. Because I pair-programmed the prototype
with Claude and Codex, the extra setup cost of using a local database was still
manageable for the scope.

### State Management

Server Components load route data, while Zustand owns local workflow/UI state
such as booking selections, admin filters, and detail panel state. Zustand fit
here because the app needs small shared client state across steps without adding
a heavier global framework. React Hook Form owns form-local state for patient
details and time selection because it keeps form updates efficient, handles
validation cleanly, and pairs well with the shared Zod schemas.

### URL State

The URL owns navigable detail state like `/admin/[bookingId]`, which makes
refresh, back/forward, and direct links easier to reason about.

### Validation

Zod schemas live in `packages/shared` so frontend forms and API routes use the
same contracts.

### AI-Assisted Workflow

I used AI tools as part of the normal development loop. I laid out the
architecture and product shape in a large Claude prompt, had Claude turn it into
an implementation plan, then used Codex to scaffold, iterate, test, and refine
the project.

### Prototype Data

The seed command creates the full demo dataset: physicians, May 2026
availability slots, blocked/held/booked slot states, pending/confirmed/cancelled
bookings, patient details, reasons for visit, notes, and visit types across
multiple physicians. This keeps the patient booking and admin workflows
realistic without building full physician accounts or an availability editor
yet.

### Scoped Omissions

I intentionally left out authentication, production calendar integrations,
payments, insurance eligibility, notifications, and production deployment so the
work sample stayed focused on the requested booking flow, admin view, UX, and
core tradeoffs. Buttons for unimplemented prototype features, such as filters,
calendar export, reminders, and manual new-booking creation, show an info toast
instead of silently doing nothing.

## What I Would Improve With More Time

- Add auth, auth middleware, role-based access, and owner-based route protection
  for physicians, clinic admins, and front-desk users.
- Replace seeded availability with physician-managed schedule templates,
  date-specific overrides, buffers, slot holds, and regeneration logic.
- Add stronger API coverage for conflict cases, invalid reschedules, and status
  transition rules.
- Add more web tests for the booking flow, admin filters, route-driven detail
  panel, rescheduling, and responsive behavior.
- Add Storybook or a similar component sandbox for reviewing responsive UI
  states and admin/patient components in isolation.
- Add TanStack Query if the admin workspace grows to need client-side
  server-state caching, optimistic updates, or background refresh beyond Server
  Component loads plus `router.refresh()`.
- Implement real admin Requests, Waitlist, Patients, Encounters, and Reports
  workflows instead of prototype placeholders.
- Replace the single admin workspace with physician accounts so each physician
  can manage their own availability and bookings directly, protected by
  owner-based route checks.
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
