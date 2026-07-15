export function PlaceholderCard({ label }: { label: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-brand-700 dark:text-brand-300 text-xs font-medium tracking-wide uppercase">
        Segera hadir
      </p>
      <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
    </div>
  );
}
