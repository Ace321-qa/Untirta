"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serviceFormSchema } from "@/lib/validations/service";

export type ServiceFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function saveServiceAction(
  _prevState: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = serviceFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    link: formData.get("link"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, description, link, status } = parsed.data;

  const rawId = formData.get("id");
  const serviceId =
    typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const data = { name, description, link: link || null, status };

  if (serviceId) {
    const existing = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
    if (!existing) {
      return { error: "Layanan tidak ditemukan." };
    }
    await prisma.service.update({ where: { id: serviceId }, data });
  } else {
    const last = await prisma.service.findFirst({
      orderBy: { displayOrder: "desc" },
      select: { displayOrder: true },
    });
    await prisma.service.create({
      data: { ...data, displayOrder: (last?.displayOrder ?? -1) + 1 },
    });
  }

  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath("/dashboard/layanan");
  redirect("/dashboard/layanan");
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const serviceId = formData.get("id");
  if (typeof serviceId !== "string" || !serviceId) {
    return;
  }

  await prisma.service.delete({ where: { id: serviceId } });

  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath("/dashboard/layanan");
}
