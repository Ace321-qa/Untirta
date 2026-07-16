import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format";

export type GalleryCardData = {
  slug: string;
  title: string;
  coverImage: string | null;
  eventDate: Date | null;
};

export function GalleryCard({ album }: { album: GalleryCardData }) {
  return (
    <Link
      href={`/tentang/galeri/${album.slug}`}
      className="hover:shadow-brand-md flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
        {album.coverImage ? (
          <Image
            src={album.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            AKMI Untirta
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {album.eventDate && (
          <span className="text-brand-700 dark:text-brand-300 text-xs font-medium tracking-wide uppercase">
            {formatDate(album.eventDate)}
          </span>
        )}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {album.title}
        </h3>
      </div>
    </Link>
  );
}
