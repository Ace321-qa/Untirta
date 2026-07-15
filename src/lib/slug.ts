export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generates a unique slug by appending -2, -3, etc. if needed.
 * `exists` should return true if the given slug is already taken
 * (excluding the record currently being edited, if any).
 */
export async function generateUniqueSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(title) || "artikel";
  let candidate = base;
  let suffix = 2;

  while (await exists(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
