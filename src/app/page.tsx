import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/home/Section";
import { PlaceholderCard } from "@/components/home/PlaceholderCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { NewsCard } from "@/components/news/NewsCard";
import { EventCard } from "@/components/events/EventCard";
import { siteContact } from "@/lib/navigation";
import { prisma } from "@/lib/prisma";

// The "upcoming events" section depends on the current time, not just
// database writes — revalidate hourly as a backstop alongside the
// on-demand revalidatePath("/") calls in each content type's save action.
export const revalidate = 3600;

export default async function Home() {
  const [latestArticles, latestNews, upcomingEvents] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        category: { select: { name: true } },
      },
    }),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        category: { select: { name: true } },
      },
    }),
    prisma.event.findMany({
      where: { status: "PUBLISHED", startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        featuredImage: true,
        startAt: true,
        venue: true,
      },
    }),
  ]);

  return (
    <>
      <section className="bg-brand-50 dark:bg-brand-950 border-b border-zinc-200 dark:border-zinc-800">
        <Container className="flex flex-col items-center gap-4 py-16 text-center sm:py-24">
          <Image
            src="/brand/logo.png"
            alt="AKMI Untirta"
            width={96}
            height={96}
            priority
          />
          <h1 className="max-w-2xl text-3xl font-semibold text-zinc-900 sm:text-5xl dark:text-zinc-50">
            AKMI Untirta
          </h1>
          <p className="max-w-xl text-base text-zinc-700 sm:text-lg dark:text-zinc-300">
            Aktivitas Keagamaan Mahasiswa Islam Universitas Sultan Ageng
            Tirtayasa — wadah dakwah, keilmuan, dan pelayanan bagi mahasiswa
            Muslim di lingkungan kampus.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/tentang"
              className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
            >
              Tentang Kami
            </Link>
            <Link
              href="/tentang/kontak"
              className="border-brand-600 text-brand-700 dark:text-brand-300 dark:hover:bg-brand-900 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white"
            >
              Hubungi Kami
            </Link>
          </div>
        </Container>
      </section>

      <Section
        id="program-utama"
        title="Program Utama"
        description="Program atau pengumuman unggulan yang sedang berjalan."
      >
        <PlaceholderCard label="Program atau pengumuman utama akan tampil di sini setelah modul Beranda/Site Settings dibangun." />
      </Section>

      <Section
        id="artikel-terbaru"
        title="Artikel Terbaru"
        viewAllHref="/artikel"
      >
        {latestArticles.length === 0 ? (
          <PlaceholderCard label="Artikel terbaru akan tampil di sini setelah artikel pertama dipublikasikan." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </Section>

      <Section id="berita-terbaru" title="Berita Terbaru" viewAllHref="/berita">
        {latestNews.length === 0 ? (
          <PlaceholderCard label="Berita terbaru akan tampil di sini setelah berita pertama dipublikasikan." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((news) => (
              <NewsCard key={news.slug} news={news} />
            ))}
          </div>
        )}
      </Section>

      <Section
        id="kegiatan-mendatang"
        title="Kegiatan Mendatang"
        viewAllHref="/kegiatan"
      >
        {upcomingEvents.length === 0 ? (
          <PlaceholderCard label="Kegiatan mendatang akan tampil di sini setelah kegiatan pertama dijadwalkan." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </Section>

      <Section
        id="galeri-pilihan"
        title="Galeri Pilihan"
        viewAllHref="/tentang/galeri"
      >
        <PlaceholderCard label="Foto kegiatan pilihan akan tampil di sini setelah modul Galeri dibangun." />
      </Section>

      <Section id="layanan" title="Layanan" viewAllHref="/layanan">
        <PlaceholderCard label="Direktori layanan AKMI Untirta akan tampil di sini." />
      </Section>

      <section className="bg-brand-600 border-y border-zinc-200 dark:border-zinc-800">
        <Container className="flex flex-col items-center gap-4 py-12 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Ingin ikut berkontribusi bersama kami?
          </h2>
          <p className="text-brand-50 max-w-xl text-sm">
            Ikuti kegiatan, program, dan kabar terbaru dari AKMI Untirta.
          </p>
          <Link
            href="/kegiatan"
            className="text-brand-700 hover:bg-brand-50 rounded-lg bg-white px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Lihat Kegiatan Kami
          </Link>
        </Container>
      </section>

      <Section
        id="newsletter"
        title="Berlangganan Kabar Terbaru"
        description="Dapatkan info kegiatan dan artikel terbaru langsung ke email Anda."
      >
        <form className="flex max-w-md flex-col gap-2 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Alamat email
          </label>
          <input
            id="newsletter-email"
            type="email"
            disabled
            placeholder="Alamat email Anda"
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-500 disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
          />
          <button
            type="button"
            disabled
            className="rounded-lg bg-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
          >
            Segera Hadir
          </button>
        </form>
      </Section>

      <Section id="kontak-singkat" title="Kontak">
        <a
          href={`mailto:${siteContact.email}`}
          className="text-brand-700 dark:text-brand-300 inline-flex items-center gap-2 text-base hover:underline"
        >
          <Mail aria-hidden="true" className="size-5" />
          {siteContact.email}
        </a>
      </Section>
    </>
  );
}
