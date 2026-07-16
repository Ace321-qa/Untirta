import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { BookForm } from "../BookForm";

export default async function NewBookPage() {
  const categories = await prisma.bookCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Tambah Buku Baru
      </h1>
      <BookForm categories={categories} />
    </Container>
  );
}
