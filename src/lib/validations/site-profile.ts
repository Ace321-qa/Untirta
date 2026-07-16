import { z } from "zod";

export const siteProfileFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter.")
    .max(1000, "Deskripsi maksimal 1000 karakter."),
  vision: z
    .string()
    .trim()
    .min(10, "Visi minimal 10 karakter.")
    .max(1000, "Visi maksimal 1000 karakter."),
  mission: z.string().trim().min(10, "Misi minimal 10 karakter."),
  values: z.string().trim().min(10, "Nilai-nilai minimal 10 karakter."),
});

export type SiteProfileFormValues = z.infer<typeof siteProfileFormSchema>;
