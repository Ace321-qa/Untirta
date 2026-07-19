import { Container } from "@/components/layout/Container";
import { ReportForm } from "../ReportForm";

export default function NewReportPage() {
  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Tambah Laporan Baru
      </h1>
      <ReportForm />
    </Container>
  );
}
