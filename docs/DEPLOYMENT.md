# Deployment Guide — AKMI Untirta Website (Hostinger)

Status: Not yet deployed — this guide gets you from "working on localhost"
to "live on the internet."
Last updated: 2026-07-20

This guide assumes you have (or are about to get) a **Hostinger Business
plan** with **Node.js Web App** support, per the original plan in
`docs/PROJECT-VISION.md`. Steps that only you can do (because they need
your Hostinger login) are marked **[YOU DO THIS]**.

---

## 0. Before you start — do this first

**[YOU DO THIS]** Log into your Hostinger hPanel and check what Node.js
versions are offered for a Node.js Web App (usually under
"Advanced" → "Node.js"). This site needs **Node.js 20.9 or newer**
(confirmed from Next.js's own `package.json`). If Hostinger's dropdown
doesn't offer at least 20.9, tell me before going further — there are
workarounds, but they'd change this guide.

---

## 1. Buy/connect a domain

**[YOU DO THIS]** If you don't already have a domain, buy one through
Hostinger (or connect one you already own by pointing its nameservers at
Hostinger). Any domain works — this guide doesn't assume a specific one.

Once you have it, tell me the domain name — I'll need it to set
`NEXT_PUBLIC_SITE_URL` correctly in a later step.

---

## 2. Create the production MySQL database

**[YOU DO THIS]** In hPanel, go to **Databases → MySQL Databases** and
create a new database (e.g. `u123456789_akmiuntirta` — Hostinger prefixes
database names with your account ID). Create a database user with a
strong password and grant it full access to that database. **Save the
database name, username, and password somewhere safe** — you'll need them
in step 5.

This is a completely separate database from the one on your Windows PC —
your local `akmi_untirta_dev` data (sample/test content) does **not**
carry over. That's intentional: production should start clean, not with
placeholder test content.

---

## 3. Create the Node.js Web App

**[YOU DO THIS]** In hPanel, go to **Advanced → Node.js** and create a new
application:

- **Node.js version:** 20.9 or newer (whatever you confirmed in step 0)
- **Application root:** a folder for the project, e.g. `akmi-untirta`
- **Application URL:** your domain from step 1
- **Application startup file:** leave as default for now — Hostinger's
  Node.js Web App typically wants a startup file, but for Next.js the
  actual start command is `npm start`, not a single JS file. If Hostinger's
  panel forces you to name a file, use `node_modules/.bin/next` with
  arguments `start` — but check Hostinger's own Next.js-specific
  documentation first, since exact panel fields vary by hosting version.

Hostinger's panel will show you a command to SSH into the app's
environment (something like `source /home/username/nodevenv/.../bin/activate`)
— you'll use that shell for the remaining steps.

---

## 4. Get the code onto the server

**[YOU DO THIS, then tell me if you'd like help]** Two options:

**Option A — Git (recommended if Hostinger's plan supports SSH + git):**

```bash
git clone https://github.com/Ace321-qa/Untirta.git .
git checkout main
```

(Use whichever branch has your final, merged code — ask me if you're not
sure which branch is current.)

**Option B — Upload manually** via hPanel's File Manager or FTP if git
isn't available in your plan. Slower and more error-prone for a project
this size (nested `src/`, `prisma/`, etc.) — Option A is strongly
preferred if it's available.

---

## 5. Create the production `.env` file

In the app's root folder on the server, create a file named exactly `.env`
(copy the structure from `.env.example` in the repo) with your **real**
production values:

```env
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME"
AUTH_SECRET="<generate a new one — see below, don't reuse your local one>"
AUTH_TRUST_HOST="true"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="humedakmi2026@gmail.com"
SMTP_PASSWORD="<the Gmail App Password>"
CONTACT_TO_EMAIL="humedakmi2026@gmail.com"
```

Generate a fresh `AUTH_SECRET` (don't reuse your local dev one) by running,
in the server's shell:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Why `AUTH_TRUST_HOST="true"` matters:** Auth.js (the login system) only
auto-trusts the server's address on Vercel or Cloudflare Pages. On any
other host — Hostinger included — logging in will fail with an
"UntrustedHost" error unless this is explicitly set. This was discovered
and fixed as part of Phase 9's security review; without it, login simply
won't work in production.

`DATABASE_URL` uses `localhost` because Hostinger's MySQL databases live
on the same server as your Node.js app (not a separate remote host).

---

## 6. Install, generate, migrate, build

In the server's shell, inside the app's root folder:

```bash
npm install
npx prisma generate
npm run db:migrate:deploy
npm run build
```

`db:migrate:deploy` runs `prisma migrate deploy` — the **production**
migration command. It's different from the `db:migrate` you use locally
(`prisma migrate dev`), which is interactive and meant only for
development. `deploy` just applies the already-committed migration files
in order, with no prompts — exactly what a live server needs.

---

## 7. Create your real admin account (not the dev one)

**Do not reuse the seeded dev admin account or its password.** The seed
script (`prisma/seed.ts`) creates an account with the email
`admin@akmiuntirta.test` and the password `ChangeMe123!` — both are
sitting in plain text in this project's public GitHub repository. If you
seed production with that as-is, anyone who reads the repo could log into
your live dashboard.

**Recommended:** tell me your real name, real email address, and I'll
prepare a small one-off script to create your actual admin account
directly with a strong, unique password (never reused from anywhere
else) — then we delete the script. This avoids ever creating the
insecure default account on production at all.

Do **not** run `npm run db:seed` on production as-is — besides the
insecure admin account, it also fills the site with placeholder sample
content (a test article, test news item, test event, etc.) that isn't
real content for your organization.

---

## 8. Start the app

**[YOU DO THIS]** Back in hPanel's Node.js section, click "Restart" (or
"Start") for the application. Hostinger keeps it running in the
background after that (similar to how `pm2` or `systemd` would manage a
Node process elsewhere).

Visit your domain. You should see the homepage.

---

## 9. Post-launch checklist

- [ ] HTTPS/SSL is active on your domain (Hostinger usually provisions a
      free SSL certificate automatically — check under **Security → SSL**
      in hPanel if `https://` doesn't work immediately).
- [ ] Log in with your real admin account (step 7) and confirm the
      dashboard works.
- [ ] Edit the site profile, add your real management structure, services,
      etc. — the production database starts empty of content (per step 2).
- [ ] Submit a real contact form message and confirm it both appears in
      `/dashboard/pesan` and sends a notification email (tests the real
      Gmail SMTP credentials, not the dev "skip silently" fallback).
- [ ] Submit `https://yourdomain.com/sitemap.xml` to
      [Google Search Console](https://search.google.com/search-console)
      so Google starts indexing the site (this is the step that actually
      makes the site findable via Google search — being live isn't enough
      on its own; see the "why doesn't it show up on Google" conversation
      from earlier in this project).
- [ ] Double-check `.env` is not web-accessible (visiting
      `https://yourdomain.com/.env` should not return its contents) — this
      should be true by default with Next.js/Node.js hosting, but worth a
      quick check.

---

## Troubleshooting

**"UntrustedHost" error when logging in** — `AUTH_TRUST_HOST` is missing
or not `"true"` in the server's `.env` file. Fix it and restart the app.

**Database connection refused** — double check `DATABASE_URL` in `.env`
matches the exact database name/username/password from step 2, and that
you used `localhost` (not an external hostname).

**Site loads but images/uploaded files are missing** — this project
currently stores file/image URLs as plain external links (no upload
pipeline yet, see `docs/DECISIONS.md`), so this would mean a content
field wasn't filled in, not a deployment problem.

**Changes to `.env` don't seem to take effect** — restart the Node.js app
from hPanel; environment variables are only read when the process starts.
