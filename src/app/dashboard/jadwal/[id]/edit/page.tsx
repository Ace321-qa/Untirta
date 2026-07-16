import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { ScheduleItemForm } from "../../ScheduleItemForm";

export default async function EditScheduleItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.scheduleItem.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      location: true,
      description: true,
      status: true,
    },
  });

  if (!item) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Jadwal
      </h1>
      <ScheduleItemForm
        initialValues={{
          id: item.id,
          title: item.title,
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime ?? "",
          location: item.location ?? "",
          description: item.description ?? "",
          status: item.status,
        }}
      />
    </Container>
  );
}
