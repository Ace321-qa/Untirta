import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama layanan minimal 3 karakter.")
    .max(150, "Nama layanan maksimal 150 karakter."),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter."),
  link: z.string().trim().url("URL tidak valid.").optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
