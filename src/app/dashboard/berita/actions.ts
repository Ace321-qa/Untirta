"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { newsFormSchema } from "@/lib/validations/news";

export type NewsFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function saveNewsAction(
  _prevState: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = newsFormSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    featuredImage: formData.get("featuredImage"),
    status: formData.get("status"),
    categoryId: formData.get("categoryId"),
    editorId: formData.get("editorId"),
    eventDate: formData.get("eventDate"),
    location: formData.get("location"),
    sourceAttribution: formData.get("sourceAttribution"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    title,
    excerpt,
    body,
    featuredImage,
    status,
    categoryId,
    editorId,
    eventDate,
    location,
    sourceAttribution,
  } = parsed.data;

  const reporterId = formData.get("reporterId");
  const resolvedReporterId =
    typeof reporterId === "string" && reporterId.length > 0
      ? reporterId
      : session.user.id;

  const rawId = formData.get("id");
  const newsId = typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const existing = newsId
    ? await prisma.news.findUnique({
        where: { id: newsId },
        select: { slug: true, publishedAt: true },
      })
    : null;

  if (newsId && !existing) {
    return { error: "Berita tidak ditemukan." };
  }

  const slug =
    existing?.slug ??
    (await generateUniqueSlug(title, async (candidate) => {
      const conflict = await prisma.news.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return Boolean(conflict);
    }));

  const publishedAt =
    status === "PUBLISHED"
      ? (existing?.publishedAt ?? new Date())
      : (existing?.publishedAt ?? null);

  const data = {
    title,
    excerpt: excerpt || null,
    body,
    featuredImage: featuredImage || null,
    status,
    categoryId: categoryId || null,
    editorId: editorId || null,
    eventDate: eventDate ? new Date(eventDate) : null,
    location: location || null,
    sourceAttribution: sourceAttribution || null,
    publishedAt,
  };

  if (newsId) {
    await prisma.news.update({ where: { id: newsId }, data });
  } else {
    await prisma.news.create({
      data: { ...data, slug, reporterId: resolvedReporterId },
    });
  }

  revalidatePath("/");
  revalidatePath("/berita");
  if (existing) {
    revalidatePath(`/berita/${existing.slug}`);
  }
  revalidatePath("/dashboard/berita");
  redirect("/dashboard/berita");
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const newsId = formData.get("id");
  if (typeof newsId !== "string" || !newsId) {
    return;
  }

  await prisma.news.delete({ where: { id: newsId } });

  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath("/dashboard/berita");
}
