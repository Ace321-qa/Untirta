import Image from "next/image";
import Link from "next/link";

import { formatDateTime } from "@/lib/format";

export type EventCardData = {
  slug: string;
  title: string;
  featuredImage: string | null;
  startAt: Date;
  venue: string | null;
};

export function EventCard({ event }: { event: EventCardData }) {
  return (
    <Link
      href={`/kegiatan/${event.slug}`}
      className="hover:shadow-brand-md flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
        {event.featuredImage ? (
          <Image
            src={event.featuredImage}
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
        <span className="text-brand-700 dark:text-brand-300 text-xs font-medium tracking-wide uppercase">
          {formatDateTime(event.startAt)}
        </span>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {event.title}
        </h3>
        {event.venue && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {event.venue}
          </p>
        )}
      </div>
    </Link>
  );
}
