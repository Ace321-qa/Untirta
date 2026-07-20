import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z.string().trim().email("Alamat email tidak valid."),
  // Honeypot — see docs/DECISIONS.md's contact form entry for the same
  // pattern and the bug that came from over-restricting this field there.
  website: z.string().optional().or(z.literal("")),
});

export type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;
