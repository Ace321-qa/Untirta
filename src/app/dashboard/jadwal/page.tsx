import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { dayOfWeekLabels } from "@/lib/validations/schedule";

export default async function DashboardJadwalPage() {
  const items = await prisma.scheduleItem.findMany({
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    select: {
      id: true,
      title: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Jadwal
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Kelola jadwal kegiatan rutin mingguan.
          </p>
        </div>
        <Link
          href="/dashboard/jadwal/baru"
          className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
        >
          Tambah Jadwal Baru
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada jadwal. Klik &ldquo;Tambah Jadwal Baru&rdquo; untuk memulai.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Hari</th>
                <th className="px-4 py-3 font-medium">Waktu</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {dayOfWeekLabels[item.dayOfWeek]}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {item.startTime}
                    {item.endTime && ` – ${item.endTime}`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.status === "PUBLISHED"
                          ? "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {item.status === "PUBLISHED" ? "Terbit" : "Draf"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/jadwal/${item.id}/edit`}
                      className="text-brand-700 dark:text-brand-300 font-medium hover:underline"
                    >
                      Edit
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
