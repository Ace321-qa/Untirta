# Feature Backlog — AKMI Untirta Website

Status: Draft (Phase 0)
Last updated: 2026-07-15

This is the master list of features, grouped by whether they ship in the **MVP** (first launch) or are **Deferred** (built after the core site is stable). Each item will later become one or more database entities and pages — details will be worked out module by module (see `docs/PROGRESS.md` for phase-by-phase build order).

## 1. Confirmed site navigation (Information Architecture)

```
Beranda (Home)
Tentang Kami (About)
  ├─ Profil / Tentang Kami (org profile, vision, mission, values)
  ├─ Struktur Pengurus (Management structure)
  ├─ Hubungi Kami (Contact)
  └─ Galeri (Gallery)
Artikel (Articles)
Berita (News)
Kegiatan (Events/Activities)
Perpustakaan (Digital Library)
Layanan (Services)
Lainnya (Other)
  ├─ Jadwal (Schedule)
  └─ Laporan (Reports)
```

Notes:
- "Struktur Pengurus" appears only once, under "Tentang Kami" (confirmed — no duplicate link under "Lainnya").
- "Laporan" is assumed to mean organizational accountability reports (Laporan Pertanggungjawaban / annual reports), published as downloadable documents. **ASSUMPTION — please confirm when we build this module.**
- Admin dashboard (`/dashboard/...`) is a separate area, not part of this public menu, and is not shown here.

## 2. MVP (first launch) — build order

Built one complete module at a time (vertical slices), roughly in this order:

| # | Module | Public pages | Admin management | Key entities |
|---|---|---|---|---|
| 1 | Foundation | — | — | Project setup, design system, layout shell |
| 2 | Database + Auth | Login | Users, Roles | User, Account, Session, Role |
| 3 | **Articles** (first full vertical slice) | List, detail, search, categories/tags | Create/edit/publish/schedule | Article, ArticleCategory, ArticleTag |
| 4 | About / Static content | Profil, Visi-Misi | Edit static page content | StaticPage |
| 5 | Management Structure | Struktur Pengurus (by period) | Manage periods, divisions, officers | ManagementPeriod, Division, Officer |
| 6 | News | List, detail | Same as Articles, plus reporter/location fields | News, NewsCategory |
| 7 | Events/Kegiatan | Upcoming/past list, detail | Create/edit, registration link, quota | Event |
| 8 | Gallery | Albums, photo lightbox | Manage albums/photos | GalleryAlbum, GalleryImage |
| 9 | **Perpustakaan (Digital Library)** — see §3 below | Book list, book detail, "Baca Buku" reader page | Create/edit book entries, upload PDF or set reader link | Book (new entity) |
| 10 | Services / Layanan | Services directory | Manage services list | Service |
| 11 | Schedule / Jadwal | Calendar (month/list view) | Manage schedule items | ScheduleItem |
| 12 | Reports / Laporan | Downloadable reports list | Upload/manage reports | Report (new entity, simple) |
| 13 | Contact form | Form + success/error states | View submitted messages | ContactMessage |
| 14 | Newsletter signup | Subscribe box (footer/home) | View subscriber list | NewsletterSubscriber |
| 15 | Site settings & homepage sections | — | Manage homepage blocks, nav, social links | SiteSetting, NavigationItem |
| 16 | Search | Global search bar | — | (uses existing tables) |
| 17 | SEO/production hardening | sitemap.xml, robots.txt, metadata | — | — |
| 18 | Hostinger deployment | Live site | — | — |

## 3. Perpustakaan (Digital Library) — scoped for MVP

Confirmed pattern (functionality only, original implementation):
1. **List page** (`/perpustakaan`) — grid/list of books with cover image, title, author, category.
2. **Detail page** (`/perpustakaan/buku/[slug]`) — book description, author, category, cover, a "Baca Buku" (Read Book) button.
3. **Reader page** (`/perpustakaan/buku/[slug]/baca`) — embeds a flipbook-style or PDF reader.

Implementation approach (to be finalized in Phase 6, not now): we will **not** use the reference site's exact vendor or design. Options to evaluate then: (a) self-hosted PDF viewer (e.g., PDF.js) reading a securely-stored PDF file, or (b) an embeddable third-party flipbook service chosen independently. Either way, the `Book` entity stores title, author, cover image, category, description, a source file or embed reference, publish status, and display order.

## 4. Deferred (post-MVP)

- URL shortener service
- Donation/crowdfunding payment processing
- Program evaluation calculator
- Member self-registration + attendance tracking
- Complex notifications (push/in-app)
- Mobile application
- Advanced analytics
- Full English translation (architecture will keep this possible, not built now)
- Single sign-on
- Elasticsearch-style search (MySQL search is sufficient for MVP scale)
- Redis/queues/microservices (not needed at this scale)
- CSV export for newsletter subscribers (basic list view ships first)

## 5. Roles required at launch vs. later

- **Launch:** Super Admin only (you), with the full role system already modeled in the database so more roles/accounts can be turned on without schema changes.
- **Soon after:** an Admin or Editor-level account for a "Humas" (public relations) teammate, per your answer that dashboard access should eventually cover admin/PR duties.

## 6. Out of scope entirely for now

- Anything requiring real-money payment processing.
- Anything requiring bulk/marketing email sending (newsletter *storage* ships in MVP; actual bulk sending is deferred until you choose a provider and consent flow, per the original brief).
