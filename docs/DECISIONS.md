# Decisions & Assumptions Log — AKMI Untirta Website

Every entry below is either a **DECISION** (you explicitly chose it) or an **ASSUMPTION** (I inferred it — please correct if wrong). This file grows over time; newest entries at the top.

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
