import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";

export default async function DashboardStrukturPage() {
  const periods = await prisma.managementPeriod.findMany({
    orderBy: { startYear: "desc" },
    select: {
      id: true,
      label: true,
      isActive: true,
      _count: { select: { divisions: true } },
    },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Struktur Pengurus
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Kelola periode kepengurusan, divisi, dan anggota.
          </p>
        </div>
        <Link
          href="/dashboard/struktur/baru"
          className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
        >
          Buat Periode Baru
        </Link>
      </div>

      {periods.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada periode. Klik &ldquo;Buat Periode Baru&rdquo; untuk memulai.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Periode</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Divisi</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {periods.map((period) => (
                <tr key={period.id}>
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {period.label}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        period.isActive
                          ? "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {period.isActive ? "Aktif" : "Non-aktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {period._count.divisions}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/struktur/${period.id}/edit`}
                      className="text-brand-700 dark:text-brand-300 font-medium hover:underline"
                    >
                      Kelola
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
