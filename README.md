# Appothecary 🌿

> Apps for what ails you: discover, review, and curate Android apps.

**Letterboxd for apps.** Describe your needs ("I need something for tracking
hikes offline"), get prescriptions via semantic search, and curate shareable
remedies (collections).

_Work in progress — screenshots, live demo link, and architecture diagram land
as features do._

## Stack

React 19 · Next.js 16 (App Router) · TypeScript · Tailwind v4 · Redux Toolkit ·
TanStack Query · Drizzle ORM · Postgres + pgvector · Better Auth · Node.js

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Start Postgres (requires Docker)
docker compose up -d

# 3. Configure environment
cp .env.example .env   # then fill in the blanks (see comments inside)

# 4. Apply database migrations
npm run db:generate && npm run db:migrate

# 5. Run
npm run dev
```

## Scripts

`dev` / `build` / `start` / `lint` — standard Next.js.
`db:generate` — generate SQL migrations from `src/db/schema.ts`.
`db:migrate` — apply migrations. `db:studio` — browse the DB in a UI.
