import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { GalleryCard } from "@/components/gallery/GalleryCard";
import { prisma } from "@/lib/prisma";

// Prevents build-time prerendering, which would require a database
// connection during the build step itself (not available on some hosts).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri — AKMI Untirta",
  description: "Album foto dan video kegiatan AKMI Untirta.",
};

export default async function GaleriPage() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }],
    select: {
      slug: true,
      title: true,
      coverImage: true,
      eventDate: true,
    },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Galeri
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Album foto dan video kegiatan AKMI Untirta.
        </p>
      </div>

      {albums.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada album yang dipublikasikan.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <GalleryCard key={album.slug} album={album} />
          ))}
        </div>
      )}
    </Container>
  );
}
