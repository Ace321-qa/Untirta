# Project Charter — AKMI Untirta Website

Status: Draft (Phase 0)
Last updated: 2026-07-15

## 1. Who this project is for

**Organization:** AKMI Untirta — _Aktivitas Keagamaan Mahasiswa Islam Universitas Sultan Ageng Tirtayasa_ (an Islamic student activity unit / UKM at Universitas Sultan Ageng Tirtayasa, understood to be an evolution of the earlier LDK Baabussalam).

**University:** Universitas Sultan Ageng Tirtayasa (Untirta), Banten.

**Brand name used across the site:** AKMI Untirta.

> ASSUMPTION (please correct if wrong): This project was originally briefed under the working title "LDK Untirta." Based on your answers, the real, current organization name is **AKMI Untirta**. All navigation, page titles, and documentation from this point forward use **AKMI Untirta**, not "LDK Untirta."

## 2. Organizational profile (placeholder — please edit later)

We could not retrieve exact official wording from akmi-untirta.com (the site blocked automated fetching) or from Instagram. The text below is an **original, clearly-labeled placeholder** you can replace from the admin dashboard once Articles/Static Pages exist. It is not copied from any source.

- **Deskripsi singkat (placeholder):** "AKMI Untirta adalah unit kegiatan mahasiswa yang mewadahi aktivitas keagamaan Islam di lingkungan Universitas Sultan Ageng Tirtayasa, dengan fokus pada dakwah kampus, pembinaan mahasiswa Muslim, dan pengembangan potensi diri berlandaskan nilai-nilai Islam."
- **Visi (placeholder):** "Menjadi wadah keislaman mahasiswa yang unggul dalam dakwah, keilmuan, dan pelayanan umat di lingkungan kampus Untirta."
- **Misi (placeholder):**
  1. Menyelenggarakan kegiatan dakwah dan kajian keislaman yang mudah diakses seluruh mahasiswa.
  2. Membina kader dakwah kampus yang militan, berakhlak, dan berdaya guna.
  3. Membangun sinergi dengan lembaga kemahasiswaan dan masyarakat kampus lainnya.
- **Nilai-nilai (placeholder):** Ukhuwah (persaudaraan), Amanah, Militansi dakwah, Profesionalisme, Pelayanan.

_(Action item for you: replace this section's wording once the site can manage Static Pages — Phase 6.)_

## 3. Public contact information (safe to publish)

- Email: `humedakmi2026@gmail.com`
- Social: Instagram, TikTok, YouTube (exact handles/URLs to be confirmed and added to Site Settings when we build that feature)
- Phone/WhatsApp, physical address: not yet provided — placeholder only, do not display a real number until confirmed.

## 4. Privacy default (recommended, please confirm)

You told us "all info is public" for the member-only-data question. To keep this safe by default, we recommend this interpretation:

- **Public:** organizational profile, vision/mission, officer _names, positions, photos, and short bios_ (values the org already displays elsewhere, e.g. leadership announcements), published articles/news/events/gallery.
- **Not public by default, even under a "public org" policy:** any individual officer's _personal_ phone number, personal email, home address, or student ID number. These fields will exist in the database (useful for internal admin coordination) but will not render on public pages unless a field is explicitly marked public per-person in the dashboard.

This is a **default we recommend**, not a hard rule — you can override it later per person/per field once the Management Structure module exists (Phase 6).

## 5. Visual identity direction

- **Primary color:** Emerald green (an original palette will be designed around this — not copied from the reference site's colors).
- **Tone:** Youthful but rich/premium — not childish, not overly corporate.
- **Logo:** You have an existing logo file (shared 2026-07-15): a shield/badge shape, gradient green background, white crescent moon with a small Arabic calligraphic mark, "AKMI UNTIRTA" in white serif type. The actual image file still needs to be copied into the project — this will happen at the design-system step (Phase 2), where you'll drag the file into the project folder in VS Code.
- **Style references:** Functional structure inspired by ldksyah.id (features/IA only, per the IP rule) — no other visual references given.

## 6. Governance and roles at launch

- Managed solo by you initially.
- One administrator account at launch (you), using the **Super Admin** role.
- Articles require editor approval before publishing (editorial workflow: Draft → In Review → Scheduled → Published).
- The role system (Super Admin, Admin, Editor, Author, Event Manager, Gallery Manager, Member) will be built into the database and dashboard from the start, even though only one account exists at launch — this avoids re-architecting later when you add a "Humas" (public relations) teammate.

## 7. Confirmed technical environment

- OS: Windows, with VS Code installed.
- Node.js, Git installed locally; GitHub account confirmed; this repo (`ace321-qa/untirta`) is already connected.
- Claude Code is installed locally on Windows in addition to this web session.
- Hosting: Hostinger **Business plan, 50GB**, with **Node.js Web App** support confirmed available.
- Domain: not purchased yet — can be bought and managed via Hostinger later; development will proceed on `localhost` in the meantime.
- Database: no MySQL database created yet on Hostinger — we will use a local/dev MySQL during development and create the production database in Phase 10.

## 8. Media and email decisions (recommended, please confirm)

- **Photos:** ~100/year is modest. Recommendation: store uploaded files in a persistent directory on Hostinger (outside the app's build/runtime temp folders), behind a media abstraction layer, so we can switch to S3/Cloudinary later without rewriting features. No paid image storage needed for MVP.
- **Email sending:** Use Gmail SMTP (via the `humedakmi2026@gmail.com` account, with an "App Password," not the real Gmail password) through a mail-sending library (Nodemailer), for: contact-form notifications and password-reset/verification emails. Free tier limits (~500 emails/day) are far above our expected volume. This will be wrapped in a small internal module so switching providers later (e.g., a dedicated transactional email service via Hostinger) requires no feature rewrites.

## 9. What "done" looks like for Phase 0

- [x] Organization identity clarified (AKMI Untirta)
- [x] Contact/social/branding baseline captured
- [x] MVP vs. later feature split agreed (see `docs/FEATURES.md`)
- [x] Technical/hosting environment confirmed
- [ ] You review this document and flag anything wrong or missing
- [ ] Move to Phase 1: create the actual Next.js project on your machine
