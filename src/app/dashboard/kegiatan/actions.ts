"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { eventFormSchema } from "@/lib/validations/event";

export type EventFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function saveEventAction(
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = eventFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    featuredImage: formData.get("featuredImage"),
    status: formData.get("status"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    venue: formData.get("venue"),
    mapsUrl: formData.get("mapsUrl"),
    organizer: formData.get("organizer"),
    registrationLink: formData.get("registrationLink"),
    registrationDeadline: formData.get("registrationDeadline"),
    participantQuota: formData.get("participantQuota"),
    documentUrl: formData.get("documentUrl"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    title,
    description,
    featuredImage,
    status,
    startAt,
    endAt,
    venue,
    mapsUrl,
    organizer,
    registrationLink,
    registrationDeadline,
    participantQuota,
    documentUrl,
  } = parsed.data;

  const rawId = formData.get("id");
  const eventId = typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const existing = eventId
    ? await prisma.event.findUnique({
        where: { id: eventId },
        select: { slug: true },
      })
    : null;

  if (eventId && !existing) {
    return { error: "Kegiatan tidak ditemukan." };
  }

  const slug =
    existing?.slug ??
    (await generateUniqueSlug(title, async (candidate) => {
      const conflict = await prisma.event.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return Boolean(conflict);
    }));

  const data = {
    title,
    description,
    featuredImage: featuredImage || null,
    status,
    startAt: new Date(startAt),
    endAt: endAt ? new Date(endAt) : null,
    venue: venue || null,
    mapsUrl: mapsUrl || null,
    organizer: organizer || null,
    registrationLink: registrationLink || null,
    registrationDeadline: registrationDeadline
      ? new Date(registrationDeadline)
      : null,
    participantQuota: participantQuota ? Number(participantQuota) : null,
    documentUrl: documentUrl || null,
  };

  if (eventId) {
    await prisma.event.update({ where: { id: eventId }, data });
  } else {
    await prisma.event.create({ data: { ...data, slug } });
  }

  revalidatePath("/");
  revalidatePath("/kegiatan");
  if (existing) {
    revalidatePath(`/kegiatan/${existing.slug}`);
  }
  revalidatePath("/dashboard/kegiatan");
  redirect("/dashboard/kegiatan");
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const eventId = formData.get("id");
  if (typeof eventId !== "string" || !eventId) {
    return;
  }

  await prisma.event.delete({ where: { id: eventId } });

  revalidatePath("/");
  revalidatePath("/kegiatan");
  revalidatePath("/dashboard/kegiatan");
}
