import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { ReportForm } from "../../ReportForm";

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      year: true,
      fileUrl: true,
      status: true,
    },
  });

  if (!report) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Laporan
      </h1>
      <ReportForm
        initialValues={{
          id: report.id,
          title: report.title,
          description: report.description ?? "",
          year: String(report.year),
          fileUrl: report.fileUrl ?? "",
          status: report.status,
        }}
      />
    </Container>
  );
}
