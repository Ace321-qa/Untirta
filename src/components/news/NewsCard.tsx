import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format";

export type NewsCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  category: { name: string } | null;
};

export function NewsCard({ news }: { news: NewsCardData }) {
  return (
    <Link
      href={`/berita/${news.slug}`}
      className="hover:shadow-brand-md flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
        {news.featuredImage ? (
          <Image
            src={news.featuredImage}
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
        {news.category && (
          <span className="text-brand-700 dark:text-brand-300 text-xs font-medium tracking-wide uppercase">
            {news.category.name}
          </span>
        )}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {news.title}
        </h3>
        {news.excerpt && (
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {news.excerpt}
          </p>
        )}
        {news.publishedAt && (
          <p className="mt-auto pt-2 text-xs text-zinc-500 dark:text-zinc-500">
            {formatDate(news.publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}
