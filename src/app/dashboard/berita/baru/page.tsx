import { auth } from "@/auth";
import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "../NewsForm";

export default async function NewNewsPage() {
  const session = await auth();

  const [categories, users] = await Promise.all([
    prisma.newsCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Buat Berita Baru
      </h1>
      <NewsForm
        categories={categories}
        users={users}
        currentUserId={session!.user.id}
      />
    </Container>
  );
}
