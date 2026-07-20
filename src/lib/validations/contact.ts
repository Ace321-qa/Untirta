import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(150, "Nama maksimal 150 karakter."),
  email: z.string().trim().email("Alamat email tidak valid."),
  subject: z
    .string()
    .trim()
    .max(200, "Subjek maksimal 200 karakter.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Pesan minimal 10 karakter.")
    .max(5000, "Pesan maksimal 5000 karakter."),
  // Honeypot: a field real visitors never see or fill in (hidden via CSS),
  // but simple bots that auto-fill every form field will populate it. Must
  // accept any value here — the action (not validation) decides what to do
  // when it's non-empty, so a filled-in honeypot still passes validation
  // and reaches that check instead of surfacing a generic Zod error.
  website: z.string().optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
