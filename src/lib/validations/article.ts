import { z } from "zod";

export const articleFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(200, "Judul maksimal 200 karakter."),
  excerpt: z
    .string()
    .trim()
    .max(500, "Ringkasan maksimal 500 karakter.")
    .optional()
    .or(z.literal("")),
  body: z.string().trim().min(10, "Isi artikel minimal 10 karakter."),
  featuredImage: z
    .string()
    .trim()
    .url("URL gambar tidak valid.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  categoryId: z.string().trim().optional().or(z.literal("")),
  tags: z.string().trim().optional().or(z.literal("")),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export function parseTagNames(tagsInput: string | undefined): string[] {
  if (!tagsInput) return [];
  return Array.from(
    new Set(
      tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}
