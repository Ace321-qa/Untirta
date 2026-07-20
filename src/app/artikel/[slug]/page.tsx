import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Container } from "@/components/layout/Container";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

async function getArticle(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      excerpt: true,
      body: true,
      featuredImage: true,
      publishedAt: true,
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return {};

  return {
    title: `${article.title} — AKMI Untirta`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.featuredImage ? [article.featuredImage] : undefined,
      type: "article",
    },
  };
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <article className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          {article.category && (
            <Link
              href={`/artikel`}
              className="text-brand-700 dark:text-brand-300 w-fit text-xs font-medium tracking-wide uppercase"
            >
              {article.category.name}
            </Link>
          )}
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {article.title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {article.author.name}
            {article.publishedAt && ` · ${formatDate(article.publishedAt)}`}
          </p>
        </header>

        {article.featuredImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={article.featuredImage}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 672px, 100vw"
              priority
            />
          </div>
        )}

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.body}
          </ReactMarkdown>
        </div>

        {article.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-4">
            {article.tags.map((tag) => (
              <li
                key={tag.slug}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                #{tag.name}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Container>
  );
}
