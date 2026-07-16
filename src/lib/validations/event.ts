import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("URL tidak valid.")
  .optional()
  .or(z.literal(""));
const optionalDateTime = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
    message: "Tanggal/waktu tidak valid.",
  });

export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(200, "Judul maksimal 200 karakter."),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter."),
  featuredImage: optionalUrl,
  status: z.enum(["DRAFT", "PUBLISHED"]),
  startAt: z
    .string()
    .trim()
    .min(1, "Tanggal & waktu mulai wajib diisi.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Tanggal & waktu mulai tidak valid.",
    }),
  endAt: optionalDateTime,
  venue: z
    .string()
    .trim()
    .max(200, "Tempat maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),
  mapsUrl: optionalUrl,
  organizer: z
    .string()
    .trim()
    .max(200, "Penyelenggara maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),
  registrationLink: optionalUrl,
  registrationDeadline: optionalDateTime,
  participantQuota: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || (/^\d+$/.test(value) && Number(value) > 0), {
      message: "Kuota peserta harus berupa angka positif.",
    }),
  documentUrl: optionalUrl,
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
