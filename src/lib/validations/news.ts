import { z } from "zod";

export const newsFormSchema = z.object({
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
  body: z.string().trim().min(10, "Isi berita minimal 10 karakter."),
  featuredImage: z
    .string()
    .trim()
    .url("URL gambar tidak valid.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  categoryId: z.string().trim().optional().or(z.literal("")),
  editorId: z.string().trim().optional().or(z.literal("")),
  eventDate: z.string().trim().optional().or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(200, "Lokasi maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),
  sourceAttribution: z
    .string()
    .trim()
    .max(300, "Sumber maksimal 300 karakter.")
    .optional()
    .or(z.literal("")),
});

export type NewsFormValues = z.infer<typeof newsFormSchema>;
