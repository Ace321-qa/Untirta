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

  const sampleAlbum = await prisma.galleryAlbum.upsert({
    where: { slug: "kajian-rutin-pekanan-2026" },
    update: {},
    create: {
      title: "Kajian Rutin Pekanan 2026",
      slug: "kajian-rutin-pekanan-2026",
      description:
        "Dokumentasi foto contoh untuk menguji fitur Galeri. Foto sesungguhnya akan ditambahkan oleh admin melalui dashboard.",
      status: "PUBLISHED",
      eventDate: oneMonthAgo,
      coverImage: null,
    },
  });
  console.log("Seeded gallery album:", sampleAlbum.title);

  const samplePhotos = [
    {
      url: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800",
      altText: "Suasana kajian rutin pekanan di masjid kampus",
      caption: "Peserta kajian rutin pekanan",
      displayOrder: 0,
    },
    {
      url: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800",
      altText: "Pemateri menyampaikan kajian di depan peserta",
      caption: "Pemateri kajian",
      displayOrder: 1,
    },
  ];
  for (const photo of samplePhotos) {
    const existing = await prisma.galleryImage.findFirst({
      where: { albumId: sampleAlbum.id, url: photo.url },
      select: { id: true },
    });
    if (!existing) {
      await prisma.galleryImage.create({
        data: { ...photo, albumId: sampleAlbum.id },
      });
    }
  }
  console.log("Seeded gallery photos:", samplePhotos.length);

  const siteProfile = await prisma.siteProfile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      description:
        "AKMI Untirta adalah unit kegiatan mahasiswa yang mewadahi aktivitas keagamaan Islam di lingkungan Universitas Sultan Ageng Tirtayasa, dengan fokus pada dakwah kampus, pembinaan mahasiswa Muslim, dan pengembangan potensi diri berlandaskan nilai-nilai Islam.",
      vision:
        "Menjadi wadah keislaman mahasiswa yang unggul dalam dakwah, keilmuan, dan pelayanan umat di lingkungan kampus Untirta.",
      mission:
        "1. Menyelenggarakan kegiatan dakwah dan kajian keislaman yang mudah diakses seluruh mahasiswa.\n2. Membina kader dakwah kampus yang militan, berakhlak, dan berdaya guna.\n3. Membangun sinergi dengan lembaga kemahasiswaan dan masyarakat kampus lainnya.",
      values:
        "- Ukhuwah (persaudaraan)\n- Amanah\n- Militansi dakwah\n- Profesionalisme\n- Pelayanan",
    },
  });
  console.log("Seeded site profile:", siteProfile.id);

  const activePeriod = await prisma.managementPeriod.upsert({
    where: { id: "period-2025-2026" },
    update: {},
    create: {
      id: "period-2025-2026",
      label: "2025/2026",
      startYear: 2025,
      endYear: 2026,
      isActive: true,
    },
  });
  console.log("Seeded management period:", activePeriod.label);

  const intiDivision = await prisma.division.upsert({
    where: { id: "division-inti-2025-2026" },
    update: {},
    create: {
      id: "division-inti-2025-2026",
      periodId: activePeriod.id,
      name: "Pengurus Inti",
      displayOrder: 0,
    },
  });
  const kaderisasiDivision = await prisma.division.upsert({
    where: { id: "division-kaderisasi-2025-2026" },
    update: {},
    create: {
      id: "division-kaderisasi-2025-2026",
      periodId: activePeriod.id,
      name: "Divisi Kaderisasi",
      displayOrder: 1,
    },
  });
  console.log(
    "Seeded divisions:",
    intiDivision.name,
    ",",
    kaderisasiDivision.name,
  );

  const officers = [
    {
      id: "officer-ketua-2025-2026",
      divisionId: intiDivision.id,
      name: "Ahmad Fauzan",
      position: "Ketua Umum",
      displayOrder: 0,
    },
    {
      id: "officer-sekretaris-2025-2026",
      divisionId: intiDivision.id,
      name: "Siti Nur Halimah",
      position: "Sekretaris Umum",
      displayOrder: 1,
    },
    {
      id: "officer-kaderisasi-2025-2026",
      divisionId: kaderisasiDivision.id,
      name: "Muhammad Rizki",
      position: "Kepala Divisi Kaderisasi",
      displayOrder: 0,
    },
  ];
  for (const officer of officers) {
    await prisma.officer.upsert({
      where: { id: officer.id },
      update: {},
      create: officer,
    });
  }
  console.log("Seeded officers:", officers.length);

  const bookCategories = [
    { name: "Aqidah", slug: "aqidah" },
    { name: "Fiqih", slug: "fiqih" },
    { name: "Sirah Nabawiyah", slug: "sirah-nabawiyah" },
  ];
  for (const category of bookCategories) {
    await prisma.bookCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log(
    "Seeded book categories:",
    bookCategories.map((c) => c.name).join(", "),
  );

  const aqidahCategory = await prisma.bookCategory.findUniqueOrThrow({
    where: { slug: "aqidah" },
  });

  const sampleBook = await prisma.book.upsert({
    where: { slug: "pengantar-aqidah-islam" },
    update: {},
    create: {
      title: "Pengantar Aqidah Islam",
      slug: "pengantar-aqidah-islam",
      author: "Tim Penulis AKMI Untirta",
      description:
        "Buku contoh untuk menguji fitur Perpustakaan. Deskripsi sesungguhnya akan ditambahkan oleh admin melalui dashboard.",
      status: "PUBLISHED",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      categoryId: aqidahCategory.id,
    },
  });
  console.log("Seeded book:", sampleBook.title);

  const services = [
    {
      id: "service-konsultasi-keagamaan",
      name: "Konsultasi Keagamaan",
      description:
        "Layanan konsultasi seputar permasalahan keagamaan bagi mahasiswa Muslim Untirta.",
      link: null,
      displayOrder: 0,
    },
    {
      id: "service-kajian-rutin",
      name: "Kajian Rutin",
      description:
        "Kajian keislaman rutin yang terbuka untuk seluruh mahasiswa, diselenggarakan secara berkala.",
      link: null,
      displayOrder: 1,
    },
    {
      id: "service-pendampingan-mualaf",
      name: "Pendampingan Mualaf",
      description:
        "Bimbingan dan pendampingan bagi mahasiswa yang baru memeluk Islam.",
      link: null,
      displayOrder: 2,
    },
  ];
  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: { ...service, status: "PUBLISHED" },
    });
  }
  console.log("Seeded services:", services.length);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
