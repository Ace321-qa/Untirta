import { Container } from "@/components/layout/Container";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-brand-700 dark:text-brand-300 text-sm font-medium tracking-wide uppercase">
        Segera hadir
      </p>
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      <p className="max-w-md text-base text-zinc-600 dark:text-zinc-400">
        {description ??
          "Halaman ini sedang dalam pengembangan dan akan segera tersedia."}
      </p>
    </Container>
  );
}
