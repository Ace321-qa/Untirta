import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";

// Prevents build-time prerendering, which would require a database
// connection during the build step itself (not available on some hosts).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Laporan — AKMI Untirta",
  description:
    "Laporan pertanggungjawaban dan dokumen organisasi AKMI Untirta.",
};

export default async function LaporanPage() {
  const reports = await prisma.report.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { year: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      year: true,
      fileUrl: true,
    },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Laporan
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Laporan pertanggungjawaban dan dokumen organisasi AKMI Untirta.
        </p>
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada laporan yang dipublikasikan.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <p className="text-brand-700 dark:text-brand-300 text-xs font-medium tracking-wide uppercase">
                  {report.year}
                </p>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {report.title}
                </h2>
                {report.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {report.description}
                  </p>
                )}
              </div>
              {report.fileUrl && (
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 w-fit shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
                >
                  Unduh Laporan
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
