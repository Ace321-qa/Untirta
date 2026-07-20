// In-memory only — fine for a single Node.js process (this app's deployment
// target, see docs/DECISIONS.md), not a multi-instance/serverless setup.
// Resets on server restart, which is an acceptable trade-off for blocking
// naive brute-force login attempts without adding Redis at this scale.
const attempts = new Map<string, { count: number; firstAttempt: number }>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;

  if (Date.now() - entry.firstAttempt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const entry = attempts.get(key);

  if (!entry || Date.now() - entry.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: Date.now() });
    return;
  }

  entry.count += 1;
}

export function resetAttempts(key: string): void {
  attempts.delete(key);
}
