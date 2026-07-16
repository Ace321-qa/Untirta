import Image from "next/image";
import Link from "next/link";

export type BookCardData = {
  slug: string;
  title: string;
  author: string;
  coverImage: string | null;
  category: { name: string } | null;
};

export function BookCard({ book }: { book: BookCardData }) {
  return (
    <Link
      href={`/perpustakaan/buku/${book.slug}`}
      className="hover:shadow-brand-md flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-[3/4] w-full bg-zinc-100 dark:bg-zinc-800">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            AKMI Untirta
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {book.category && (
          <span className="text-brand-700 dark:text-brand-300 text-xs font-medium tracking-wide uppercase">
            {book.category.name}
          </span>
        )}
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {book.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {book.author}
        </p>
      </div>
    </Link>
  );
}
