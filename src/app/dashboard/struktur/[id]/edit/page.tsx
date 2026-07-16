import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { PeriodForm } from "../../PeriodForm";
import { DivisionForm } from "../../DivisionForm";
import { OfficerForm } from "../../OfficerForm";
import { deleteDivisionAction, deleteOfficerAction } from "../../actions";

export default async function EditPeriodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const period = await prisma.managementPeriod.findUnique({
    where: { id },
    select: {
      id: true,
      label: true,
      startYear: true,
      endYear: true,
      isActive: true,
      divisions: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          name: true,
          officers: {
            orderBy: { displayOrder: "asc" },
            select: { id: true, name: true, position: true },
          },
        },
      },
    },
  });

  if (!period) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-10 py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Edit Periode
        </h1>
        <PeriodForm
          initialValues={{
            id: period.id,
            label: period.label,
            startYear: String(period.startYear),
            endYear: String(period.endYear),
            isActive: period.isActive,
          }}
        />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Divisi & Anggota
        </h2>

        {period.divisions.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Belum ada divisi pada periode ini.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {period.divisions.map((division) => (
              <div
                key={division.id}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {division.name}
                  </h3>
                  <form action={deleteDivisionAction}>
                    <input
                      type="hidden"
                      name="divisionId"
                      value={division.id}
                    />
                    <button
                      type="submit"
                      className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Hapus Divisi
                    </button>
                  </form>
                </div>

                {division.officers.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Belum ada anggota.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {division.officers.map((officer) => (
                      <li
                        key={officer.id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-4 py-2.5 dark:bg-zinc-900"
                      >
                        <span className="text-sm text-zinc-900 dark:text-zinc-100">
                          {officer.name}{" "}
                          <span className="text-zinc-500 dark:text-zinc-500">
                            — {officer.position}
                          </span>
                        </span>
                        <form action={deleteOfficerAction}>
                          <input
                            type="hidden"
                            name="officerId"
                            value={officer.id}
                          />
                          <button
                            type="submit"
                            className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                          >
                            Hapus
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                <OfficerForm divisionId={division.id} />
              </div>
            ))}
          </div>
        )}

        <DivisionForm periodId={period.id} />
      </div>
    </Container>
  );
}
