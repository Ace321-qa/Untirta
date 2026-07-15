export type NavLink = {
  label: string;
  href: string;
};

export type NavItem =
  | NavLink
  | {
      label: string;
      items: NavLink[];
    };

/**
 * Single source of truth for the public site's navigation structure.
 * Confirmed with the client 2026-07-15 (see docs/FEATURES.md §1).
 */
export const mainNavigation: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Tentang Kami",
    items: [
      { label: "Profil", href: "/tentang" },
      { label: "Struktur Pengurus", href: "/tentang/struktur" },
      { label: "Hubungi Kami", href: "/tentang/kontak" },
      { label: "Galeri", href: "/tentang/galeri" },
    ],
  },
  { label: "Artikel", href: "/artikel" },
  { label: "Berita", href: "/berita" },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Perpustakaan", href: "/perpustakaan" },
  { label: "Layanan", href: "/layanan" },
  {
    label: "Lainnya",
    items: [
      { label: "Jadwal", href: "/jadwal" },
      { label: "Laporan", href: "/laporan" },
    ],
  },
];

export function isNavGroup(
  item: NavItem,
): item is Extract<NavItem, { items: NavLink[] }> {
  return "items" in item;
}

export const footerQuickLinks: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Artikel", href: "/artikel" },
  { label: "Berita", href: "/berita" },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Perpustakaan", href: "/perpustakaan" },
  { label: "Layanan", href: "/layanan" },
];

export const siteContact = {
  email: "humedakmi2026@gmail.com",
  // Exact social handles pending confirmation — see docs/DECISIONS.md.
  social: [
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};
