// Falls back to localhost in development; set NEXT_PUBLIC_SITE_URL to the
// real domain once it's registered (see docs/DECISIONS.md, Phase 10).
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
