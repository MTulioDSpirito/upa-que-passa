# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (also runs TypeScript check)
npm run start    # Serve production build
npm run lint     # ESLint
npm run db:seed  # Re-seed the 7 admin accounts (idempotent, upserts by email)

# Database (PostgreSQL via Docker — required before dev/seed/migrate)
docker compose up -d          # Start local Postgres 16 (db: upa_db, port 5432)
npx prisma migrate deploy     # Apply migrations
npx prisma generate           # Regenerate the client after schema changes


```

There are no tests configured. TypeScript errors surface during `npm run build`.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · lucide-react v1.22 · Prisma 6 + **PostgreSQL** (Docker)

### Database (switched from SQLite to PostgreSQL on 2026-07-14)

`docker-compose.yml` at the root runs `postgres:16-alpine` (`upa_db`, user `postgres`, password `mysecretpassword`). `.env` holds `DATABASE_URL` (postgres connection string), `AUTH_SECRET`, and `RAWG_API_KEY` (gitignored). The schema uses `Json` and `String[]` columns, so it **cannot** run on SQLite anymore.

`prisma/schema.prisma` models:

- `AdminUser` — content-team logins. Roles are now just `DEVELOPER | COLABORADOR`. `prisma/seed.ts` seeds the 7 real team members (André, Capelli, Fael, Ique, Mateus, Patrão, Túlio) with a shared default password.
- `SugestaoAgente` — draft queue for agent-generated content (`tipo`: NOTICIA/REVIEW/LANCAMENTO, `criador`: which agent, JSON `payload`, `fontes[]`, status PENDING/APPROVED/REJECTED, reviewer relation).
- `SiteUser` / `Favorite` — public site users (registration UI exists; most public content is still mock).

### Admin auth

- `src/lib/session.ts` — Edge-safe JWT helpers (`jose`), used by `src/proxy.ts`. No Node APIs (no `bcryptjs`, no `next/headers`) — keep it that way or middleware breaks.
- `src/lib/auth.ts` — Node-only: password hashing (`bcryptjs`) and `getSession()` (reads the `upa_session` cookie via `next/headers`). Re-exports the session helpers.
- `src/app/api/auth/login/route.ts` / `logout/route.ts` — credential check + cookie set/clear.
- `src/app/admin/login/page.tsx` — dedicated admin login form (separate from the public `/login`).
- `src/proxy.ts` — protects `/admin/:path*` except `/admin/login`. Named `proxy.ts` per the Next.js 16 convention (`export function proxy(...)`, not `middleware`).
- `/api/admin/*` routes are **not** covered by the proxy matcher — each route must call `getSession()` itself (all current ones do).

### Content-agent pipeline (DB-based since 2026-07-14)

Five research personas — Kai (PS news), Nina (industry news), Milo (release calendar), Theo (reviews), Vera (external scores) — write **suggestions directly into the `SugestaoAgente` table**, no longer as `.md` files:

- `scripts/registrar-sugestao.ts` — the single entry point: `npx tsx scripts/registrar-sugestao.ts --json '<payload>'` inserts a PENDING suggestion. All agents finish by calling this.
- `.claude/agents/*.md` — Claude Code subagent shims (Team A). `.agents/skills/*/SKILL.md` — the same personas as Antigravity IDE skills (Team B). `manual-agentes.md` (root) documents how to invoke both; `Equipe/agent-index.md` is the routing table. The former Vic (editor-chefe) and Dara (data QA) agents were removed — moderation now happens in the admin UI/API.
- `/admin/sugestoes` — review UI (`SugestoesClient.tsx`). Approve/reject calls `/api/admin/entregas/aprovar|rejeitar`, which update the row's status (+ reviewer id, + rejection reason). Approval does **not** yet create production content — a human still adds it to the mocks manually.
- Legacy: `src/lib/entregas.ts` and the `Equipe/Entregas/{pendentes,aprovados,rejeitados}/` folders are the old file-based queue. The API no longer reads them, but the daily cloud routine (`RemoteTrigger` id `trig_018q9aogsE5hLed31mjrpvgK`, 08:07 America/Sao_Paulo, pushes to the GitHub repo) may still produce `.md` drafts there — `git pull` before assuming anything is current.
- `suggestion-agents-work.md` and `worked-agents.md` (root) document the persistence architecture and proposed next steps.

### Data layer — mock content in `src/mocks/`

Public content (games, news, reviews, marketplace) is still mock data, now split by domain:

- `src/mocks/games.ts`, `reviews.ts`, `news.ts`, `listings.ts`, `users.ts`, `team.ts` — the arrays.
- `src/lib/data.ts` — re-exports the mock arrays plus shared helpers: `getScoreColor(score)`, `getScoreBg(score)`, `formatScore`, `formatPrice`, `formatDate`. Import from `@/lib/data` as before.
- `src/lib/types.ts` — the interfaces (`Game`, `Review`, `User`, `Listing`, `NewsArticle`, …).
- `src/hooks/useAllGames.ts` — client hook that merges mock `GAMES` with admin-added games fetched from `/api/admin/games`. Pages that list games should use it rather than importing `GAMES` directly.

Scores (0–10) drive color via `getScoreColor` — green ≥9, lime ≥7.5, yellow ≥6, orange ≥4, red below. External site scores live on `Game.siteScores[]`; Metacritic is 0–100, everything else 0–10 — normalise before coloring: `score > 10 ? score / 10 : score`.

### Routing — Next.js App Router

Pages live in `src/app/`: home (`page.tsx`, composed from `components/home/*` sections), `/reviews` + `/reviews/[slug]` (game detail — the old `/jogos` routes were **removed**), `/noticias` + `/noticias/[slug]`, `/lancamentos`, `/ranking`, `/marketplace` + `/marketplace/[id]` + `/marketplace/vender`, `/quem-somos`, `/perfil`, `/login`, `/cadastrar`, `/admin`, `/admin/sugestoes`.

Dynamic pages receive `params` as a `Promise` and must call `use(params)` (React 19 pattern), **not** destructure directly.

### Components — organised by domain

- `src/components/layout/` — `Navbar`, `Footer`, `SiteShell`, `SearchModal`, `AuthModal`, `BrandHeader`
- `src/components/home/` — home-page sections (`TrendingStrip`, `FeaturedMoment`, `YouTubeVideos`, `MarketplaceFeatured`, `BestReviewed`, `LatestReviews`, `AboutUs`)
- `src/components/games/GameCard.tsx` — card used in grids (`compact` prop for sidebar lists)
- `src/components/ui/` — `ScoreBadge` (sizes `sm | md | lg | xl`), `Pagination`
- The old flat files (`src/components/Navbar.tsx`, `Footer.tsx`, etc.) are one-line re-export shims kept for backward compatibility — put new code in the subfolders.

### Styling

Tailwind v4 via `@import "tailwindcss"` in `globals.css` — there is **no `tailwind.config.ts`**. Custom utilities (`.glow-purple`, `.border-gradient`, `.game-card`, …) are defined in `globals.css`. Brand palette CSS variables on `:root`: `--purple: #7c3aed`, `--blue-neon: #3b82f6`. Page background is `bg-[#07070a]`; cards use `bg-[#111118]`. Display font is Russo One (`--font-display`), body is Geist.

### lucide-react gotcha

Version 1.22 does **not** export `Youtube`, `Twitter`, `Twitch`, `Instagram`, or `Discord`. Use alternatives like `Play`, `Tv2`, `Radio` instead.

### Images

Static assets go in `public/` (`logo-icon.png` is the favicon; team photos in `public/team/`; marketplace images in `public/images/marketingPlace/`). External image hostnames must be whitelisted in `next.config.ts` under `images.remotePatterns` before using `<Image>` from `next/image`; the project uses plain `<img>` for external sources to avoid that constraint.
