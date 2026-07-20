import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function DashboardPesanPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      isRead: true,
      createdAt: true,
    },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Pesan Masuk
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Pesan yang dikirim melalui formulir kontak di halaman publik.
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada pesan masuk.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Pengirim</th>
                <th className="px-4 py-3 font-medium">Subjek</th>
                <th className="px-4 py-3 font-medium">Diterima</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {messages.map((message) => (
                <tr key={message.id}>
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    <div className="font-medium">{message.name}</div>
                    <div className="text-zinc-500 dark:text-zinc-500">
                      {message.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {message.subject || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(message.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        message.isRead
                          ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          : "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200"
                      }`}
                    >
                      {message.isRead ? "Sudah dibaca" : "Belum dibaca"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/pesan/${message.id}`}
                      className="text-brand-700 dark:text-brand-300 font-medium hover:underline"
                    >
                      Lihat
                    </Link>
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
