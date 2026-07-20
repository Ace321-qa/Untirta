"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reportFormSchema } from "@/lib/validations/report";

export type ReportFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function saveReportAction(
  _prevState: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = reportFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    year: formData.get("year"),
    fileUrl: formData.get("fileUrl"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, description, year, fileUrl, status } = parsed.data;

  const rawId = formData.get("id");
  const reportId = typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const data = {
    title,
    description: description || null,
    year: Number(year),
    fileUrl: fileUrl || null,
    status,
  };

  if (reportId) {
    const existing = await prisma.report.findUnique({
      where: { id: reportId },
      select: { id: true },
    });
    if (!existing) {
      return { error: "Laporan tidak ditemukan." };
    }
    await prisma.report.update({ where: { id: reportId }, data });
  } else {
    await prisma.report.create({ data });
  }

  revalidatePath("/laporan");
  revalidatePath("/dashboard/laporan");
  redirect("/dashboard/laporan");
}

export async function deleteReportAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const reportId = formData.get("id");
  if (typeof reportId !== "string" || !reportId) {
    return;
  }

  await prisma.report.delete({ where: { id: reportId } });

  revalidatePath("/laporan");
  revalidatePath("/dashboard/laporan");
}
