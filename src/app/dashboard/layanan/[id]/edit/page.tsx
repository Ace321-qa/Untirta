import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "../../ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      link: true,
      status: true,
    },
  });

  if (!service) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Layanan
      </h1>
      <ServiceForm
        initialValues={{
          id: service.id,
          name: service.name,
          description: service.description,
          link: service.link ?? "",
          status: service.status,
        }}
      />
    </Container>
  );
}
