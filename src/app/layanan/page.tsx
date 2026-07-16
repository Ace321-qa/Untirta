import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ServiceCard } from "@/components/services/ServiceCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Layanan — AKMI Untirta",
  description: "Direktori layanan AKMI Untirta.",
};

export default async function LayananPage() {
  const services = await prisma.service.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, description: true, link: true },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Layanan
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Direktori layanan AKMI Untirta.
        </p>
      </div>

      {services.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada layanan yang dipublikasikan.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </Container>
  );
}
