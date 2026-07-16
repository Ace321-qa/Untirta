import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("URL tidak valid.")
  .optional()
  .or(z.literal(""));

export const albumFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(200, "Judul maksimal 200 karakter."),
  description: z
    .string()
    .trim()
    .max(2000, "Deskripsi maksimal 2000 karakter.")
    .optional()
    .or(z.literal("")),
  eventDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Tanggal tidak valid.",
    }),
  coverImage: optionalUrl,
  videoUrl: optionalUrl,
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type AlbumFormValues = z.infer<typeof albumFormSchema>;

export const photoFormSchema = z.object({
  url: z.string().trim().url("URL gambar wajib diisi dan valid."),
  altText: z
    .string()
    .trim()
    .min(3, "Teks alternatif minimal 3 karakter.")
    .max(300, "Teks alternatif maksimal 300 karakter."),
  caption: z
    .string()
    .trim()
    .max(300, "Keterangan maksimal 300 karakter.")
    .optional()
    .or(z.literal("")),
  photographerCredit: z
    .string()
    .trim()
    .max(200, "Kredit fotografer maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),
});

export type PhotoFormValues = z.infer<typeof photoFormSchema>;
