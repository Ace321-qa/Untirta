import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

async function getAlbum(slug: string) {
  return prisma.galleryAlbum.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      description: true,
      eventDate: true,
      videoUrl: true,
      images: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          url: true,
          altText: true,
          caption: true,
          photographerCredit: true,
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbum(slug);

  if (!album) return {};

  return {
    title: `${album.title} — AKMI Untirta`,
  };
}

export default async function GaleriDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await getAlbum(slug);

  if (!album) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <article className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {album.title}
          </h1>
          {album.eventDate && (
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              {formatDate(album.eventDate)}
            </p>
          )}
        </header>

        {album.description && (
          <p className="text-base text-zinc-700 dark:text-zinc-300">
            {album.description}
          </p>
        )}

        {album.videoUrl && (
          <a
            href={album.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-brand-600 text-brand-700 dark:text-brand-300 dark:hover:bg-brand-900 w-fit rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white"
          >
            Tonton Video
          </a>
        )}

        {album.images.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Belum ada foto pada album ini.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {album.images.map((image) => (
              <figure
                key={image.id}
                className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={image.url}
                    alt={image.altText}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                {(image.caption || image.photographerCredit) && (
                  <figcaption className="flex flex-col gap-0.5 px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {image.caption && <span>{image.caption}</span>}
                    {image.photographerCredit && (
                      <span className="text-xs text-zinc-500 dark:text-zinc-500">
                        Foto: {image.photographerCredit}
                      </span>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </article>
    </Container>
  );
}
