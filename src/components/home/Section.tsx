import type { ReactNode } from "react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";

export function Section({
  id,
  title,
  description,
  viewAllHref,
  viewAllLabel = "Lihat semua",
  children,
}: {
  id: string;
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="py-12">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
          <div>
            <h2
              id={id}
              className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-brand-700 dark:text-brand-300 text-sm font-medium hover:underline"
            >
              {viewAllLabel} &rarr;
            </Link>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
