"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug, slugify } from "@/lib/slug";
import { articleFormSchema, parseTagNames } from "@/lib/validations/article";

export type ArticleFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function saveArticleAction(
  _prevState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = articleFormSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    featuredImage: formData.get("featuredImage"),
    status: formData.get("status"),
    categoryId: formData.get("categoryId"),
    tags: formData.get("tags"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, excerpt, body, featuredImage, status, categoryId, tags } =
    parsed.data;
  const tagNames = parseTagNames(tags);

  const rawId = formData.get("id");
  const articleId =
    typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const existing = articleId
    ? await prisma.article.findUnique({
        where: { id: articleId },
        select: { slug: true, publishedAt: true },
      })
    : null;

  if (articleId && !existing) {
    return { error: "Artikel tidak ditemukan." };
  }

  const slug =
    existing?.slug ??
    (await generateUniqueSlug(title, async (candidate) => {
      const conflict = await prisma.article.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return Boolean(conflict);
    }));

  const publishedAt =
    status === "PUBLISHED"
      ? (existing?.publishedAt ?? new Date())
      : (existing?.publishedAt ?? null);

  const tagConnectOrCreate = tagNames.map((name) => {
    const tagSlug = slugify(name);
    return {
      where: { slug: tagSlug },
      create: { name, slug: tagSlug },
    };
  });

  const baseData = {
    title,
    excerpt: excerpt || null,
    body,
    featuredImage: featuredImage || null,
    status,
    categoryId: categoryId || null,
    publishedAt,
  };

  if (articleId) {
    // "set: []" clears existing tag connections before reconnecting —
    // only valid on update, since create has no prior relations to clear.
    await prisma.article.update({
      where: { id: articleId },
      data: {
        ...baseData,
        tags: { set: [], connectOrCreate: tagConnectOrCreate },
      },
    });
  } else {
    await prisma.article.create({
      data: {
        ...baseData,
        slug,
        authorId: session.user.id,
        tags: { connectOrCreate: tagConnectOrCreate },
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/artikel");
  if (existing) {
    revalidatePath(`/artikel/${existing.slug}`);
  }
  revalidatePath("/dashboard/artikel");
  redirect("/dashboard/artikel");
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const articleId = formData.get("id");
  if (typeof articleId !== "string" || !articleId) {
    return;
  }

  await prisma.article.delete({ where: { id: articleId } });

  revalidatePath("/");
  revalidatePath("/artikel");
  revalidatePath("/dashboard/artikel");
}
