"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markMessageReadAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const messageId = formData.get("messageId");
  if (typeof messageId !== "string" || !messageId) {
    return;
  }

  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { isRead: true },
  });

  revalidatePath("/dashboard/pesan");
  revalidatePath(`/dashboard/pesan/${messageId}`);
}

export async function deleteMessageAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const messageId = formData.get("messageId");
  if (typeof messageId !== "string" || !messageId) {
    return;
  }

  await prisma.contactMessage.delete({ where: { id: messageId } });

  revalidatePath("/dashboard/pesan");
  redirect("/dashboard/pesan");
}
