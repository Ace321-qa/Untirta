import { Container } from "@/components/layout/Container";
import { EventForm } from "../EventForm";

export default function NewEventPage() {
  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Buat Kegiatan Baru
      </h1>
      <EventForm />
    </Container>
  );
}
