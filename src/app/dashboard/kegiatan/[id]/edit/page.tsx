import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { toDateTimeLocalValue } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { EventForm } from "../../EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      featuredImage: true,
      status: true,
      startAt: true,
      endAt: true,
      venue: true,
      mapsUrl: true,
      organizer: true,
      registrationLink: true,
      registrationDeadline: true,
      participantQuota: true,
      documentUrl: true,
    },
  });

  if (!event) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Kegiatan
      </h1>
      <EventForm
        initialValues={{
          id: event.id,
          title: event.title,
          description: event.description,
          featuredImage: event.featuredImage ?? "",
          status: event.status,
          startAt: toDateTimeLocalValue(event.startAt),
          endAt: event.endAt ? toDateTimeLocalValue(event.endAt) : "",
          venue: event.venue ?? "",
          mapsUrl: event.mapsUrl ?? "",
          organizer: event.organizer ?? "",
          registrationLink: event.registrationLink ?? "",
          registrationDeadline: event.registrationDeadline
            ? toDateTimeLocalValue(event.registrationDeadline)
            : "",
          participantQuota: event.participantQuota
            ? String(event.participantQuota)
            : "",
          documentUrl: event.documentUrl ?? "",
        }}
      />
    </Container>
  );
}
