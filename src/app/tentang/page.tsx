import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Container } from "@/components/layout/Container";
import { ComingSoon } from "@/components/ComingSoon";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tentang Kami — AKMI Untirta",
  description: "Profil, visi, misi, dan nilai-nilai AKMI Untirta.",
};

export default async function TentangPage() {
  const profile = await prisma.siteProfile.findUnique({
    where: { id: "singleton" },
  });

  if (!profile) {
    return (
      <ComingSoon
        title="Tentang Kami"
        description="Profil, visi, misi, dan nilai-nilai AKMI Untirta akan tampil di sini."
      />
    );
  }

  return (
    <Container className="flex flex-1 flex-col gap-10 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Tentang Kami
        </h1>
        <p className="mt-4 max-w-3xl text-base text-zinc-700 dark:text-zinc-300">
          {profile.description}
        </p>
      </div>

      <section aria-labelledby="visi" className="flex flex-col gap-2">
        <h2
          id="visi"
          className="text-xl font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Visi
        </h2>
        <p className="max-w-3xl text-base text-zinc-700 dark:text-zinc-300">
          {profile.vision}
        </p>
      </section>

      <section aria-labelledby="misi" className="flex flex-col gap-2">
        <h2
          id="misi"
          className="text-xl font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Misi
        </h2>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {profile.mission}
          </ReactMarkdown>
        </div>
      </section>

      <section aria-labelledby="nilai" className="flex flex-col gap-2">
        <h2
          id="nilai"
          className="text-xl font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Nilai-Nilai
        </h2>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {profile.values}
          </ReactMarkdown>
        </div>
      </section>
    </Container>
  );
}
