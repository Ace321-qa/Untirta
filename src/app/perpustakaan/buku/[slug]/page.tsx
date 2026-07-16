import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";

async function getBook(slug: string) {
  return prisma.book.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      author: true,
      description: true,
      coverImage: true,
      fileUrl: true,
      category: { select: { name: true } },
    },
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
    title: `${book.title} — AKMI Untirta`,
  };
}

export default async function BukuDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <article className="mx-auto grid w-full max-w-3xl gap-8 sm:grid-cols-[200px_1fr]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt=""
              fill
              className="object-cover"
              sizes="200px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              AKMI Untirta
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-1">
            {book.category && (
              <span className="text-brand-700 dark:text-brand-300 text-xs font-medium tracking-wide uppercase">
                {book.category.name}
              </span>
            )}
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {book.title}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {book.author}
            </p>
          </header>

          <p className="text-base text-zinc-700 dark:text-zinc-300">
            {book.description}
          </p>

          {book.fileUrl ? (
            <Link
              href={`/perpustakaan/buku/${slug}/baca`}
              className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 w-fit rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Baca Buku
            </Link>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Buku ini belum tersedia untuk dibaca secara daring.
            </p>
          )}
        </div>
      </article>
    </Container>
  );
}
