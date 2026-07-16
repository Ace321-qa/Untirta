import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "../../NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [news, categories, users] = await Promise.all([
    prisma.news.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        excerpt: true,
        body: true,
        featuredImage: true,
        status: true,
        categoryId: true,
        reporterId: true,
        editorId: true,
        eventDate: true,
        location: true,
        sourceAttribution: true,
      },
    }),
    prisma.newsCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!news) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Berita
      </h1>
      <NewsForm
        categories={categories}
        users={users}
        currentUserId={session!.user.id}
        initialValues={{
          id: news.id,
          title: news.title,
          excerpt: news.excerpt ?? "",
          body: news.body,
          featuredImage: news.featuredImage ?? "",
          status: news.status,
          categoryId: news.categoryId ?? "",
          reporterId: news.reporterId,
          editorId: news.editorId ?? "",
          eventDate: news.eventDate
            ? news.eventDate.toISOString().slice(0, 10)
            : "",
          location: news.location ?? "",
          sourceAttribution: news.sourceAttribution ?? "",
        }}
      />
    </Container>
  );
}
