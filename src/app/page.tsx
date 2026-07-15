const brandSwatches = [
  "bg-brand-50",
  "bg-brand-100",
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-400",
  "bg-brand-500",
  "bg-brand-600",
  "bg-brand-700",
  "bg-brand-800",
  "bg-brand-900",
  "bg-brand-950",
];

const accentSwatches = [
  "bg-accent-50",
  "bg-accent-100",
  "bg-accent-200",
  "bg-accent-300",
  "bg-accent-400",
  "bg-accent-500",
  "bg-accent-600",
  "bg-accent-700",
  "bg-accent-800",
  "bg-accent-900",
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-brand-700 dark:text-brand-300 text-sm font-medium tracking-wide uppercase">
          Tahap pembangunan — pratinjau design system
        </p>
        <h1 className="text-brand-950 dark:text-brand-50 text-3xl font-semibold sm:text-4xl">
          Website AKMI Untirta
        </h1>
        <p className="mx-auto max-w-md text-base text-zinc-600 dark:text-zinc-400">
          Halaman ini menampilkan token warna, tipografi, dan komponen dasar
          yang akan dipakai di seluruh situs. Tampilan akhir akan dibangun
          bertahap pada fase berikutnya.
        </p>
      </header>

      <section aria-labelledby="colors-heading" className="flex flex-col gap-3">
        <h2
          id="colors-heading"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Warna utama (Brand)
        </h2>
        <div className="shadow-brand-sm flex overflow-hidden rounded-xl">
          {brandSwatches.map((swatch) => (
            <div key={swatch} className={`h-12 flex-1 ${swatch}`} />
          ))}
        </div>

        <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Warna aksen (Accent)
        </h2>
        <div className="shadow-brand-sm flex overflow-hidden rounded-xl">
          {accentSwatches.map((swatch) => (
            <div key={swatch} className={`h-12 flex-1 ${swatch}`} />
          ))}
        </div>
      </section>

      <section aria-labelledby="type-heading" className="flex flex-col gap-2">
        <h2
          id="type-heading"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Tipografi
        </h2>
        <p className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          Judul Besar
        </p>
        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Judul Bagian
        </p>
        <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
          Judul Kecil
        </p>
        <p className="text-base text-zinc-700 dark:text-zinc-300">
          Teks paragraf standar untuk artikel, berita, dan deskripsi kegiatan.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Teks kecil untuk keterangan tambahan, tanggal, atau label.
        </p>
      </section>

      <section
        aria-labelledby="components-heading"
        className="flex flex-col gap-4"
      >
        <h2
          id="components-heading"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Contoh komponen dasar
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Tombol Utama
          </button>
          <button
            type="button"
            className="border-brand-600 text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-950 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Tombol Sekunder
          </button>
        </div>
        <div className="shadow-brand-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-brand-700 dark:text-brand-300 text-sm font-medium">
            Contoh kartu
          </p>
          <p className="mt-1 text-base text-zinc-700 dark:text-zinc-300">
            Kartu ini menunjukkan sudut membulat dan bayangan bertema hijau yang
            akan dipakai berulang di seluruh situs.
          </p>
        </div>
      </section>
    </main>
  );
}
