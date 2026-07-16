# Decisions & Assumptions Log — AKMI Untirta Website

Every entry below is either a **DECISION** (you explicitly chose it) or an **ASSUMPTION** (I inferred it — please correct if wrong). This file grows over time; newest entries at the top.

---

### 2026-07-16 — News: second content type, built on the Articles pattern

- **DECISION.** News reuses the Articles pattern (Markdown body, URL-only featured image, DRAFT/PUBLISHED, slug stable after creation) but adds the fields that the brief calls out as distinct to News: `reporterId` (required, defaults to the logged-in user), `editorId` (optional), `eventDate`, `location`, `sourceAttribution`. No tags for News (only the brief's original entity list — `News`, `NewsCategory` — no `NewsTag`).
- **DECISION.** `reporter` and `editor` are separate relations to `User` (Prisma named relations `NewsReporter`/`NewsEditor`), since a news item can have both a person who reported it and a separate person who edited it — distinct from Articles, which only has one author.
- Verified end-to-end with a scripted browser test against live MySQL, same rigor as Articles: seeded news visible in admin list → create a draft with event date/location/source → confirm hidden from public pages → publish → confirm visible on listing, homepage, and detail page with all News-specific fields (event date, location, source attribution, reporter name) rendering correctly → confirmed nested `/dashboard/berita/*` routes stay protected → confirmed a missing news slug returns a real 404. No bugs found this time (the Prisma tags issue from Articles doesn't apply here since News has no tags).

---

### 2026-07-15 — Phase 4: Articles, first complete vertical slice

- **DECISION.** Article body is **Markdown**, not a full WYSIWYG rich-text editor. Rendered with `react-markdown` + `remark-gfm`, styled with the `@tailwindcss/typography` plugin. Deliberately simpler than integrating a WYSIWYG editor (TipTap/Slate) — Markdown covers headings, bold/italic, lists, links, and tables, and `react-markdown`'s default (no `rehype-raw`) never executes raw HTML from the source, which is also a meaningful XSS-safety default, not just a scope-reduction choice.
- **DECISION.** Featured images are a plain URL text field for now, not a file upload. Real upload (validation, safe filenames, persistent storage) is its own dedicated feature, deferred per the original project brief's explicit separate treatment of media handling. `next.config.ts` allows optimizing images from any HTTPS host — acceptable since only trusted dashboard staff (not public users) can set this URL.
- **DECISION.** Only `DRAFT` and `PUBLISHED` statuses exist for now (not the full Draft → In Review → Scheduled → Published → Archived workflow described elsewhere in the brief) — matches the literal Phase 4 checklist, and a multi-stage editorial workflow isn't meaningful yet with just one Super Admin account. Scheduled publishing and archival are natural additions once there's an actual multi-person editorial team.
- **DECISION.** Slugs are generated once at creation from the title and never change on edit, even if the title changes later — protects against silently breaking shared/indexed article URLs. (Manually editable slugs could be added later if needed.)
- **DECISION.** Categories are pre-seeded (Kajian Islam, Kegiatan, Pengumuman) with no admin UI to manage them yet; tags are freeform (comma-separated in the article form) and auto-created on save via `connectOrCreate`. Full category CRUD deferred — not required for the vertical slice to work end-to-end.
- **DECISION.** Any authenticated dashboard user can manage all articles for now — no per-role restriction (e.g. Author-can't-publish, Editor-can-publish) enforced yet. Reasonable since only a Super Admin account exists currently; will need real enforcement once a second staff account with a lesser role is added.
- **BUG CAUGHT AND FIXED before reaching the user:** Prisma's `tags: { set: [], connectOrCreate: [...] }` pattern (meant to replace an article's tags on edit) is only valid on `update` — using it on `create` throws `PrismaClientValidationError`, since there's no existing relation to clear yet. Fixed by using `connectOrCreate` alone on create, and `{ set: [], connectOrCreate }` only on update. Caught via the scripted end-to-end browser test before any commit.
- Verified end-to-end with a scripted browser test against live MySQL: seeded article visible in admin list → create a new draft → confirm it's hidden from the public listing/homepage while in draft → edit it to Published → confirm it now appears on the public listing, homepage, and its own detail page with Markdown correctly rendered (bold, italic, lists), tags, and category all showing → confirmed unauthenticated visitors are redirected away from all nested `/dashboard/artikel/*` routes → confirmed a nonexistent article slug returns a real 404.

---

### 2026-07-15 — Minimal login built to unblock Phase 4 (Articles)

- **DECISION.** Built a minimal Auth.js v5 (`next-auth@beta`) login now, ahead of the full Phase 5 auth system, specifically so Phase 4 (Articles) has something real to authorize against. Full Phase 5 scope (password reset, email verification, brute-force rate limiting) is still deferred.
- **DECISION.** Used `next-auth@5.0.0-beta.31` — note this package is still tagged `beta` on npm even now, not `latest` (which is the older, App-Router-unfriendly v4). This is a known, long-standing situation in the Auth.js ecosystem: v5 beta is the de facto standard for Next.js App Router projects despite the label. Flagging this clearly since it's an unusual case of depending on a "beta" package by design.
- **DECISION.** Session strategy is JWT, not database sessions — required when using the Credentials provider (a hard Auth.js constraint, confirmed via research). The `accounts`/`sessions` tables created in Phase 3 remain unused by this Credentials-only setup but stay ready for a future OAuth provider (e.g. "Login with Google"), which would use them via a Prisma adapter.
- **DECISION.** Login implemented via a React 19 Server Action (`useActionState` + `signIn()` inside a `"use server"` action) rather than client-side `next-auth/react`, keeping the login page mostly server-rendered.
- **DECISION.** `/dashboard` is protected by a server-side check in `src/app/dashboard/layout.tsx` (calls `auth()`, redirects to `/login` if absent) rather than Next.js middleware — simpler to reason about for this project's stage, and still fully server-enforced per the project's "never rely on hiding buttons" rule. Both `/login` and `/dashboard` are marked `noindex`.
- Verified end-to-end with a scripted browser test against a live database: wrong password shows an error and stays on `/login`; correct credentials (the seeded Super Admin) redirect to `/dashboard` and display the right name/role; logout redirects home; and `/dashboard` is re-protected immediately after logout.
- **Aside (this cloud session's test environment only, not user-facing):** while re-testing, this container's test database got tangled between MariaDB and real MySQL packages (an apt package conflict from earlier testing) and needed a clean reinitialize. Purely a cloud-session housekeeping detail — doesn't affect the user's own MySQL install or the delivered code.

---

### 2026-07-15 — Phase 3 minimum schema created and migrated

- **DECISION.** You confirmed the proposed minimum schema (`User`, `Account`, `Session`, `VerificationToken`, role as a simple enum on `User`). Schema written, formatted, validated, and migrated successfully against a live test database — verified the actual MySQL table structure with `DESCRIBE users`.
- **DISCOVERY.** Prisma 7 requires application code to construct `PrismaClient` with an explicit **driver adapter** rather than just reading `DATABASE_URL` automatically — a real breaking change from earlier Prisma versions (consistent with this project's own `AGENTS.md` warning to check installed docs rather than trust training data). Installed `@prisma/adapter-mariadb` (supports both MySQL and MariaDB) and wired it into `src/lib/prisma.ts`.
- **DECISION.** Added `postinstall: prisma generate` to `package.json` so the gitignored generated client (`src/generated/prisma`) is automatically rebuilt after every `npm install` — without this, the app would fail to build on any fresh clone/pull.
- **DECISION.** Added `bcryptjs` (pure-JS password hashing, chosen over native `bcrypt` specifically to avoid native-module build failures on Windows) and `tsx` (to run the TypeScript seed script directly).
- **DECISION.** Seed script (`prisma/seed.ts`) creates one sample Super Admin (`admin@akmiuntirta.test` / `ChangeMe123!`) — a clearly fake, committed-on-purpose placeholder for local development only, never meant for production use.
- **RESOLVED.** Prisma Studio's earlier `a.sort is not a function` error was confirmed to be a MariaDB-in-the-test-environment quirk, not a real bug — the user ran `npm run db:migrate`, `npm run db:seed`, and `npm run db:studio` against their real MySQL 8.0.46 and all three worked cleanly (Studio picked port 51212 automatically since 5555 was already in use locally).
- Verified end-to-end: schema validate → migrate → generate client → seed → direct SQL confirmation of seeded row → typecheck/lint/production build all passing.

---

### 2026-07-15 — Phase 3 database foundation begins (Prisma + MySQL)

- **DECISION.** You installed MySQL Community Server 8.0.46 locally on Windows ("Server only" install — no Workbench, since we'll use Prisma Studio instead) and created an empty `akmi_untirta_dev` database via the `mysql` CLI.
- **DECISION.** Installed `prisma` + `@prisma/client` (v7.8.0). Prisma 7 changed its config approach from earlier versions: it now uses a `prisma.config.ts` file (loading `DATABASE_URL` via `dotenv`) rather than an inline `url = env(...)` line in `schema.prisma`, and the generated client now outputs to `src/generated/prisma` (gitignored, regenerated via `prisma generate`) instead of living inside `node_modules`. Followed the tool's own scaffolding rather than older training-data patterns, per the project's own `AGENTS.md` warning about breaking changes in this environment.
- **DECISION.** Installed MariaDB (MySQL-compatible) inside this cloud session purely so Claude can test real migrations/connections before handing steps to the user — not part of the shipped project. Confirmed Prisma successfully connects to a live database (`prisma db pull` correctly reported the target database and that it was empty).
- **DECISION.** `.env.example` added with a clearly fake placeholder `DATABASE_URL`; the real `.env` (with the user's actual local MySQL password) stays local-only and gitignored, never committed or shared in chat.
- **PROPOSED (awaiting user confirmation).** Phase 3's "minimum schema" scope: `User`, `Account`, `Session`, `VerificationToken` only (the tables Auth.js needs), with role stored as a simple enum directly on `User` rather than building a full separate Role/Permission table system — deferred until multiple overlapping staff roles actually require it. All content tables (Article, News, Event, etc.) are deferred to their own phases starting Phase 4, per the "one vertical slice at a time" rule.

---

### 2026-07-15 — Phase 2 public layout (header, footer, homepage skeleton)

- **DECISION.** Added `lucide-react` (icon library) — justified by needing several consistent UI icons (menu/close/chevron/mail) rather than hand-drawing SVGs; small, tree-shakeable, well-maintained.
- **DECISION.** Desktop dropdown menus ("Tentang Kami", "Lainnya") and the mobile accordion use the native HTML `<details>/<summary>` element instead of a JS dropdown library (e.g. Headless UI/Radix). This gives full keyboard support and correct ARIA semantics for free, with zero extra dependencies — appropriate for a two-item, non-modal dropdown. Known trade-off: it doesn't auto-close on outside click (native browser behavior); acceptable for MVP, can be enhanced later with a small JS handler if it bothers users in testing.
- **DECISION.** `src/lib/navigation.ts` is the single source of truth for the site's nav structure, shared by the header and footer, so the confirmed IA (see `docs/FEATURES.md` §1) only needs to be edited in one place.
- **DECISION.** Added a `ComingSoon` component and matching placeholder pages for every nav destination (`/tentang`, `/tentang/struktur`, `/tentang/kontak`, `/tentang/galeri`, `/artikel`, `/berita`, `/kegiatan`, `/perpustakaan`, `/layanan`, `/jadwal`, `/laporan`) so clicking any menu item shows a clear "coming soon" message instead of a 404 during development. These get replaced module-by-module starting Phase 4 (Articles).
- **DECISION.** Homepage rebuilt as a real skeleton matching the brief's required sections (hero, program utama, artikel terbaru, berita terbaru, kegiatan mendatang, galeri pilihan, layanan, CTA, newsletter, kontak), using a shared `Section` wrapper and `PlaceholderCard` for the not-yet-wired content blocks. The earlier design-token preview content has been retired now that the palette is approved and verified.
- **DEFERRED.** Social media link URLs in the footer still point to `#` — exact handles are pending (see the Phase 0 entry below) and will be wired up in Site Settings (Phase 6).
- Verified via typecheck, lint, production build (all 12 routes built successfully), a Playwright screenshot of desktop and mobile homepage layouts, and an automated test confirming the mobile hamburger menu opens and the accordion dropdown expands correctly.

---

### 2026-07-15 — Brand palette retuned to match real logo

- **DECISION.** You added the real logo file to `public/brand/logo.png` (via your own `git add`/`commit`/`push` — first self-driven Git workflow of the project). Colors were sampled directly from it.
- **DECISION.** Retuned the `brand-*` scale: `brand-500` now matches the logo's dominant fill green (`#098e09`) exactly; `brand-700` matches its dark badge outline (`#0a6003`) exactly. `brand-600` (the default color for solid buttons/links) is intentionally a touch darker than the logo's literal fill tone — `#0a7606` — so white button text clears WCAG AA contrast (~5.8:1; the literal logo green only reaches ~4.3:1, just under the 4.5:1 minimum for normal text).
- **DECISION.** Accent gold scale left unchanged — you confirmed it paired well before the retune, and gold still complements the more vivid grass-green just as well.
- Verified via typecheck, lint, production build, and a Playwright screenshot showing the logo and updated swatches rendering correctly.

---

### 2026-07-15 — Phase 1 design system tokens

- **DECISION.** Added Prettier (+ `prettier-plugin-tailwindcss` for automatic class sorting) alongside ESLint, wired via `eslint-config-prettier` so the two tools don't fight over formatting rules.
- **DECISION.** Defined an original two-color token system in `src/app/globals.css`: a hand-tuned 11-stop emerald "brand" scale (primary) and a warm gold 10-stop "accent" scale (used sparingly for highlights). Status colors (success/warning/danger/info) intentionally reuse Tailwind's built-in red/amber/blue scales rather than adding redundant custom tokens.
- **DECISION.** Added two brand-tinted shadow tokens (`shadow-brand-sm`, `shadow-brand-md`) for a soft, "rich" elevation feel on cards/buttons, instead of flat default shadows.
- **DECISION.** Baked in two accessibility defaults at the token level rather than leaving them for later: a visible emerald `:focus-visible` ring on all interactive elements, and a `prefers-reduced-motion` reset that disables animations/transitions for visitors who request it.
- **DEFERRED.** Reusable typography/Button/Card _React components_ (as opposed to the raw Tailwind utility tokens) — planned for Phase 2 (public layout), per the original phase breakdown. This step only established the underlying tokens and demonstrated them with inline utility classes on the test page.
- **ASSUMPTION.** Exact brand hex values were hand-picked to evoke the "youthful but rich" emerald tone from the shared logo description, since the actual logo file isn't in the project yet. These may need minor adjustment once the real logo file is added and compared side-by-side.

---

### 2026-07-15 — Phase 1 project scaffold

- **DECISION.** Development workflow: Claude builds/edits files and runs commands directly in this cloud session and pushes to GitHub; the user pulls to their own Windows PC whenever they want to run/view the site locally in a browser (chosen over having the user type every command themselves).
- **DECISION.** `npm` package name set to `akmi-untirta` (lowercase, since npm forbids capital letters — the GitHub repo/folder name `Untirta` stays as-is, only the internal `package.json` name differs).
- **DECISION.** Scaffolded with `create-next-app@16.2.10`: TypeScript, Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`), ESLint, App Router, `src/` directory, `@/*` import alias, npm as package manager.
- **DECISION.** Next.js anonymous telemetry disabled in this session (`npx next telemetry disable`). This setting is per-machine, so it should also be run once on the user's own Windows PC — noted as a follow-up.
- **ASSUMPTION.** `npm audit` flags a moderate-severity issue in PostCSS bundled _inside_ Next.js's own dependency tree (not something we control directly). npm's suggested "fix" would downgrade Next.js to version 9 (from 2020), which is not a real fix. Decision: leave as-is and re-check on the next Next.js patch release rather than force a bad downgrade.
- **DECISION.** Default `create-next-app` starter branding (Vercel/Next.js logos, template copy, "Deploy Now" links) replaced with a minimal original placeholder homepage — per the project's IP rule of not carrying over any other product's branding, even accidentally from tooling defaults.
- **DECISION.** `lang="id"` set on the root HTML tag and page metadata updated to reflect AKMI Untirta, since Bahasa Indonesia is the primary site language.

---

### 2026-07-15 — Phase 0 discovery

- **DECISION.** Official brand name is **AKMI Untirta**, replacing the working title "LDK Untirta" used when this project started. Applies to nav, titles, docs.
- **ASSUMPTION.** AKMI Untirta is treated as an evolution of the historically-referenced "LDK Baabussalam" — used only for background understanding, not displayed on the site.
- **DECISION.** Tech stack confirmed: Next.js (App Router) + TypeScript + Tailwind CSS + MySQL + Prisma + Auth.js + Zod + React Hook Form, deployed to Hostinger Business plan (Node.js Web App).
- **DECISION.** Primary brand color: emerald green. Full palette to be proposed by Claude around this anchor color (Phase 2).
- **DECISION.** Visitors cannot self-register; only the admin creates member/staff accounts.
- **DECISION.** Articles require editor approval before publishing.
- **DECISION.** Confirmed public navigation IA (see `docs/FEATURES.md` §1), including a new "Perpustakaan" (digital library) module, included in MVP scope.
- **DECISION.** "Lainnya" menu = Jadwal + Laporan only; no duplicate Struktur link.
- **ASSUMPTION.** "Laporan" means downloadable organizational accountability/annual reports (Laporan Pertanggungjawaban). To confirm when we build that module.
- **ASSUMPTION.** Privacy default: org-level contact info is public; individual officers' personal phone/address/student ID stay private-by-default even though you said "all info is public," per the project's privacy-by-default requirement. Overridable per field later.
- **DECISION.** Media storage for MVP: persistent directory on Hostinger (not ephemeral runtime storage), no paid image CDN needed yet given ~100 photos/year. Abstracted so we can switch to S3/Cloudinary later.
- **DECISION.** Email sending for MVP: Gmail SMTP via `humedakmi2026@gmail.com` using an app password (not the real account password) and Nodemailer, for contact-form notifications and password-reset/verification emails.
- **ASSUMPTION.** Exact organizational description/vision/mission text could not be fetched from akmi-untirta.com (site returned HTTP 403 to automated fetch) or verified from Instagram — placeholder text was drafted in `docs/PROJECT-VISION.md`, clearly labeled, pending your edits.
- **DEFERRED.** Exact social media handles/URLs (Instagram/TikTok/YouTube) — to be provided when we build Site Settings (Phase 6), currently know only that these three platforms are used.
- **DEFERRED.** Domain name and Hostinger MySQL database creation — will happen just before Phase 10 deployment; development proceeds locally until then.

---

## How to challenge or correct an entry

Just tell me in chat, e.g. "Actually, item X is wrong — it should be Y." I will update this file and, if code/docs already reflect the old decision, fix those too.
