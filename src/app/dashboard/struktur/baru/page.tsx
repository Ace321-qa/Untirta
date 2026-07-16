import { Container } from "@/components/layout/Container";
import { PeriodForm } from "../PeriodForm";

export default function NewPeriodPage() {
  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Buat Periode Baru
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Simpan periode terlebih dahulu — Anda dapat menambahkan divisi dan
        anggota setelah periode dibuat.
      </p>
      <PeriodForm />
    </Container>
  );
}
