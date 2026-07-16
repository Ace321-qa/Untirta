import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { NewsCard } from "@/components/news/NewsCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Berita — AKMI Untirta",
  description: "Kumpulan berita kegiatan dan informasi AKMI Untirta.",
};

const PAGE_SIZE = 9;

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = { status: "PUBLISHED" as const };

  const [newsItems, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        category: { select: { name: true } },
      },
    }),
    prisma.news.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Container className="flex flex-1 flex-col gap-8 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Berita
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Kumpulan berita kegiatan dan informasi AKMI Untirta.
        </p>
      </div>

      {newsItems.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada berita yang dipublikasikan.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((news) => (
            <NewsCard key={news.slug} news={news} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Navigasi halaman"
          className="flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={p === 1 ? "/berita" : `/berita?page=${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                p === page
                  ? "bg-brand-600 text-white"
                  : "hover:bg-brand-50 dark:hover:bg-brand-950 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </Container>
  );
}
