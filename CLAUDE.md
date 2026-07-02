# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (also runs TypeScript check)
npm run start    # Serve production build
npm run lint     # ESLint
npm run db:seed  # Re-seed the 5 admin accounts (idempotent, upserts by email)
```

There are no tests configured. TypeScript errors surface during `npm run build`.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · lucide-react v1.22 · Prisma 6 + SQLite (admin auth only)

### Admin auth backend (added 2026-07-01)

The only real backend is the **admin login** for the 5-person content team. Everything else (games, news, reviews, marketplace listings, public users) is still mock data in `data.ts` — see [[Equipe/Operacoes/Diretrizes/DI-003-backend-e-admins]] for the plan to extend this further.

- `prisma/schema.prisma` — single `AdminUser` model (SQLite, file at `prisma/dev.db`, gitignored).
- `prisma/seed.ts` — seeds 5 admins (Vic/Kai/Vera/Theo/Dara, one per `AdminRole`) with a shared default password. Run `npm run db:seed` after any migration reset.
- `src/lib/session.ts` — Edge-safe JWT helpers (`jose`), used by `src/middleware.ts`. No Node APIs (no `bcryptjs`, no `next/headers`) — keep it that way or middleware breaks.
- `src/lib/auth.ts` — Node-only: password hashing (`bcryptjs`) and `getSession()` (reads the `upa_session` cookie via `next/headers`). Re-exports the session helpers for convenience.
- `src/app/api/auth/login/route.ts` / `logout/route.ts` — credential check + cookie set/clear.
- `src/app/admin/login/page.tsx` — dedicated admin login form (separate from the public `/login`, which is still unwired UI for regular site users).
- `src/proxy.ts` — protects `/admin/:path*` except `/admin/login`; redirects to login if the session cookie is missing/invalid. Named `proxy.ts` (not `middleware.ts`) per the Next.js 16 file convention — the export is `export function proxy(...)`, not `middleware`.
- `src/app/admin/page.tsx` is now a Server Component: reads the session, redirects if absent, passes the user down to `AdminDashboardClient.tsx` (the old client-side dashboard, unchanged otherwise) which shows the logged-in admin + a logout button in the sidebar.

`.env` holds `DATABASE_URL` and `AUTH_SECRET` (gitignored). If either is missing, login/session calls throw.

### Content team automation (added 2026-07-02)

`Equipe/` (project root, not under `src/`) holds the content team system — 5 personas (Vic/Kai/Vera/Theo/Dara) that research PS5 news/scores/reviews and hand off drafts for human admin review. Read `Equipe/AGENTS.md` first; it's the root contract.

- `.claude/agents/*.md` — Claude Code subagent shims for each persona (required so `Task`/`Agent` can invoke them by name, e.g. `kai-reporter`).
- `Equipe/Entregas/{pendentes,aprovados,rejeitados}/` — the draft queue. Kai/Vera/Theo write here; nothing touches `src/lib/data.ts` automatically.
- A cloud routine (`RemoteTrigger`, id `trig_018q9aogsE5hLed31mjrpvgK`) runs daily at 08:07 America/Sao_Paulo against `https://github.com/MTulioDSpirito/upa-que-passa` (private repo — created 2026-07-02 specifically so the cloud agent has something to clone/push to). It researches, writes drafts to `Equipe/Entregas/pendentes/`, and pushes. **This means the local repo and GitHub can diverge** — `git pull` before assuming the queue is current.
- `src/lib/entregas.ts` — reads/moves draft files (frontmatter parsed with `js-yaml`; format is `---\nyaml\n---\nbody`).
- `/admin/sugestoes` — the review UI. Any of the 5 logged-in admins can approve (→ `aprovados/`, still just a file, a human still has to manually turn it into a `data.ts` entry per `Equipe/Operacoes/SOPs/SOP-001-adicionar-jogo.md` / `SOP-002-publicar-noticia.md`) or reject (→ `rejeitados/`, with a reason prepended as an HTML comment).
- `src/app/api/admin/entregas/**` — these routes are **not** covered by `src/proxy.ts`'s matcher (`/admin/:path*` only matches page routes, not `/api/admin/...`). Each route checks `getSession()` itself. If you add more `/api/admin/*` routes, they need the same manual check.

### Data layer — mock content, no backend (games/news/reviews/marketplace)

All content data lives in two files:

- `src/lib/types.ts` — TypeScript interfaces (`Game`, `Review`, `User`, `Listing`, `NewsArticle`, etc.)
- `src/lib/data.ts` — Mock arrays (`GAMES`, `REVIEWS`, `USERS`, `LISTINGS`, `NEWS`) plus shared helpers: `getScoreColor(score)`, `formatScore(score)`, `formatPrice(price)`, `formatDate(dateStr)`

When adding a new game, review, or listing, edit `data.ts` directly. Scores (0–10) drive color via `getScoreColor` — green ≥9, lime ≥7.5, yellow ≥6, orange ≥4, red below.

External site scores (Metacritic, IGN, etc.) are stored on `Game.siteScores[]`. Metacritic uses a 0–100 scale; all others use 0–10. Normalise before calling `getScoreColor`: `score > 10 ? score / 10 : score`.

### Routing — Next.js App Router

All pages are in `src/app/`. Dynamic segments: `/jogos/[slug]`, `/marketplace/[id]`, `/noticias/[slug]`. Those pages receive `params` as a `Promise` and must call `use(params)` (React 19 pattern), **not** destructure directly.

### Shared components

- `src/components/Navbar.tsx` — fixed top navbar with megamenu, `"use client"`
- `src/components/Footer.tsx` — static footer
- `src/components/GameCard.tsx` — card used in grids; accepts `compact` prop for sidebar lists
- `src/components/ScoreBadge.tsx` — coloured score display; sizes: `sm | md | lg | xl`

### Styling

Tailwind v4 is configured via `@import "tailwindcss"` in `globals.css` — there is **no `tailwind.config.ts`**. Custom utility classes (`.glow-purple`, `.border-gradient`, `.game-card`, etc.) are defined in `globals.css`. CSS variables for the brand palette are on `:root`: `--purple: #7c3aed`, `--blue-neon: #3b82f6`. Background cards use `bg-[#111118]`; page background is `bg-[#0a0a0f]`.

### lucide-react gotcha

Version 1.22 does **not** export `Youtube`, `Twitter`, `Twitch`, `Instagram`, or `Discord`. Use alternatives like `Play`, `Tv2`, `Radio` instead.

### Images

Static assets go in `public/`. `banner.jpg` is the hero background. External image hostnames must be whitelisted in `next.config.ts` under `images.remotePatterns` before using `<Image>` from `next/image`. The project currently uses plain `<img>` tags for external sources to avoid this constraint on every new domain.
