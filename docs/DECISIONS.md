# Decisions & Assumptions Log — AKMI Untirta Website

Every entry below is either a **DECISION** (you explicitly chose it) or an **ASSUMPTION** (I inferred it — please correct if wrong). This file grows over time; newest entries at the top.

---

### 2026-07-20 — Search + SEO: sitemap, robots.txt, per-page metadata, global search

- **DECISION.** `NEXT_PUBLIC_SITE_URL` is a new env var (defaults to `http://localhost:3000` if unset) used to build absolute URLs for `sitemap.xml` and Open Graph metadata, since the real domain isn't registered yet (deferred to Phase 10 deployment, per `docs/DECISIONS.md`'s Phase 0 entry). Update it once the domain exists.
- **DECISION.** `src/app/sitemap.ts` and `src/app/robots.ts` use Next.js's built-in file conventions rather than a hand-written static file — they query Prisma directly for every published Article/News/Event/Book/GalleryAlbum slug, so the sitemap always reflects real published content instead of going stale. `/dashboard` and `/login` are disallowed in `robots.txt` since they're private, not content search engines should index.
- **DECISION.** Added `openGraph` metadata (title/description/image) to every content detail page (Article, News, Event, Book, Gallery album) so links shared on WhatsApp/Instagram/social media show a proper preview card instead of a generic one. A new `toPlainSummary()` helper in `src/lib/format.ts` strips Markdown syntax and truncates to ~160 characters for pages whose only description field is a long Markdown body (Event, Book, Gallery), since a raw Markdown string with `#`/`*`/links isn't fit for a meta description.
- **DECISION.** Did **not** add a title template (e.g. Next's `title: { template: "%s — AKMI Untirta" }`) to the root layout — every existing page already hardcodes its own `"— AKMI Untirta"` suffix, so a template would have doubled it up across ~15 files. Simpler to leave the existing per-page convention as-is.
- **DECISION.** Global search (`/cari`) queries Article/News/Event/Book directly with Prisma's `contains` filter (case-insensitive by MySQL's default collation) rather than a dedicated search engine (Elasticsearch, Algolia) or full-text index — explicitly ruled out as overkill for this scale in `docs/FEATURES.md` §4. Results are grouped by content type, capped at 10 per type, and only ever match `PUBLISHED` items.
- **DECISION.** The search box is a plain `<form action="/cari" method="get">` — no client-side JavaScript, no debounced fetch. It works via ordinary browser form submission (and thus without JS enabled), matches the project's general preference for simple native HTML over unnecessary client interactivity, and needed no new dependency.
- Verified end-to-end with a scripted browser test: `/sitemap.xml` returns 200 and includes known routes → `/robots.txt` returns 200 and disallows `/dashboard` → the header search box is visible on the homepage → searching a real seeded term returns grouped results linking to the correct pages → an empty query shows a prompt instead of an error → a nonsense query shows a "no results" message instead of a blank page.

---

### 2026-07-20 — Newsletter signup: storage only, no sending yet

- **DECISION.** `NewsletterSubscriber` is intentionally minimal — just `email` (unique) and `subscribedAt`. This phase only captures interest; actually composing and sending bulk newsletters is deferred until a provider and consent/unsubscribe flow are chosen (see `docs/FEATURES.md` §6 and `docs/PROJECT-VISION.md` §8). Re-subscribing with an already-known email is a silent no-op (`upsert` with an empty `update`), not an error, since a visitor re-submitting the form isn't doing anything wrong.
- **DECISION.** Reused the same honeypot pattern as the contact form (hidden `website` field, validation accepts any value, the Server Action silently fake-succeeds if it's filled) — this time written correctly the first time, applying the lesson from the contact form bug below instead of repeating it.
- **BUG CAUGHT DURING TESTING (test script only, not an app bug):** the first version of the E2E test tried to trigger server-side email validation by changing the email input's `type` attribute from `"email"` to `"text"` via `page.evaluate()`, but React reverted that mutation back to `"email"` on its next render (confirmed via a hydration-mismatch warning). With the input still `type="email"`, the browser's own HTML5 constraint validation silently blocked submission before any server round-trip happened. Fixed by setting the `<form>`'s `noValidate = true` via `page.evaluate()` instead of touching the input's `type` — this disables the browser's native validation without fighting React's rendering, so the test can actually reach and verify the server-side Zod validation.
- Verified end-to-end with a scripted browser test against live MySQL: subscribing with a new email shows the success message and stores it → re-subscribing with the same email is handled gracefully with no duplicate row → an invalid email is rejected with the server-side "Alamat email tidak valid." message → a honeypot-tripped submission shows the same fake success message but is confirmed absent from the database → `/dashboard/newsletter` requires login → the admin list shows the real subscriber exactly once → deleting a subscriber removes them from the list.

---

### 2026-07-20 — Contact form: database is the source of truth, email is best-effort

- **DECISION.** Every valid submission is always saved to `contact_messages` first — a notification email is then attempted, but if it fails (or SMTP isn't configured at all, as in this dev environment) the message is still safely stored and visible in the admin inbox. Email delivery is a "nice to have" convenience for the admin, not the mechanism that determines whether a message was received. This matches `docs/PROJECT-VISION.md` §8's plan to use Gmail SMTP via Nodemailer, wrapped in `src/lib/email.ts` so the provider can be swapped later without touching the form's Server Action.
- **DECISION.** Spam mitigation for now is a **honeypot field** only (a `website` input hidden off-screen via CSS that real visitors never fill in, but simple bots that auto-fill every field will) — not a CAPTCHA or rate limiting, which are explicitly part of the separate Phase 9 security review, not this feature. A honeypot costs nothing (no new dependency, no user friction) and catches the least sophisticated automated spam, which is the most common kind a small org site actually receives.
- **BUG CAUGHT AND FIXED before reaching the user:** the honeypot field's Zod schema originally used `.max(0)` to mean "must be empty," but that made the _entire form_ fail validation with a generic error whenever a bot filled it in — the honeypot check in the Server Action (`if (website) { return silent success }`) never ran, because validation rejected the submission before reaching it. Fixed by accepting any string for that field in the schema and letting the action decide what a non-empty value means, so a bot's submission now gets the intended silent fake-success response instead of a visible validation error (which would have told a bot its submission was noticed).
- Verified end-to-end with a scripted browser test against live MySQL: a valid submission is stored and shown in the admin inbox → a too-short message is rejected by server-side validation and never stored → a honeypot-tripped submission shows a fake "success" message to the sender but is confirmed absent from the database → `/dashboard/pesan` requires login → mark-as-read removes the action button and updates the list badge → delete removes the message → a missing message id returns a real 404.

---

### 2026-07-19 — Laporan (Reports): confirming the "assumption" from Phase 0

- **DECISION (resolving an earlier assumption).** `docs/FEATURES.md` §1 flagged "Laporan" as an assumed meaning — organizational accountability reports (Laporan Pertanggungjawaban / annual reports) published as downloadable documents — and asked for confirmation when this module was built. Built exactly as assumed: a `Report` model with `title`, optional `description`, `year`, an optional `fileUrl`, and DRAFT/PUBLISHED status. If this isn't what "Laporan" was meant to be, the model is simple enough to adjust without much rework.
- **DECISION.** No individual detail page — same directory-listing pattern as Layanan, since a report is just a title, year, short description, and a download link; nothing that needs its own page/URL. The public `/laporan` page lists published reports ordered newest-year-first with a per-report "Unduh Laporan" button (hidden when no `fileUrl` is set yet).
- **DECISION.** `fileUrl` is a plain URL, same pattern as every other document/file field in the project (`documentUrl` on Events, `fileUrl` on Books) — no file upload yet, consistent with the project-wide deferral of real media/file storage.
- Verified end-to-end with a scripted browser test against live MySQL: seeded published reports (2025, 2024) render on `/laporan` in year-descending order with working download buttons → `/dashboard/laporan` requires login → create a draft report (no file) → confirm hidden from the public page → edit it to add a `fileUrl` and publish → confirm it now appears publicly, correctly sorted ahead of older years → confirmed a missing admin report id returns a real 404.

---

### 2026-07-16 — Jadwal (Schedule): recurring weekly agenda, distinct from Kegiatan

- **DECISION.** `ScheduleItem` models a **recurring weekly** schedule (e.g. "Kajian Tafsir — Senin, 19:00, Masjid Kampus"), not one-off dated events — that's already `Event`'s job. The nav lists "Jadwal" and "Kegiatan" as two separate items, and a weekly kajian timetable is the natural complement to Kegiatan's one-off activities, so `ScheduleItem` has a `dayOfWeek` enum instead of a specific calendar date.
- **DECISION.** `startTime`/`endTime` are plain `String` fields (`"HH:MM"`, validated by a regex in the Zod schema) rather than a `DateTime`/`Time` column — since these aren't tied to any specific calendar date, a real date/time type would add timezone-handling complexity for no benefit. The admin form still uses native `<input type="time">` for a proper time-picker UX; only the stored representation is a plain string.
- **DECISION.** The public `/jadwal` page renders a **list view grouped by day** (Senin → Minggu), not a full month calendar grid. `docs/FEATURES.md` described this module as "Calendar (month/list view)" without committing to one — a grouped agenda list is simpler to build correctly, reads well on mobile, and fits a weekly-recurring schedule better than a month grid (which implies specific dates, not weekly recurrence). A real calendar grid can be added later if ever needed for Kegiatan-style dated items.
- Verified end-to-end with a scripted browser test against live MySQL: seeded published items render on `/jadwal`, correctly grouped under their day headings → `/dashboard/jadwal` requires login → create a draft item → confirm hidden from the public page → edit it to publish → confirm it now appears under the correct day heading with its time and location → confirmed a missing admin schedule item id returns a real 404.

---

### 2026-07-16 — Layanan (Services): a directory listing, not a full content type

- **DECISION.** `Service` is deliberately simpler than Articles/News/Events/Gallery/Books — no slug, no individual detail page, no category. `docs/FEATURES.md`'s scope for this module is just a "Services directory," so the model is name + description + an optional external/internal link + DRAFT/PUBLISHED + `displayOrder`. Adding a slug or detail route now would be speculative — nothing in the brief asks for one, and it's easy to add later if a service ever needs its own page.
- **DECISION.** No admin reordering UI — `displayOrder` is set automatically (append at `max(displayOrder) + 1` for new services, matching the same pattern used for `GalleryImage`/`Officer`) and isn't exposed as an editable field. With only a handful of services expected, manual reordering wasn't worth building yet.
- **DECISION.** The homepage's "Layanan" section (previously a placeholder) is now wired to the same query pattern as every other homepage section — top 3 published services ordered by `displayOrder`, reusing the same `ServiceCard` component as the `/layanan` listing page rather than a separate homepage-only variant.
- Verified end-to-end with a scripted browser test against live MySQL: seeded published services render on both `/layanan` and the homepage → `/dashboard/layanan` requires login → create a draft service (no link) → confirm hidden from public listing → edit it to add a link and publish → confirm it's now visible publicly with a working "Selengkapnya" link pointing at the right URL → confirmed a missing admin service id returns a real 404.

---

### 2026-07-16 — Perpustakaan (Digital Library): browser-native PDF reader, no new vendor or dependency

- **DECISION.** The reader page (`/perpustakaan/buku/[slug]/baca`) embeds the book's PDF in a plain `<iframe src={fileUrl}>` and relies on the browser's own built-in PDF viewer — not a "flipbook" third-party embed service, and not a new dependency like PDF.js. `docs/FEATURES.md` §3 explicitly listed both options as "to be finalized" — this is the simplest one that works today with zero new packages and zero vendor lock-in, consistent with the project's no-copying-the-reference-site rule (ldksyah.id likely uses a flipbook vendor; this deliberately doesn't).
- **DECISION.** `fileUrl` is a plain URL, same pattern as `featuredImage`/`documentUrl` elsewhere — no file upload yet (deferred, see the Articles decision on media handling). If there's no `fileUrl`, the "Baca Buku" button simply doesn't render on the detail page, and the reader route itself 404s directly rather than showing a broken/empty page.
- **DECISION.** Added a `BookCategory` lookup table, matching the `ArticleCategory`/`NewsCategory` pattern (pre-seeded, no admin management UI yet) rather than a free-text field — keeps the same reusable-dropdown convention used everywhere else in the schema.
- **DECISION.** No `publishedAt` field like Articles/News — a book's public visibility is controlled purely by `status` (DRAFT/PUBLISHED), since "when was this book added to the library" isn't a piece of information the brief asked for, unlike an article's publish date.
- Verified end-to-end with a scripted browser test against live MySQL: seeded published book with a working PDF `fileUrl` renders on the public listing, detail, and reader pages → `/dashboard/perpustakaan` requires login → create a draft book (no file) → confirm hidden from public listing → edit it to add a `fileUrl` and publish → confirm it's now visible publicly with a working "Baca Buku" button and iframe reader → confirmed a missing book slug, a missing book's reader page, and a missing admin book id all return real 404s.

---

### 2026-07-16 — Struktur Pengurus (Management Structure): three-level hierarchy, period-scoped

- **DECISION.** Modeled as three tables — `ManagementPeriod` → `Division` → `Officer` — matching the brief's entity list exactly (`ManagementPeriod`, `Division`, `Officer`). A period ("2025/2026") contains divisions ("Pengurus Inti", "Divisi Kaderisasi"), each of which contains officers (name + position + optional photo). This is one level deeper than Gallery's album→photo pattern, but follows the same "save the parent first, then manage children on its edit page" admin workflow.
- **DECISION.** "Ketua Umum" and other core leadership roles are modeled as officers inside an ordinary division (e.g. one named "Pengurus Inti"), not as separate dedicated fields — simpler than special-casing leadership positions, and flexible enough to match however the org actually organizes each period's structure (division names and roles can differ period to period).
- **DECISION.** Exactly one `ManagementPeriod` can be `isActive` at a time, enforced in application code (`updateMany` to clear the flag before setting the new one), not a database constraint — MySQL has no native "at most one true" constraint without a filtered/partial index (not supported the same way as Postgres). The public `/tentang/struktur` page defaults to the active period, but all periods stay browsable via a period-switcher (`?periode=<id>`), so past leadership stays on the historical record instead of being overwritten each year.
- **DECISION.** No separate `/tentang/struktur/[periodId]` route — period switching uses a query parameter on the same page instead of nested dynamic routing, since it's just a display filter on one page's content, not a distinct piece of content with its own URL-worthy identity (unlike, say, an article's slug).
- Verified end-to-end with a scripted browser test against live MySQL: seeded active period with its divisions/officers renders on the public page → `/dashboard/struktur` requires login → create a new inactive period → confirm the public page still defaults to the old active one → confirm the new period is reachable via the switcher and shows empty → add a division and an officer to it → confirm both appear publicly under that period → mark the new period active → confirm exactly one period is flagged active in the database and the public default switches to it → delete the officer, then the division (with cascade) → confirm both are gone → confirm a missing admin period id returns a real 404. One test-script bug was caught and fixed along the way (not an app bug): Playwright's `text=` selector does case-insensitive substring matching, so `text=Aktif` was matching `Non-aktif` too — fixed by asserting exact text instead.

---

### 2026-07-16 — About/Profil: first singleton content, not a full StaticPage system

- **DECISION.** `SiteProfile` is a **singleton table** — always exactly one row, with a fixed id `"singleton"` rather than a generated cuid. The admin edit page (`/dashboard/profil`) has no list or create step, just one form that always edits that one row (`upsert` by the fixed id). This is simpler than a generic multi-page `StaticPage` system (mentioned as a possibility in `docs/FEATURES.md`) and matches the actual current need — one "Tentang Kami" page, not an arbitrary number of static pages.
- **DECISION.** `description` and `vision` are plain text (rendered as-is), while `mission` and `values` are Markdown (rendered with `react-markdown`/`remark-gfm`, same safe-by-default pattern as Article/News/Event bodies) — because Misi and Nilai-Nilai are naturally lists (numbered steps, bullet points) and Markdown is the simplest way to let the admin format that without a rich-text editor.
- **DECISION.** The seeded placeholder text is the same original wording already drafted and clearly labeled as a placeholder in `docs/PROJECT-VISION.md` §2 (not copied from any external source) — the admin can now replace it for real through the dashboard instead of needing a code change.
- Verified end-to-end with a scripted browser test against live MySQL: public `/tentang` renders the seeded description/vision/mission/values → `/dashboard/profil` requires login → edit form is prefilled with the current values → saving shows a success message and updates the public page immediately (no separate publish step, since this content has no draft/published state) → whitespace-only input is rejected by server-side validation even though the client-side `required` attribute alone wouldn't catch it.

---

### 2026-07-16 — Gallery: fourth content type, album + photo sub-list

- **DECISION.** Gallery is modeled as two tables — `GalleryAlbum` (metadata: title, slug, description, optional event date, optional cover image, optional external video link, DRAFT/PUBLISHED) and `GalleryImage` (one row per photo, always belonging to exactly one album via `onDelete: Cascade`). This is a different shape from Articles/News/Event: instead of one record with one body, an album is a container for a variable-length list of photos managed separately.
- **DECISION.** `altText` is a **required** field on every `GalleryImage`, not optional like other URL/text fields elsewhere in the schema — a direct accessibility requirement (every image needs meaningful alt text for screen reader users), enforced both in the Zod schema and the database column.
- **DECISION.** No embedded video player. `videoUrl` is just an external link (e.g. to YouTube), rendered as a plain "Tonton Video" link on the album detail page — consistent with the project's existing pattern of not embedding third-party iframes (avoids extra CSP/privacy complexity for a feature that wasn't explicitly requested as an embed).
- **DECISION.** Admin workflow is two steps by design: save the album's metadata first (creating its `id`/slug), then add or delete individual photos on that album's edit page. This mirrors how the album detail data actually depends on the album already existing, and keeps each form focused (one photo at a time, with its own alt text/caption/credit) rather than one large unwieldy form.
- **DECISION.** `displayOrder` on `GalleryImage` controls photo order within an album; new photos are appended at the end (`max(displayOrder) + 1`). No drag-and-drop reordering UI yet — not required for this vertical slice; can be added later if album curation needs finer control.
- Verified end-to-end with a scripted browser test against live MySQL: seeded published album with photos visible on the public listing and detail pages → `/dashboard/galeri` requires login → create a draft album → confirm hidden from public listing → add a photo with required alt text → publish → confirm the album and its photo (with caption) now appear publicly → delete the photo via the admin edit page → confirm it's gone → confirmed a missing album slug and a missing admin album id both return real 404s.

---

### 2026-07-16 — Events (Kegiatan): third content type, different shape

- **DECISION.** Event is a structured listing (date/time, venue, registration, quota) rather than long-form content — `description` is still Markdown for flexibility, but the model is otherwise quite different from Article/News: no author/reporter attribution, no category, no tags (none of these were requested for Events in the brief).
- **DECISION.** `startAt`/`endAt` are single `DateTime` fields (date + time combined) rather than separate date/start-time/end-time fields — simpler to model and query, and naturally supports multi-day events.
- **DECISION.** No ticketing or payment (explicitly out of scope per the brief) — `registrationLink` is just an external URL (e.g. a Google Form), `participantQuota` is informational only, not enforced.
- **DECISION.** "Upcoming" vs. "past" is computed from `startAt` vs. the current time at request time, not a stored field — kept as two sections on one `/kegiatan` page rather than a tab/filter, for simplicity.
- **BUG CAUGHT AND FIXED before reaching the user:** the upcoming/past split (and the homepage's "upcoming events" section) both statically render at build time by default in Next.js, since a `new Date()` call inside a Prisma query doesn't automatically opt a route out of static generation the way `cookies()`/`headers()` do. Without a fix, an event could sit in the wrong section for a long time after its start time passed, with no database write ever happening to trigger the existing `revalidatePath` calls. Added `export const revalidate = 3600` (hourly) to both `/kegiatan` and `/` as a time-based backstop alongside the on-demand revalidation on save.
- Verified end-to-end with a scripted browser test against live MySQL: seeded upcoming/past events show correctly split on both admin and public pages → create a draft with registration link/quota/venue → confirm hidden from public pages → publish → confirm it appears in the upcoming section on the listing, homepage, and detail page with all fields (date/time, venue, organizer, quota, registration button) rendering correctly → confirmed nested dashboard routes stay protected → confirmed a missing event slug returns a real 404.

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
