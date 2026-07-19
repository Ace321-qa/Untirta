import { z } from "zod";

export const reportFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(200, "Judul maksimal 200 karakter."),
  description: z
    .string()
    .trim()
    .max(1000, "Deskripsi maksimal 1000 karakter.")
    .optional()
    .or(z.literal("")),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Tahun harus 4 digit angka."),
  fileUrl: z
    .string()
    .trim()
    .url("URL tidak valid.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
