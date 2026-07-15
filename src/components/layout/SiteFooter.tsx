import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { footerQuickLinks, siteContact } from "@/lib/navigation";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/logo.png"
              alt="AKMI Untirta"
              width={32}
              height={32}
            />
            <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              AKMI Untirta
            </span>
          </div>
          <p className="max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
            Aktivitas Keagamaan Mahasiswa Islam Universitas Sultan Ageng
            Tirtayasa.
          </p>
          <ul className="flex gap-3 pt-1">
            {siteContact.social.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  className="text-brand-700 dark:text-brand-300 text-sm font-medium hover:underline"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Tautan cepat" className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Tautan Cepat
          </h2>
          <ul className="flex flex-col gap-2">
            {footerQuickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-brand-700 dark:hover:text-brand-300 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Kontak
          </h2>
          <a
            href={`mailto:${siteContact.email}`}
            className="hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
          >
            <Mail aria-hidden="true" className="size-4 shrink-0" />
            {siteContact.email}
          </a>
        </div>
      </Container>

      <div className="border-t border-zinc-200 py-4 dark:border-zinc-800">
        <Container>
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
            © {year} AKMI Untirta. Hak cipta dilindungi.
          </p>
        </Container>
      </div>
    </footer>
  );
}
