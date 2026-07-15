# Database — AKMI Untirta Website

Status: Phase 3 (foundation) complete
Last updated: 2026-07-15

## What's in the database right now

Only the tables needed to support login exist so far. Content tables (Article,
News, Event, Gallery, etc.) are deliberately **not** created yet — they arrive
one at a time starting Phase 4, per the project's "one vertical slice at a
time" rule. See `docs/FEATURES.md` for the full future table list.

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

These three exist purely to support the login system we'll build in Phase 5
(using a library called Auth.js). You won't interact with them directly —
they track things like active login sessions and password-reset links.

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
