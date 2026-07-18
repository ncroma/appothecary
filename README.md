# <img src="src/app/icon.svg" width="28" alt="" /> Appothecary

> Apps for what ails you — discover, review, and curate Android apps.

**Letterboxd for apps.** Browse a stocked catalog of Android apps, describe
what you need in plain words ("something for tracking hikes offline") and get
prescriptions via AI semantic search, then sign in and leave a patient note
for the next visitor.

**Live dispensary → [appothecary.vercel.app](https://appothecary.vercel.app)**

![Appothecary homepage](docs/home.png)

![App detail page](docs/app-detail.png)

## Features

- **Search by needs** — natural-language search over the catalog. App
  metadata is embedded with OpenAI `text-embedding-3-small` and matched by
  cosine similarity in Postgres (pgvector, HNSW index), with a similarity
  floor so nonsense queries return an honest empty state.
- **Search by label** — classic keyword search over names and developers,
  debounced, with stale results dimmed while a refinement is in flight.
- **Patient notes** — GitHub sign-in, one review per person per app
  (enforced by the schema), a five-vial rating control with poured-liquid
  animation, and optimistic updates so notes appear before the server
  answers.
- **The catalog** — 300+ apps ingested from the Aptoide API: top charts
  plus a hand-picked list spanning meditation to chess, with dead store
  links verified and pruned.

## Stack

React 19 · Next.js 16 (App Router) · TypeScript · Tailwind v4 · Redux
Toolkit · TanStack Query · Drizzle ORM · Postgres + pgvector · Better Auth ·
Vitest + React Testing Library · Vercel + Neon in production

Architecture notes, briefly: server components and ISR do the reading
(homepage shelves stream in via Suspense, detail pages revalidate daily);
server actions with `useActionState`/`useOptimistic` do the review writing;
TanStack Query owns server state on the client, Redux owns client state
(toasts); sessions are read client-side so static pages stay static.

## Running it locally

Prerequisites: Node 20+, Docker.

Create a `.env` in the project root:

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | `postgresql://appothecary:localdev@localhost:5432/appothecary` for the compose setup |
| `BETTER_AUTH_SECRET` | any long random string (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | `http://localhost:3000` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | a [GitHub OAuth app](https://github.com/settings/developers) with callback `http://localhost:3000/api/auth/callback/github` |
| `OPENAI_API_KEY` | only needed for `db:embed`; browsing and keyword search work without it |

Then:

```bash
npm install
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

To light up semantic search, backfill embeddings once after seeding
(~$0.01 for the full catalog):

```bash
npm run db:embed
```

## Scripts

| Script | Purpose |
| --- | --- |
| `dev` / `build` / `start` / `lint` | standard Next.js |
| `test` | Vitest + RTL suite |
| `db:generate` / `db:migrate` | Drizzle migrations from `src/db/schema.ts` |
| `db:seed` | ingest the catalog from the Aptoide API (idempotent) |
| `db:embed` | embed apps that don't have a vector yet (idempotent) |
| `db:verify-links` | canonicalize store links and null the dead ones |
| `db:studio` | browse the database in a UI |

## Attribution

The Appothecary logo and favicon are modified versions of the Android robot.
The Android robot is reproduced or modified from work created and shared by
Google and used according to terms described in the
[Creative Commons 3.0 Attribution License](https://creativecommons.org/licenses/by/3.0/).

Catalog data comes from the public [Aptoide](https://aptoide.com) API; app
names, icons, and descriptions belong to their respective owners.
