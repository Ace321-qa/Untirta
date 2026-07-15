import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "../ArticleForm";

export default async function NewArticlePage() {
  const categories = await prisma.articleCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Buat Artikel Baru
      </h1>
      <ArticleForm categories={categories} />
    </Container>
  );
}
