import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { dayOfWeekLabels, dayOfWeekValues } from "@/lib/validations/schedule";

// Prevents build-time prerendering, which would require a database
// connection during the build step itself (not available on some hosts).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jadwal — AKMI Untirta",
  description: "Jadwal kegiatan rutin mingguan AKMI Untirta.",
};

export default async function JadwalPage() {
  const items = await prisma.scheduleItem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    select: {
      id: true,
      title: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      location: true,
      description: true,
    },
  });

  const itemsByDay = dayOfWeekValues.map((day) => ({
    day,
    items: items.filter((item) => item.dayOfWeek === day),
  }));

  return (
    <Container className="flex flex-1 flex-col gap-8 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Jadwal
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Jadwal kegiatan rutin mingguan AKMI Untirta.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada jadwal yang dipublikasikan.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {itemsByDay
            .filter(({ items }) => items.length > 0)
            .map(({ day, items }) => (
              <section key={day} aria-labelledby={`day-${day}`}>
                <h2
                  id={`day-${day}`}
                  className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50"
                >
                  {dayOfWeekLabels[day]}
                </h2>
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-4 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="text-brand-700 dark:text-brand-300 w-32 shrink-0 text-sm font-medium">
                        {item.startTime}
                        {item.endTime && ` – ${item.endTime}`}
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {item.title}
                        </p>
                        {item.location && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {item.location}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm text-zinc-500 dark:text-zinc-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </Container>
  );
}
