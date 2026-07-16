import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";

async function getBook(slug: string) {
  return prisma.book.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, fileUrl: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) return {};

  return {
    title: `Baca ${book.title} — AKMI Untirta`,
  };
}

export default async function BacaBukuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book || !book.fileUrl) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {book.title}
        </h1>
        <Link
          href={`/perpustakaan/buku/${slug}`}
          className="text-brand-700 dark:text-brand-300 text-sm font-medium hover:underline"
        >
          &larr; Kembali ke detail buku
        </Link>
      </div>

      <iframe
        src={book.fileUrl}
        title={book.title}
        className="h-[80vh] w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
      />
    </Container>
  );
}
