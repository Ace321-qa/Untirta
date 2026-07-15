export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-emerald-50 px-6 py-24 text-center dark:bg-emerald-950">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
        Tahap pembangunan
      </p>
      <h1 className="text-3xl font-semibold text-emerald-900 dark:text-emerald-50 sm:text-4xl">
        Website AKMI Untirta
      </h1>
      <p className="max-w-md text-base text-emerald-800 dark:text-emerald-200">
        Halaman ini mengonfirmasi bahwa proyek Next.js sudah berjalan dengan
        benar. Tampilan sebenarnya akan dibangun secara bertahap.
      </p>
    </main>
  );
}
