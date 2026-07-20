"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { scheduleItemFormSchema } from "@/lib/validations/schedule";

export type ScheduleItemFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function saveScheduleItemAction(
  _prevState: ScheduleItemFormState,
  formData: FormData,
): Promise<ScheduleItemFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = scheduleItemFormSchema.safeParse({
    title: formData.get("title"),
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    location: formData.get("location"),
    description: formData.get("description"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    title,
    dayOfWeek,
    startTime,
    endTime,
    location,
    description,
    status,
  } = parsed.data;

  const rawId = formData.get("id");
  const itemId = typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const data = {
    title,
    dayOfWeek,
    startTime,
    endTime: endTime || null,
    location: location || null,
    description: description || null,
    status,
  };

  if (itemId) {
    const existing = await prisma.scheduleItem.findUnique({
      where: { id: itemId },
      select: { id: true },
    });
    if (!existing) {
      return { error: "Jadwal tidak ditemukan." };
    }
    await prisma.scheduleItem.update({ where: { id: itemId }, data });
  } else {
    const last = await prisma.scheduleItem.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    await prisma.scheduleItem.create({
      data: { ...data, displayOrder: (last?.displayOrder ?? -1) + 1 },
    });
  }

  revalidatePath("/jadwal");
  revalidatePath("/dashboard/jadwal");
  redirect("/dashboard/jadwal");
}

export async function deleteScheduleItemAction(
  formData: FormData,
): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const itemId = formData.get("id");
  if (typeof itemId !== "string" || !itemId) {
    return;
  }

  await prisma.scheduleItem.delete({ where: { id: itemId } });

  revalidatePath("/jadwal");
  revalidatePath("/dashboard/jadwal");
}
