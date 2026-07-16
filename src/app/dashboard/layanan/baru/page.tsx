import { Container } from "@/components/layout/Container";
import { ServiceForm } from "../ServiceForm";

export default function NewServicePage() {
  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Tambah Layanan Baru
      </h1>
      <ServiceForm />
    </Container>
  );
}
