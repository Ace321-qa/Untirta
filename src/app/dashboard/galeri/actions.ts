"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { albumFormSchema, photoFormSchema } from "@/lib/validations/gallery";

export type AlbumFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function saveAlbumAction(
  _prevState: AlbumFormState,
  formData: FormData,
): Promise<AlbumFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = albumFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    eventDate: formData.get("eventDate"),
    coverImage: formData.get("coverImage"),
    videoUrl: formData.get("videoUrl"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, description, eventDate, coverImage, videoUrl, status } =
    parsed.data;

  const rawId = formData.get("id");
  const albumId = typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const existing = albumId
    ? await prisma.galleryAlbum.findUnique({
        where: { id: albumId },
        select: { slug: true },
      })
    : null;

  if (albumId && !existing) {
    return { error: "Album tidak ditemukan." };
  }

  const slug =
    existing?.slug ??
    (await generateUniqueSlug(title, async (candidate) => {
      const conflict = await prisma.galleryAlbum.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return Boolean(conflict);
    }));

  const data = {
    title,
    description: description || null,
    eventDate: eventDate ? new Date(eventDate) : null,
    coverImage: coverImage || null,
    videoUrl: videoUrl || null,
    status,
  };

  let savedId = albumId;

  if (albumId) {
    await prisma.galleryAlbum.update({ where: { id: albumId }, data });
  } else {
    const created = await prisma.galleryAlbum.create({
      data: { ...data, slug },
    });
    savedId = created.id;
  }

  revalidatePath("/");
  revalidatePath("/tentang/galeri");
  if (existing) {
    revalidatePath(`/tentang/galeri/${existing.slug}`);
  }
  revalidatePath("/dashboard/galeri");

  if (albumId) {
    redirect("/dashboard/galeri");
  }
  redirect(`/dashboard/galeri/${savedId}/edit`);
}

export type PhotoFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function addPhotoAction(
  _prevState: PhotoFormState,
  formData: FormData,
): Promise<PhotoFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const albumId = formData.get("albumId");
  if (typeof albumId !== "string" || !albumId) {
    return { error: "Album tidak ditemukan." };
  }

  const album = await prisma.galleryAlbum.findUnique({
    where: { id: albumId },
    select: { slug: true },
  });
  if (!album) {
    return { error: "Album tidak ditemukan." };
  }

  const parsed = photoFormSchema.safeParse({
    url: formData.get("url"),
    altText: formData.get("altText"),
    caption: formData.get("caption"),
    photographerCredit: formData.get("photographerCredit"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { url, altText, caption, photographerCredit } = parsed.data;

  const lastImage = await prisma.galleryImage.findFirst({
    where: { albumId },
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });

  await prisma.galleryImage.create({
    data: {
      albumId,
      url,
      altText,
      caption: caption || null,
      photographerCredit: photographerCredit || null,
      displayOrder: (lastImage?.displayOrder ?? -1) + 1,
    },
  });

  revalidatePath("/");
  revalidatePath("/tentang/galeri");
  revalidatePath(`/tentang/galeri/${album.slug}`);
  revalidatePath(`/dashboard/galeri/${albumId}/edit`);
  redirect(`/dashboard/galeri/${albumId}/edit`);
}

export async function deletePhotoAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const imageId = formData.get("imageId");
  if (typeof imageId !== "string" || !imageId) {
    return;
  }

  const image = await prisma.galleryImage.findUnique({
    where: { id: imageId },
    select: { albumId: true, album: { select: { slug: true } } },
  });
  if (!image) {
    return;
  }

  await prisma.galleryImage.delete({ where: { id: imageId } });

  revalidatePath("/");
  revalidatePath("/tentang/galeri");
  revalidatePath(`/tentang/galeri/${image.album.slug}`);
  revalidatePath(`/dashboard/galeri/${image.albumId}/edit`);
  redirect(`/dashboard/galeri/${image.albumId}/edit`);
}
