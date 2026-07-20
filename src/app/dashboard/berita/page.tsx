import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { deleteNewsAction } from "./actions";

export default async function DashboardBeritaPage() {
  const newsItems = await prisma.news.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      updatedAt: true,
      reporter: { select: { name: true } },
    },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Berita
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Kelola berita yang dipublikasikan di website.
          </p>
        </div>
        <Link
          href="/dashboard/berita/baru"
          className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
        >
          Buat Berita Baru
        </Link>
      </div>

      {newsItems.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada berita. Klik &ldquo;Buat Berita Baru&rdquo; untuk memulai.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Reporter</th>
                <th className="px-4 py-3 font-medium">Diperbarui</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {newsItems.map((news) => (
                <tr key={news.id}>
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {news.title}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        news.status === "PUBLISHED"
                          ? "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {news.status === "PUBLISHED" ? "Terbit" : "Draf"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {news.reporter.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatDate(news.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/berita/${news.id}/edit`}
                        className="text-brand-700 dark:text-brand-300 font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteNewsAction}>
                        <input type="hidden" name="id" value={news.id} />
                        <button
                          type="submit"
                          className="font-medium text-red-600 hover:underline dark:text-red-400"
                        >
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
