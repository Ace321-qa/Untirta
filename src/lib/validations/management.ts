import { z } from "zod";

export const periodFormSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Label periode minimal 2 karakter.")
    .max(50, "Label periode maksimal 50 karakter."),
  startYear: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Tahun mulai harus 4 digit angka."),
  endYear: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Tahun selesai harus 4 digit angka."),
  isActive: z.enum(["true", "false"]),
});

export type PeriodFormValues = z.infer<typeof periodFormSchema>;

export const divisionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama divisi minimal 2 karakter.")
    .max(100, "Nama divisi maksimal 100 karakter."),
});

export type DivisionFormValues = z.infer<typeof divisionFormSchema>;

export const officerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(150, "Nama maksimal 150 karakter."),
  position: z
    .string()
    .trim()
    .min(2, "Jabatan minimal 2 karakter.")
    .max(100, "Jabatan maksimal 100 karakter."),
  photo: z
    .string()
    .trim()
    .url("URL foto tidak valid.")
    .optional()
    .or(z.literal("")),
});

export type OfficerFormValues = z.infer<typeof officerFormSchema>;
