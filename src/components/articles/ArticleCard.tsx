import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  category: { name: string } | null;
};

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="hover:shadow-brand-md flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
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
        {article.category && (
          <span className="text-brand-700 dark:text-brand-300 text-xs font-medium tracking-wide uppercase">
            {article.category.name}
          </span>
        )}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {article.excerpt}
          </p>
        )}
        {article.publishedAt && (
          <p className="mt-auto pt-2 text-xs text-zinc-500 dark:text-zinc-500">
            {formatDate(article.publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}
