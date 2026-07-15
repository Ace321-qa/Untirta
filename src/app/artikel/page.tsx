import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Artikel — AKMI Untirta",
  description: "Kumpulan artikel AKMI Untirta seputar dakwah dan kajian Islam.",
};

const PAGE_SIZE = 9;

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = { status: "PUBLISHED" as const };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
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
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Container className="flex flex-1 flex-col gap-8 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Artikel
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Kumpulan artikel AKMI Untirta seputar dakwah dan kajian Islam.
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada artikel yang dipublikasikan.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
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
              href={p === 1 ? "/artikel" : `/artikel?page=${p}`}
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
