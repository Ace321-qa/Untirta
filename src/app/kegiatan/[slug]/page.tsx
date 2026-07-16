import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Container } from "@/components/layout/Container";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

async function getEvent(slug: string) {
  return prisma.event.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      description: true,
      featuredImage: true,
      startAt: true,
      endAt: true,
      venue: true,
      mapsUrl: true,
      organizer: true,
      registrationLink: true,
      registrationDeadline: true,
      participantQuota: true,
      documentUrl: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) return {};

  return {
    title: `${event.title} — AKMI Untirta`,
  };
}

export default async function KegiatanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  const isPastDeadline =
    event.registrationDeadline && event.registrationDeadline < new Date();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <article className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {event.title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {formatDateTime(event.startAt)}
            {event.endAt && ` – ${formatDateTime(event.endAt)}`}
          </p>
          {event.organizer && (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Diselenggarakan oleh {event.organizer}
            </p>
          )}
        </header>

        {event.featuredImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={event.featuredImage}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 672px, 100vw"
              priority
            />
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
          <dl className="flex flex-col gap-3 text-sm">
            {event.venue && (
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">Tempat</dt>
                <dd className="text-right text-zinc-900 dark:text-zinc-100">
                  {event.venue}
                  {event.mapsUrl && (
                    <>
                      {" · "}
                      <a
                        href={event.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-700 dark:text-brand-300 hover:underline"
                      >
                        Lihat Peta
                      </a>
                    </>
                  )}
                </dd>
              </div>
            )}
            {event.participantQuota && (
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">
                  Kuota Peserta
                </dt>
                <dd className="text-zinc-900 dark:text-zinc-100">
                  {event.participantQuota} orang
                </dd>
              </div>
            )}
            {event.registrationDeadline && (
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">
                  Batas Pendaftaran
                </dt>
                <dd className="text-zinc-900 dark:text-zinc-100">
                  {formatDateTime(event.registrationDeadline)}
                </dd>
              </div>
            )}
            {event.documentUrl && (
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-500">Dokumen</dt>
                <dd>
                  <a
                    href={event.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 dark:text-brand-300 hover:underline"
                  >
                    Unduh Dokumen
                  </a>
                </dd>
              </div>
            )}
          </dl>

          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={Boolean(isPastDeadline)}
              className={`mt-4 block w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white transition-colors ${
                isPastDeadline
                  ? "pointer-events-none bg-zinc-300 dark:bg-zinc-700"
                  : "bg-brand-600 shadow-brand-sm hover:bg-brand-700"
              }`}
            >
              {isPastDeadline ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
            </a>
          )}
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.description}
          </ReactMarkdown>
        </div>
      </article>
    </Container>
  );
}
