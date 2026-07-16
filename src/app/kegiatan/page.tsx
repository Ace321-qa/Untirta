import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { EventCard } from "@/components/events/EventCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Kegiatan — AKMI Untirta",
  description: "Kegiatan mendatang dan yang telah berlalu dari AKMI Untirta.",
};

// The upcoming/past split depends on the current time, not just database
// writes, so on-demand revalidation (via revalidatePath on save) alone
// isn't enough — an event could sit in the wrong section for a long time
// after its start passes. Revalidate hourly as a backstop.
export const revalidate = 3600;

export default async function KegiatanPage() {
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { status: "PUBLISHED", startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      select: {
        slug: true,
        title: true,
        featuredImage: true,
        startAt: true,
        venue: true,
      },
    }),
    prisma.event.findMany({
      where: { status: "PUBLISHED", startAt: { lt: now } },
      orderBy: { startAt: "desc" },
      take: 9,
      select: {
        slug: true,
        title: true,
        featuredImage: true,
        startAt: true,
        venue: true,
      },
    }),
  ]);

  return (
    <Container className="flex flex-1 flex-col gap-10 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Kegiatan
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Kegiatan mendatang dan yang telah berlalu dari AKMI Untirta.
        </p>
      </div>

      <section aria-labelledby="kegiatan-mendatang">
        <h2
          id="kegiatan-mendatang"
          className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Kegiatan Mendatang
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Belum ada kegiatan mendatang yang dijadwalkan.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="kegiatan-lalu">
        <h2
          id="kegiatan-lalu"
          className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Kegiatan Lalu
        </h2>
        {past.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Belum ada kegiatan yang telah berlalu.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
