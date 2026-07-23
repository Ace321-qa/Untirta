import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { BookCard } from "@/components/books/BookCard";
import { prisma } from "@/lib/prisma";

// Prevents build-time prerendering, which would require a database
// connection during the build step itself (not available on some hosts).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Perpustakaan — AKMI Untirta",
  description: "Koleksi buku digital AKMI Untirta.",
};

export default async function PerpustakaanPage() {
  const books = await prisma.book.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    select: {
      slug: true,
      title: true,
      author: true,
      coverImage: true,
      category: { select: { name: true } },
    },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Perpustakaan
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Koleksi buku digital AKMI Untirta.
        </p>
      </div>

      {books.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada buku yang dipublikasikan.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      )}
    </Container>
  );
}
