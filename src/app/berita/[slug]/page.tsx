import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Container } from "@/components/layout/Container";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

async function getNews(slug: string) {
  return prisma.news.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      excerpt: true,
      body: true,
      featuredImage: true,
      publishedAt: true,
      eventDate: true,
      location: true,
      sourceAttribution: true,
      reporter: { select: { name: true } },
      editor: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) return {};

  return {
    title: `${news.title} — AKMI Untirta`,
    description: news.excerpt ?? undefined,
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <article className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          {news.category && (
            <Link
              href="/berita"
              className="text-brand-700 dark:text-brand-300 w-fit text-xs font-medium tracking-wide uppercase"
            >
              {news.category.name}
            </Link>
          )}
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {news.title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {news.reporter.name}
            {news.editor && ` · Diedit oleh ${news.editor.name}`}
            {news.publishedAt && ` · ${formatDate(news.publishedAt)}`}
          </p>
          {(news.eventDate || news.location) && (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              {news.eventDate && formatDate(news.eventDate)}
              {news.eventDate && news.location && " · "}
              {news.location}
            </p>
          )}
        </header>

        {news.featuredImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={news.featuredImage}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 672px, 100vw"
              priority
            />
          </div>
        )}

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{news.body}</ReactMarkdown>
        </div>

        {news.sourceAttribution && (
          <p className="border-t border-zinc-200 pt-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
            Sumber: {news.sourceAttribution}
          </p>
        )}
      </article>
    </Container>
  );
}
