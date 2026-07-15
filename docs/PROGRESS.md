# Progress Tracker — AKMI Untirta Website

Statuses used: `Not started` · `In progress` · `Blocked` · `Completed` · `Deferred`

| Phase | Task | Status | Date | Files changed | Test result | Commit | Notes |
|---|---|---|---|---|---|---|---|
| 0 | Discovery questionnaire answered | Completed | 2026-07-15 | — | — | — | 33 questions answered by user |
| 0 | Clarify org name (AKMI vs LDK) | Completed | 2026-07-15 | — | — | — | Confirmed via chat: brand is AKMI Untirta |
| 0 | Clarify nav IA + Perpustakaan scope | Completed | 2026-07-15 | — | — | — | Via AskUserQuestion |
| 0 | Project charter (`PROJECT-VISION.md`) | Completed | 2026-07-15 | docs/PROJECT-VISION.md | N/A (doc only) | pending | Placeholder org text needs later edit |
| 0 | Feature backlog (`FEATURES.md`) | Completed | 2026-07-15 | docs/FEATURES.md | N/A (doc only) | pending | MVP vs deferred split |
| 0 | Decisions log (`DECISIONS.md`) | Completed | 2026-07-15 | docs/DECISIONS.md | N/A (doc only) | pending | |
| 0 | Progress tracker (this file) | Completed | 2026-07-15 | docs/PROGRESS.md | N/A (doc only) | pending | |
| 1 | Confirm Node.js/npm versions | Completed | 2026-07-15 | — | node v24.18.0, npm 11.16.0 (user PC) | — | Compatible with Next.js 16 (needs Node 20.9+) |
| 1 | Create Next.js project | Completed | 2026-07-15 | package.json, tsconfig.json, next.config.ts, src/, public/ | `npm run build` succeeded | pending | Scaffolded with create-next-app 16.2.10 (TS, Tailwind v4, ESLint, App Router, src dir) |
| 1 | Configure TypeScript | Completed | 2026-07-15 | tsconfig.json | `npx tsc --noEmit` passed | pending | Included by create-next-app |
| 1 | Configure Tailwind CSS | Completed | 2026-07-15 | postcss.config.mjs, src/app/globals.css | build passed | pending | Tailwind v4 (CSS-first config, no tailwind.config.js) |
| 1 | Configure ESLint | Completed | 2026-07-15 | eslint.config.mjs | `npm run lint` passed | pending | Prettier not yet added — deferred to a later Phase 1 step |
| 1 | Initial design system (colors/type/spacing) | Not started | | | | | Deferred to Phase 2 |
| 1 | One simple test page running locally | Completed | 2026-07-15 | src/app/page.tsx, src/app/layout.tsx | `curl localhost:3000` returned HTTP 200 | pending | Original placeholder page (not default Vercel template) |
| 1 | Git init + first commit | In progress | 2026-07-15 | | | | Repo already existed; committing scaffold now |
| 2 | Header, mobile nav, footer | Not started | | | | | |
| 2 | Homepage skeleton | Not started | | | | | |
| 3 | MySQL dev database + Prisma setup | Not started | | | | | |
| 4 | Articles vertical slice | Not started | | | | | |
| 5 | Auth + roles | Not started | | | | | |
| 6 | News / Events / Gallery / Management / Perpustakaan / Services / Schedule / Reports | Not started | | | | | One module at a time |
| 7 | Contact form + Newsletter | Not started | | | | | |
| 8 | Search, SEO, accessibility, performance | Not started | | | | | |
| 9 | Security & production readiness review | Not started | | | | | |
| 10 | Hostinger deployment | Not started | | | | | |
| 11 | Post-launch monitoring/training | Not started | | | | | |

## End-of-session summary (2026-07-15)

1. **Completed:** Phase 0 discovery — all 33 questions answered, naming clarified (AKMI Untirta), navigation IA confirmed, Perpustakaan module scoped into MVP. Four planning documents created.
2. **Files changed:** `docs/PROJECT-VISION.md`, `docs/FEATURES.md`, `docs/DECISIONS.md`, `docs/PROGRESS.md` (all new).
3. **Commands run:** `git status`, `mkdir -p docs` (no app code yet).
4. **Tests:** Not applicable — no code written yet, documentation only.
5. **Unresolved:** Org's exact vision/mission wording still placeholder pending your edit; exact social media handles pending; domain/Hostinger DB not yet created (expected — comes later).
6. **Next single recommended step:** Phase 1, Step 1 — install/verify the Next.js project tooling and create the actual project skeleton on your machine. (To be given as one small action after you review the docs above.)
7. **Suggested commit message:** `docs: add Phase 0 project charter, feature backlog, decisions log, and progress tracker`
