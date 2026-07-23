import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";

// Prevents build-time prerendering, which would require a database
// connection during the build step itself (not available on some hosts).
export const dynamic = "force-dynamic";

const staticRoutes = [
  "",
  "/artikel",
  "/berita",
  "/kegiatan",
  "/tentang",
  "/tentang/struktur",
  "/tentang/galeri",
  "/tentang/kontak",
  "/perpustakaan",
  "/layanan",
  "/jadwal",
  "/laporan",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, news, events, books, albums] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, publishedAt: true },
    }),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, publishedAt: true },
    }),
    prisma.event.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    }),
    prisma.book.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    }),
    prisma.galleryAlbum.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    }),
  ]);

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/artikel/${article.slug}`,
      lastModified: article.publishedAt ?? undefined,
    })),
    ...news.map((item) => ({
      url: `${siteUrl}/berita/${item.slug}`,
      lastModified: item.publishedAt ?? undefined,
    })),
    ...events.map((event) => ({
      url: `${siteUrl}/kegiatan/${event.slug}`,
    })),
    ...books.map((book) => ({
      url: `${siteUrl}/perpustakaan/buku/${book.slug}`,
    })),
    ...albums.map((album) => ({
      url: `${siteUrl}/tentang/galeri/${album.slug}`,
    })),
  ];
}
