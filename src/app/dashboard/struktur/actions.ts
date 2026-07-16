"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  divisionFormSchema,
  officerFormSchema,
  periodFormSchema,
} from "@/lib/validations/management";

export type PeriodFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function savePeriodAction(
  _prevState: PeriodFormState,
  formData: FormData,
): Promise<PeriodFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = periodFormSchema.safeParse({
    label: formData.get("label"),
    startYear: formData.get("startYear"),
    endYear: formData.get("endYear"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { label, startYear, endYear, isActive } = parsed.data;

  const rawId = formData.get("id");
  const periodId = typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  if (periodId) {
    const existing = await prisma.managementPeriod.findUnique({
      where: { id: periodId },
      select: { id: true },
    });
    if (!existing) {
      return { error: "Periode tidak ditemukan." };
    }
  }

  const data = {
    label,
    startYear: Number(startYear),
    endYear: Number(endYear),
    isActive: isActive === "true",
  };

  let savedId = periodId;

  // Only one period can be active at a time — enforced here in application
  // code since the database has no built-in "exactly one" constraint.
  if (data.isActive) {
    await prisma.managementPeriod.updateMany({
      data: { isActive: false },
    });
  }

  if (periodId) {
    await prisma.managementPeriod.update({ where: { id: periodId }, data });
  } else {
    const created = await prisma.managementPeriod.create({ data });
    savedId = created.id;
  }

  revalidatePath("/tentang/struktur");
  revalidatePath("/dashboard/struktur");

  if (periodId) {
    redirect("/dashboard/struktur");
  }
  redirect(`/dashboard/struktur/${savedId}/edit`);
}

export type DivisionFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function addDivisionAction(
  _prevState: DivisionFormState,
  formData: FormData,
): Promise<DivisionFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const periodId = formData.get("periodId");
  if (typeof periodId !== "string" || !periodId) {
    return { error: "Periode tidak ditemukan." };
  }

  const period = await prisma.managementPeriod.findUnique({
    where: { id: periodId },
    select: { id: true },
  });
  if (!period) {
    return { error: "Periode tidak ditemukan." };
  }

  const parsed = divisionFormSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const lastDivision = await prisma.division.findFirst({
    where: { periodId },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  await prisma.division.create({
    data: {
      periodId,
      name: parsed.data.name,
      displayOrder: (lastDivision?.displayOrder ?? -1) + 1,
    },
  });

  revalidatePath("/tentang/struktur");
  revalidatePath(`/dashboard/struktur/${periodId}/edit`);
  redirect(`/dashboard/struktur/${periodId}/edit`);
}

export async function deleteDivisionAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const divisionId = formData.get("divisionId");
  if (typeof divisionId !== "string" || !divisionId) {
    return;
  }

  const division = await prisma.division.findUnique({
    where: { id: divisionId },
    select: { periodId: true },
  });
  if (!division) {
    return;
  }

  await prisma.division.delete({ where: { id: divisionId } });

  revalidatePath("/tentang/struktur");
  revalidatePath(`/dashboard/struktur/${division.periodId}/edit`);
  redirect(`/dashboard/struktur/${division.periodId}/edit`);
}

export type OfficerFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function addOfficerAction(
  _prevState: OfficerFormState,
  formData: FormData,
): Promise<OfficerFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const divisionId = formData.get("divisionId");
  if (typeof divisionId !== "string" || !divisionId) {
    return { error: "Divisi tidak ditemukan." };
  }

  const division = await prisma.division.findUnique({
    where: { id: divisionId },
    select: { periodId: true },
  });
  if (!division) {
    return { error: "Divisi tidak ditemukan." };
  }

  const parsed = officerFormSchema.safeParse({
    name: formData.get("name"),
    position: formData.get("position"),
    photo: formData.get("photo"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, position, photo } = parsed.data;

  const lastOfficer = await prisma.officer.findFirst({
    where: { divisionId },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  await prisma.officer.create({
    data: {
      divisionId,
      name,
      position,
      photo: photo || null,
      displayOrder: (lastOfficer?.displayOrder ?? -1) + 1,
    },
  });

  revalidatePath("/tentang/struktur");
  revalidatePath(`/dashboard/struktur/${division.periodId}/edit`);
  redirect(`/dashboard/struktur/${division.periodId}/edit`);
}

export async function deleteOfficerAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const officerId = formData.get("officerId");
  if (typeof officerId !== "string" || !officerId) {
    return;
  }

  const officer = await prisma.officer.findUnique({
    where: { id: officerId },
    select: { division: { select: { periodId: true } } },
  });
  if (!officer) {
    return;
  }

  await prisma.officer.delete({ where: { id: officerId } });

  revalidatePath("/tentang/struktur");
  revalidatePath(`/dashboard/struktur/${officer.division.periodId}/edit`);
  redirect(`/dashboard/struktur/${officer.division.periodId}/edit`);
}
