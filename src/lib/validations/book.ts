import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("URL tidak valid.")
  .optional()
  .or(z.literal(""));

export const bookFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(200, "Judul maksimal 200 karakter."),
  author: z
    .string()
    .trim()
    .min(3, "Penulis minimal 3 karakter.")
    .max(150, "Penulis maksimal 150 karakter."),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter."),
  coverImage: optionalUrl,
  fileUrl: optionalUrl,
  categoryId: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
