"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { bookFormSchema } from "@/lib/validations/book";

export type BookFormState =
  { error: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function saveBookAction(
  _prevState: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = bookFormSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    description: formData.get("description"),
    coverImage: formData.get("coverImage"),
    fileUrl: formData.get("fileUrl"),
    categoryId: formData.get("categoryId"),
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
    author,
    description,
    coverImage,
    fileUrl,
    categoryId,
    status,
  } = parsed.data;

  const rawId = formData.get("id");
  const bookId = typeof rawId === "string" && rawId.length > 0 ? rawId : null;

  const existing = bookId
    ? await prisma.book.findUnique({
        where: { id: bookId },
        select: { slug: true },
      })
    : null;

  if (bookId && !existing) {
    return { error: "Buku tidak ditemukan." };
  }

  const slug =
    existing?.slug ??
    (await generateUniqueSlug(title, async (candidate) => {
      const conflict = await prisma.book.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return Boolean(conflict);
    }));

  const data = {
    title,
    author,
    description,
    coverImage: coverImage || null,
    fileUrl: fileUrl || null,
    categoryId: categoryId || null,
    status,
  };

  if (bookId) {
    await prisma.book.update({ where: { id: bookId }, data });
  } else {
    await prisma.book.create({ data: { ...data, slug } });
  }

  revalidatePath("/perpustakaan");
  if (existing) {
    revalidatePath(`/perpustakaan/buku/${existing.slug}`);
    revalidatePath(`/perpustakaan/buku/${existing.slug}/baca`);
  }
  revalidatePath("/dashboard/perpustakaan");
  redirect("/dashboard/perpustakaan");
}
