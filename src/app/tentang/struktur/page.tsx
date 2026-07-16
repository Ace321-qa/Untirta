import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ComingSoon } from "@/components/ComingSoon";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Struktur Pengurus — AKMI Untirta",
  description: "Susunan pengurus dan struktur organisasi AKMI Untirta.",
};

export default async function StrukturPengurusPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string }>;
}) {
  const { periode } = await searchParams;

  const periods = await prisma.managementPeriod.findMany({
    orderBy: { startYear: "desc" },
    select: { id: true, label: true, isActive: true },
  });

  if (periods.length === 0) {
    return (
      <ComingSoon
        title="Struktur Pengurus"
        description="Susunan pengurus dan struktur organisasi per periode akan tampil di sini."
      />
    );
  }

  const selectedPeriodId =
    periode && periods.some((p) => p.id === periode)
      ? periode
      : (periods.find((p) => p.isActive)?.id ?? periods[0].id);

  const period = await prisma.managementPeriod.findUnique({
    where: { id: selectedPeriodId },
    select: {
      label: true,
      divisions: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          name: true,
          officers: {
            orderBy: { displayOrder: "asc" },
            select: { id: true, name: true, position: true, photo: true },
          },
        },
      },
    },
  });

  return (
    <Container className="flex flex-1 flex-col gap-8 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Struktur Pengurus
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Susunan pengurus AKMI Untirta periode {period?.label}.
        </p>
      </div>

      {periods.length > 1 && (
        <nav aria-label="Pilih periode" className="flex flex-wrap gap-2">
          {periods.map((p) => (
            <Link
              key={p.id}
              href={`/tentang/struktur?periode=${p.id}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                p.id === selectedPeriodId
                  ? "bg-brand-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </nav>
      )}

      {!period || period.divisions.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada susunan pengurus untuk periode ini.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {period.divisions.map((division) => (
            <section
              key={division.id}
              aria-labelledby={`division-${division.id}`}
            >
              <h2
                id={`division-${division.id}`}
                className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50"
              >
                {division.name}
              </h2>
              {division.officers.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Belum ada anggota pada divisi ini.
                </p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {division.officers.map((officer) => (
                    <div key={officer.id} className="flex flex-col gap-3">
                      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                        {officer.photo ? (
                          <Image
                            src={officer.photo}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                            AKMI Untirta
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {officer.name}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {officer.position}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
