"use server";

import { revalidatePath } from "next/cache";

import { sendContactNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validations/contact";

export type ContactFormState =
  | { error: string; fieldErrors?: Record<string, string[]> }
  | { success: true }
  | undefined;

export async function submitContactFormAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot tripped — pretend success so bots don't learn to avoid this
  // field, but don't actually store or notify anything.
  if (website) {
    return { success: true };
  }

  await prisma.contactMessage.create({
    data: { name, email, subject: subject || null, message },
  });

  await sendContactNotification({
    name,
    email,
    subject: subject || null,
    message,
  });

  revalidatePath("/dashboard/pesan");
  return { success: true };
}
