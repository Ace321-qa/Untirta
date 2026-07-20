"use server";

import { prisma } from "@/lib/prisma";
import { newsletterFormSchema } from "@/lib/validations/newsletter";

export type NewsletterFormState =
  | { error: string; fieldErrors?: Record<string, string[]> }
  | { success: true }
  | undefined;

export async function subscribeNewsletterAction(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const parsed = newsletterFormSchema.safeParse({
    email: formData.get("email"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali alamat email Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, website } = parsed.data;

  // Honeypot tripped — pretend success, don't store anything.
  if (website) {
    return { success: true };
  }

  // Re-subscribing with the same address is a harmless no-op, not an error.
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  return { success: true };
}
