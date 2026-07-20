import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { toPlainSummary } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Cari — AKMI Untirta",
};

const RESULT_LIMIT = 10;

async function search(query: string) {
  const contains = { contains: query };

  const [articles, news, events, books] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ title: contains }, { excerpt: contains }],
      },
      select: { title: true, slug: true, excerpt: true },
      take: RESULT_LIMIT,
    }),
    prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ title: contains }, { excerpt: contains }],
      },
      select: { title: true, slug: true, excerpt: true },
      take: RESULT_LIMIT,
    }),
    prisma.event.findMany({
      where: { status: "PUBLISHED", title: contains },
      select: { title: true, slug: true, description: true },
      take: RESULT_LIMIT,
    }),
    prisma.book.findMany({
      where: {
        status: "PUBLISHED",
        OR: [{ title: contains }, { author: contains }],
      },
      select: { title: true, slug: true, author: true },
      take: RESULT_LIMIT,
    }),
  ]);

  return { articles, news, events, books };
}

export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await search(query) : null;
  const totalResults = results
    ? results.articles.length +
      results.news.length +
      results.events.length +
      results.books.length
    : 0;

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Hasil Pencarian
        </h1>
        {query && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {totalResults > 0
              ? `Menampilkan hasil untuk "${query}"`
              : `Tidak ada hasil untuk "${query}"`}
          </p>
        )}
      </div>

      {!query && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Masukkan kata kunci pencarian.
        </p>
      )}

      {results && results.articles.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Artikel
          </h2>
          <ul className="flex flex-col gap-3">
            {results.articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/artikel/${article.slug}`}
                  className="hover:text-brand-600 dark:hover:text-brand-400 font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {article.title}
                </Link>
                {article.excerpt && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {article.excerpt}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {results && results.news.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Berita
          </h2>
          <ul className="flex flex-col gap-3">
            {results.news.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/berita/${item.slug}`}
                  className="hover:text-brand-600 dark:hover:text-brand-400 font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {item.title}
                </Link>
                {item.excerpt && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.excerpt}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {results && results.events.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Kegiatan
          </h2>
          <ul className="flex flex-col gap-3">
            {results.events.map((event) => (
              <li key={event.slug}>
                <Link
                  href={`/kegiatan/${event.slug}`}
                  className="hover:text-brand-600 dark:hover:text-brand-400 font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {event.title}
                </Link>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {toPlainSummary(event.description)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results && results.books.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Perpustakaan
          </h2>
          <ul className="flex flex-col gap-3">
            {results.books.map((book) => (
              <li key={book.slug}>
                <Link
                  href={`/perpustakaan/buku/${book.slug}`}
                  className="hover:text-brand-600 dark:hover:text-brand-400 font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {book.title}
                </Link>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {book.author}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
