import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@akmiuntirta.test" },
    update: {},
    create: {
      name: "Admin AKMI Untirta",
      email: "admin@akmiuntirta.test",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });

  console.log("Seeded user:", admin.email);
  console.log(
    'Sample login password is "ChangeMe123!" — for local development only, never use this in production.',
  );

  const categories = [
    { name: "Kajian Islam", slug: "kajian-islam" },
    { name: "Kegiatan", slug: "kegiatan" },
    { name: "Pengumuman", slug: "pengumuman" },
  ];
  for (const category of categories) {
    await prisma.articleCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log("Seeded categories:", categories.map((c) => c.name).join(", "));

  const kajianCategory = await prisma.articleCategory.findUniqueOrThrow({
    where: { slug: "kajian-islam" },
  });

  const sampleArticle = await prisma.article.upsert({
    where: { slug: "selamat-datang-di-website-akmi-untirta" },
    update: {},
    create: {
      title: "Selamat Datang di Website AKMI Untirta",
      slug: "selamat-datang-di-website-akmi-untirta",
      excerpt:
        "Website resmi AKMI Untirta kini hadir sebagai pusat informasi kegiatan, kajian, dan dakwah kampus.",
      body: "Ini adalah artikel contoh untuk menguji fitur Artikel. Anda dapat menggunakan **Markdown** di sini, termasuk daftar:\n\n- Judul dan subjudul\n- Teks tebal dan miring\n- Tautan\n\nKonten sesungguhnya akan ditambahkan oleh admin melalui dashboard.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: kajianCategory.id,
    },
  });
  console.log("Seeded article:", sampleArticle.title);

  const newsCategories = [
    { name: "Kampus", slug: "kampus" },
    { name: "Organisasi", slug: "organisasi" },
  ];
  for (const category of newsCategories) {
    await prisma.newsCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(
    "Seeded news categories:",
    newsCategories.map((c) => c.name).join(", "),
  );

  const organisasiCategory = await prisma.newsCategory.findUniqueOrThrow({
    where: { slug: "organisasi" },
  });

  const sampleNews = await prisma.news.upsert({
    where: { slug: "akmi-untirta-gelar-rapat-kerja-tahunan" },
    update: {},
    create: {
      title: "AKMI Untirta Gelar Rapat Kerja Tahunan",
      slug: "akmi-untirta-gelar-rapat-kerja-tahunan",
      excerpt:
        "Pengurus AKMI Untirta menggelar rapat kerja tahunan untuk menyusun program kerja periode ini.",
      body: "Ini adalah berita contoh untuk menguji fitur Berita. Konten sesungguhnya akan ditambahkan oleh admin melalui dashboard.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      eventDate: new Date(),
      location: "Sekretariat AKMI Untirta",
      reporterId: admin.id,
      categoryId: organisasiCategory.id,
    },
  });
  console.log("Seeded news:", sampleNews.title);

  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const upcomingEvent = await prisma.event.upsert({
    where: { slug: "kajian-rutin-pekanan" },
    update: {},
    create: {
      title: "Kajian Rutin Pekanan",
      slug: "kajian-rutin-pekanan",
      description:
        "Kajian rutin pekanan AKMI Untirta terbuka untuk seluruh mahasiswa Muslim Untirta. Konten sesungguhnya akan ditambahkan oleh admin melalui dashboard.",
      status: "PUBLISHED",
      startAt: oneWeekFromNow,
      venue: "Masjid Kampus Untirta",
      organizer: "Divisi Kaderisasi AKMI Untirta",
      participantQuota: 100,
    },
  });
  console.log("Seeded upcoming event:", upcomingEvent.title);

  const pastEvent = await prisma.event.upsert({
    where: { slug: "seminar-kemuslimahan" },
    update: {},
    create: {
      title: "Seminar Kemuslimahan",
      slug: "seminar-kemuslimahan",
      description:
        "Seminar kemuslimahan yang telah diselenggarakan AKMI Untirta. Konten sesungguhnya akan ditambahkan oleh admin melalui dashboard.",
      status: "PUBLISHED",
      startAt: oneMonthAgo,
      venue: "Aula Fakultas",
      organizer: "Divisi Kemuslimahan AKMI Untirta",
    },
  });
  console.log("Seeded past event:", pastEvent.title);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
