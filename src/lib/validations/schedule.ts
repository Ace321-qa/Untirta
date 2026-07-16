import { z } from "zod";

export const dayOfWeekValues = [
  "SENIN",
  "SELASA",
  "RABU",
  "KAMIS",
  "JUMAT",
  "SABTU",
  "MINGGU",
] as const;

export const dayOfWeekLabels: Record<(typeof dayOfWeekValues)[number], string> =
  {
    SENIN: "Senin",
    SELASA: "Selasa",
    RABU: "Rabu",
    KAMIS: "Kamis",
    JUMAT: "Jumat",
    SABTU: "Sabtu",
    MINGGU: "Minggu",
  };

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const scheduleItemFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(150, "Judul maksimal 150 karakter."),
  dayOfWeek: z.enum(dayOfWeekValues),
  startTime: z
    .string()
    .trim()
    .regex(timePattern, "Waktu mulai harus berformat JJ:MM."),
  endTime: z
    .string()
    .trim()
    .regex(timePattern, "Waktu selesai harus berformat JJ:MM.")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(200, "Lokasi maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(1000, "Deskripsi maksimal 1000 karakter.")
    .optional()
    .or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type ScheduleItemFormValues = z.infer<typeof scheduleItemFormSchema>;
