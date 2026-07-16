export type ServiceCardData = {
  name: string;
  description: string;
  link: string | null;
};

export function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {service.name}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {service.description}
      </p>
      {service.link && (
        <a
          href={service.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 dark:text-brand-300 mt-auto pt-2 text-sm font-medium hover:underline"
        >
          Selengkapnya &rarr;
        </a>
      )}
    </div>
  );
}
