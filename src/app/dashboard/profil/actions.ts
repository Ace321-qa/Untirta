"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { siteProfileFormSchema } from "@/lib/validations/site-profile";

export type SiteProfileFormState =
  | { error: string; fieldErrors?: Record<string, string[]> }
  | { success: true }
  | undefined;

export async function saveSiteProfileAction(
  _prevState: SiteProfileFormState,
  formData: FormData,
): Promise<SiteProfileFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = siteProfileFormSchema.safeParse({
    description: formData.get("description"),
    vision: formData.get("vision"),
    mission: formData.get("mission"),
    values: formData.get("values"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.siteProfile.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  revalidatePath("/tentang");
  revalidatePath("/dashboard/profil");

  return { success: true };
}
