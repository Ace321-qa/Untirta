# Database — AKMI Untirta Website

Status: all original content modules complete (Articles, News, Events,
Gallery, Profile, Management Structure, Perpustakaan, Layanan, Jadwal,
Laporan) + Contact form
Last updated: 2026-07-20

## What's in the database right now

Login/account tables, Articles, News, Events, Gallery, the site Profile
(About page content), Management Structure (Struktur Pengurus),
Perpustakaan (digital library), Layanan (services directory), Jadwal
(recurring weekly schedule), Laporan (downloadable reports), and
ContactMessage (contact form submissions). This covers every module in the
original navigation, plus the contact form. See `docs/FEATURES.md` for
what's still ahead (newsletter, search, SEO, security hardening,
deployment).

## Tables (plain-language)

### `users`

One row per person who can log in — you today, and later staff/members you
create accounts for (self-registration is disabled by design).

| Field                     | Purpose                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `id`                      | Unique internal identifier, generated automatically.                                                           |
| `name`                    | Full name, required.                                                                                           |
| `email`                   | Login email, must be unique — no two accounts can share one.                                                   |
| `emailVerified`           | When the email was confirmed (used by the login system).                                                       |
| `passwordHash`            | A securely hashed version of the password — the real password is never stored anywhere.                        |
| `image`                   | Optional profile photo URL.                                                                                    |
| `role`                    | One fixed choice: `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `AUTHOR`, `EVENT_MANAGER`, `GALLERY_MANAGER`, or `MEMBER`. |
| `status`                  | `ACTIVE` or `SUSPENDED` — lets an admin disable an account without deleting it.                                |
| `createdAt` / `updatedAt` | Automatic timestamps.                                                                                          |

**Privacy note:** name and email are personal data. They're only ever shown
in the admin dashboard, never on public pages.

### `accounts`, `sessions`, `verification_tokens`

These three exist purely to support the login system (Auth.js). You won't
interact with them directly — they track things like active login sessions
and password-reset links.

### `site_profile`

A **singleton** table — always exactly one row, with a fixed id
(`"singleton"`) instead of a generated one. Powers the public "Tentang
Kami" (About) page:

| Field         | Purpose                                                            |
| ------------- | ------------------------------------------------------------------ |
| `description` | Short plain-text summary of the organization.                      |
| `vision`      | Plain-text vision statement.                                       |
| `mission`     | Mission statement, written in **Markdown** (e.g. a numbered list). |
| `values`      | Core values, written in **Markdown** (e.g. a bullet list).         |

Unlike Articles/News/Events/Gallery, this content has no draft/published
state — whatever is saved here is immediately live on the public page,
since there's only ever one "About" page, not a list of items to review
before publishing.

### `articles`

One row per article, in either state:

| Field           | Purpose                                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`         | Article title.                                                                                                                                                                           |
| `slug`          | The URL-friendly identifier (e.g. `/artikel/judul-artikel`). Generated once at creation and never changes, even if the title is edited later — this protects shared links from breaking. |
| `excerpt`       | Optional short summary shown in listing cards.                                                                                                                                           |
| `body`          | The article content, written in **Markdown** (not a WYSIWYG editor — see docs/DECISIONS.md for why).                                                                                     |
| `featuredImage` | Optional image URL (not a file upload yet — see docs/DECISIONS.md).                                                                                                                      |
| `status`        | `DRAFT` (not publicly visible) or `PUBLISHED`.                                                                                                                                           |
| `publishedAt`   | Set automatically the first time an article is published; stays fixed after that.                                                                                                        |
| `authorId`      | Which user wrote it.                                                                                                                                                                     |
| `categoryId`    | Optional single category (Kajian Islam, Kegiatan, Pengumuman — pre-seeded).                                                                                                              |
| `tags`          | Zero or more freeform tags (many-to-many), created automatically as you type them.                                                                                                       |

### `article_categories`, `article_tags`

Simple lookup tables for organizing articles. Categories are pre-seeded (no
admin UI to manage them yet); tags are created on the fly when an admin types
a new tag name while saving an article.

### `news`

Same shape as `articles` (title, slug, excerpt, Markdown body, featured
image, status, publishedAt), plus fields specific to News:

| Field               | Purpose                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `reporterId`        | Who reported the news (required, defaults to whoever creates it).     |
| `editorId`          | Who edited it, if anyone (optional).                                  |
| `eventDate`         | When the reported event happened, if relevant (optional).             |
| `location`          | Where the event happened, if relevant (optional).                     |
| `sourceAttribution` | Credit for an external source, if the news references one (optional). |

No tags for News — only a single optional category.

### `news_categories`

Simple lookup table, pre-seeded (Kampus, Organisasi), same pattern as
`article_categories`.

### `events`

A structured listing rather than long-form content — no author, no
category, no tags (none requested for Events in the original brief).

| Field                  | Purpose                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `title`, `slug`        | Same pattern as Articles/News — slug stable after creation.                          |
| `description`          | Markdown, rendered safely.                                                           |
| `startAt` / `endAt`    | Combined date+time fields (not separate date/time columns). `endAt` is optional.     |
| `venue`, `mapsUrl`     | Where it's happening, plus an optional Google Maps link.                             |
| `organizer`            | Free text (e.g. "Divisi Kaderisasi") — not linked to a Division table yet.           |
| `registrationLink`     | External URL (e.g. a Google Form) — **no built-in ticketing or payment**, per scope. |
| `registrationDeadline` | Optional; the public detail page disables the registration button after this time.   |
| `participantQuota`     | Informational only, not enforced against actual signups.                             |
| `documentUrl`          | Optional downloadable document (URL only, same pattern as featured images).          |

**Note:** "upcoming" vs. "past" isn't a stored field — it's computed by
comparing `startAt` to the current time whenever the page is rendered.

### `management_periods`, `divisions`, `officers`

Powers the "Struktur Pengurus" (Management Structure) public page — a
three-level hierarchy so past leadership stays on record instead of being
overwritten each year:

| Table                | Field                   | Purpose                                                                  |
| -------------------- | ----------------------- | ------------------------------------------------------------------------ |
| `management_periods` | `label`                 | e.g. "2025/2026".                                                        |
| `management_periods` | `startYear` / `endYear` | Used for sorting periods newest-first.                                   |
| `management_periods` | `isActive`              | Only one period is active at a time; the public page defaults to it.     |
| `divisions`          | `periodId`              | Which period this division belongs to.                                   |
| `divisions`          | `name`                  | e.g. "Pengurus Inti", "Divisi Kaderisasi" — free text, not a fixed list. |
| `officers`           | `divisionId`            | Which division this person belongs to.                                   |
| `officers`           | `name`, `position`      | e.g. "Ahmad Fauzan", "Ketua Umum".                                       |
| `officers`           | `photo`                 | Optional image URL (not a file upload yet — see docs/DECISIONS.md).      |

Deleting a period deletes its divisions, and deleting a division deletes
its officers (cascade) — there's no orphaned data to clean up manually.
The public page (`/tentang/struktur`) shows the active period by default,
with a period-switcher (`?periode=<id>`) to browse past ones once more than
one exists.

### `book_categories`, `books`

Powers the "Perpustakaan" (digital library) public pages:

| Field           | Purpose                                                                           |
| --------------- | --------------------------------------------------------------------------------- |
| `title`, `slug` | Same pattern as other content — slug stable after creation.                       |
| `author`        | Free text — not linked to a separate Author table.                                |
| `description`   | Plain text summary shown on the book's detail page.                               |
| `coverImage`    | Optional image URL (not a file upload yet — see docs/DECISIONS.md).               |
| `fileUrl`       | Optional PDF URL. Without one, the "Baca Buku" (Read Book) button doesn't appear. |
| `status`        | `DRAFT` (not publicly visible) or `PUBLISHED`. No separate `publishedAt` field.   |
| `categoryId`    | Optional single category (Aqidah, Fiqih, Sirah Nabawiyah — pre-seeded).           |

The reader page (`/perpustakaan/buku/[slug]/baca`) shows the PDF using the
browser's own built-in PDF viewer, not a paid third-party flipbook service —
see docs/DECISIONS.md for why.

### `contact_messages`

Submissions from the public "Hubungi Kami" contact form:

| Field       | Purpose                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| `name`      | Sender's name.                                                                                              |
| `email`     | Sender's email — used as the reply-to address on the notification email.                                    |
| `subject`   | Optional subject line.                                                                                      |
| `message`   | The message body.                                                                                           |
| `isRead`    | Whether an admin has viewed it yet — drives the "Belum dibaca"/"Sudah dibaca" badge in the dashboard inbox. |
| `createdAt` | When it was submitted.                                                                                      |

**Privacy note:** name, email, and message content are personal data —
only ever shown in the admin dashboard, never on public pages. No seed
data exists for this table; every row is a real submission.

This table is always written first when someone submits the form — a
notification email is attempted afterward, but its success or failure
doesn't affect whether the message is saved. See docs/DECISIONS.md.

### `services`

Powers the "Layanan" directory page and the homepage's "Layanan" section —
the simplest content table in the project:

| Field          | Purpose                                                             |
| -------------- | ------------------------------------------------------------------- |
| `name`         | Service name.                                                       |
| `description`  | Plain text description.                                             |
| `link`         | Optional external or internal URL (e.g. a WhatsApp number or form). |
| `status`       | `DRAFT` (not publicly visible) or `PUBLISHED`.                      |
| `displayOrder` | Controls listing order; new services are appended at the end.       |

Unlike other content types, there's no slug and no individual detail
page — services only ever appear as cards in a directory listing.

### `schedule_items`

Powers the "Jadwal" page — a **recurring weekly** schedule (e.g. a kajian
timetable), distinct from `events` which covers one-off activities with
their own specific date:

| Field                   | Purpose                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `title`                 | Name of the recurring activity (e.g. "Kajian Tafsir").                                                                               |
| `dayOfWeek`             | One fixed choice: `SENIN` through `MINGGU`.                                                                                          |
| `startTime` / `endTime` | Plain `"HH:MM"` text (not a date/time column) — always the same time every week, not tied to a specific date. `endTime` is optional. |
| `location`              | Optional location text.                                                                                                              |
| `description`           | Optional extra detail.                                                                                                               |
| `status`                | `DRAFT` (not publicly visible) or `PUBLISHED`.                                                                                       |
| `displayOrder`          | Controls ordering within a day; new items are appended at the end.                                                                   |

The public page groups items by day (Senin → Minggu) as a list, not a
month calendar grid — see docs/DECISIONS.md.

### `reports`

Powers the "Laporan" page — organizational accountability reports
(Laporan Pertanggungjawaban / annual reports) as a simple downloadable
list:

| Field         | Purpose                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| `title`       | Report title (e.g. "Laporan Pertanggungjawaban Tahunan 2025").            |
| `description` | Optional short description.                                               |
| `year`        | Used to sort the public list newest-first.                                |
| `fileUrl`     | Optional PDF URL. Without one, the "Unduh Laporan" button doesn't appear. |
| `status`      | `DRAFT` (not publicly visible) or `PUBLISHED`.                            |

No individual detail page — same directory-listing pattern as `services`.

### `gallery_albums`

A container for a set of photos, plus its own metadata:

| Field           | Purpose                                                                            |
| --------------- | ---------------------------------------------------------------------------------- |
| `title`, `slug` | Same pattern as other content — slug stable after creation.                        |
| `description`   | Optional plain text summary of the album.                                          |
| `eventDate`     | Optional date the photos are from (date only, no time).                            |
| `coverImage`    | Optional image URL shown on listing cards.                                         |
| `videoUrl`      | Optional external video link (e.g. YouTube) — shown as a plain link, not embedded. |
| `status`        | `DRAFT` (not publicly visible) or `PUBLISHED`.                                     |

### `gallery_images`

One row per photo, always belonging to exactly one album (deleting an album
deletes its photos too):

| Field                | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `albumId`            | Which album this photo belongs to.                                            |
| `url`                | The image URL (not a file upload yet — see docs/DECISIONS.md).                |
| `altText`            | **Required** — every photo needs meaningful alt text for screen reader users. |
| `caption`            | Optional short caption shown under the photo.                                 |
| `photographerCredit` | Optional credit line (e.g. "Foto: Divisi Humas").                             |
| `displayOrder`       | Controls photo order within the album; new photos are appended at the end.    |

## A simplification we made on purpose

The original plan listed a full "Roles and Permissions" system as a
possibility (separate `Role`, `Permission`, `UserRole`, `RolePermission`
tables). We're **not** building that yet — `role` is just a fixed field on
`users` for now. With only one or two accounts at launch, that's simpler and
just as capable. If the organization later needs fine-grained, customizable
permissions per role, we can migrate to full Role/Permission tables without
losing any existing data.

## How to inspect the data yourself

Run this in your project folder:

```
npm run db:studio
```

This opens **Prisma Studio**, a visual, spreadsheet-like tool in your browser
at `http://localhost:5555` where you can browse and edit rows directly — no
SQL required. This replaces MySQL Workbench, which we skipped during MySQL
installation.

## Useful commands

| Command              | What it does                                                   |
| -------------------- | -------------------------------------------------------------- |
| `npm run db:migrate` | Create/apply a migration after changing `prisma/schema.prisma` |
| `npm run db:seed`    | Re-run the sample data script (`prisma/seed.ts`)               |
| `npm run db:studio`  | Open the visual data browser                                   |

## Sample login (development only)

The seed script creates one sample admin account:

- Email: `admin@akmiuntirta.test`
- Password: `ChangeMe123!`

This is a placeholder for local development only — never used in production,
and clearly not a secret worth protecting (it's committed in
`prisma/seed.ts`, on purpose, since it's fake).

## Technical notes (for future reference)

- **Prisma 7 changed its architecture.** Connection configuration for CLI
  commands (migrate, studio, db pull) lives in `prisma.config.ts`, not
  inline in `schema.prisma`. Application code must construct `PrismaClient`
  with an explicit **driver adapter** (`@prisma/adapter-mariadb`, which
  supports both MySQL and MariaDB) — seen in `src/lib/prisma.ts`. This is a
  real breaking change from older Prisma versions; don't be surprised if
  older tutorials look different.
- The generated Prisma Client now outputs to `src/generated/prisma` (plain
  `.ts` source, not a prebuilt package) and is gitignored — it's regenerated
  automatically after `npm install` via a `postinstall` script, and manually
  via `npx prisma generate`.
