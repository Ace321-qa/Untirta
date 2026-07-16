import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { toDateLocalValue } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { AlbumForm } from "../../AlbumForm";
import { PhotoForm } from "../../PhotoForm";
import { deletePhotoAction } from "../../actions";

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      eventDate: true,
      coverImage: true,
      videoUrl: true,
      status: true,
      images: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          url: true,
          altText: true,
          caption: true,
        },
      },
    },
  });

  if (!album) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-10 py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Edit Album
        </h1>
        <AlbumForm
          initialValues={{
            id: album.id,
            title: album.title,
            description: album.description ?? "",
            eventDate: album.eventDate ? toDateLocalValue(album.eventDate) : "",
            coverImage: album.coverImage ?? "",
            videoUrl: album.videoUrl ?? "",
            status: album.status,
          }}
        />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Foto ({album.images.length})
        </h2>

        {album.images.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Belum ada foto pada album ini.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {album.images.map((image) => (
              <div
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
                <div className="flex flex-col gap-2 px-4 pb-4">
                  {image.caption && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {image.caption}
                    </p>
                  )}
                  <form action={deletePhotoAction}>
                    <input type="hidden" name="imageId" value={image.id} />
                    <button
                      type="submit"
                      className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <PhotoForm albumId={album.id} />
      </div>
    </Container>
  );
}
