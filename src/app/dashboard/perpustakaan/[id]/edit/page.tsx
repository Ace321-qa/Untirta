import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { BookForm } from "../../BookForm";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [book, categories] = await Promise.all([
    prisma.book.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        coverImage: true,
        fileUrl: true,
        status: true,
        categoryId: true,
      },
    }),
    prisma.bookCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!book) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Buku
      </h1>
      <BookForm
        categories={categories}
        initialValues={{
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          coverImage: book.coverImage ?? "",
          fileUrl: book.fileUrl ?? "",
          categoryId: book.categoryId ?? "",
          status: book.status,
        }}
      />
    </Container>
  );
}
