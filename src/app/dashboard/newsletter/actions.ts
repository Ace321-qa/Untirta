"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteSubscriberAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const subscriberId = formData.get("subscriberId");
  if (typeof subscriberId !== "string" || !subscriberId) {
    return;
  }

  await prisma.newsletterSubscriber.delete({ where: { id: subscriberId } });

  revalidatePath("/dashboard/newsletter");
}
