# FirePin (Phase 1 Bootstrap)

Mobile-first MVP foundation for a UK fire-stopping contractor.

## Tech
- Next.js 15 App Router + TypeScript + Tailwind
- PostgreSQL + Prisma
- Email/password login (credentials)
- Role-based routing (Admin / Operative)

## Phase 1 delivered
- App scaffold and mobile-first base layout
- Prisma schema aligned to the core domain model
- Seed script with demo project, floors, zones, operatives, systems, and pins
- Login flow and role-gated routes
- Basic unit tests for pricing and pin access filtering

## Setup
```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm test
npm run dev
```

## Demo credentials
- Admin: `admin@firepin.local` / `Password123!`
- Operative 1: `operative1@firepin.local` / `Password123!`
- Operative 2: `operative2@firepin.local` / `Password123!`

## Routes
- `/login`
- `/admin/projects`
- `/operative/pins`
- `/unauthorized`

## Architecture notes
- Session cookie stores basic user identity and role for route access checks.
- Prisma schema includes Phase 2+ entities so migrations are stable from the start.
- Pricing library starts with strategy models and can be expanded in later phases.
