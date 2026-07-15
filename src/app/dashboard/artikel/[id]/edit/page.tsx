import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "../../ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        excerpt: true,
        body: true,
        featuredImage: true,
        status: true,
        categoryId: true,
        tags: { select: { name: true } },
      },
    }),
    prisma.articleCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!article) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Artikel
      </h1>
      <ArticleForm
        categories={categories}
        initialValues={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt ?? "",
          body: article.body,
          featuredImage: article.featuredImage ?? "",
          status: article.status,
          categoryId: article.categoryId ?? "",
          tags: article.tags.map((tag) => tag.name).join(", "),
        }}
      />
    </Container>
  );
}
