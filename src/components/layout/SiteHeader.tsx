"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { isNavGroup, mainNavigation } from "@/lib/navigation";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/brand/logo.png"
            alt="AKMI Untirta"
            width={36}
            height={36}
            priority
          />
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            AKMI Untirta
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNavigation.map((item) =>
              isNavGroup(item) ? (
                <li key={item.label}>
                  <details className="group relative">
                    <summary className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className="size-4 transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <div className="shadow-brand-md absolute top-full left-0 z-50 mt-1 w-56 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                      {item.items.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 block rounded-md px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <form
          action="/cari"
          method="get"
          role="search"
          className="hidden items-center gap-1 md:flex"
        >
          <label htmlFor="site-search" className="sr-only">
            Cari
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Cari..."
            className="w-40 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 rounded-md p-2 text-zinc-700 dark:text-zinc-300"
          >
            <span className="sr-only">Cari</span>
            <Search aria-hidden="true" className="size-4" />
          </button>
        </form>

        <button
          type="button"
          className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 rounded-md p-2 text-zinc-700 md:hidden dark:text-zinc-300"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">
            {mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          </span>
          {mobileOpen ? (
            <X aria-hidden="true" className="size-6" />
          ) : (
            <Menu aria-hidden="true" className="size-6" />
          )}
        </button>
      </Container>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navigasi utama (mobile)"
          className="border-t border-zinc-200 md:hidden dark:border-zinc-800"
        >
          <Container className="flex flex-col gap-1 py-3">
            <form
              action="/cari"
              method="get"
              role="search"
              className="flex items-center gap-1 pb-2"
            >
              <label htmlFor="site-search-mobile" className="sr-only">
                Cari
              </label>
              <input
                id="site-search-mobile"
                name="q"
                type="search"
                placeholder="Cari..."
                className="flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <button
                type="submit"
                className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 rounded-md p-2 text-zinc-700 dark:text-zinc-300"
              >
                <span className="sr-only">Cari</span>
                <Search aria-hidden="true" className="size-4" />
              </button>
            </form>
            {mainNavigation.map((item) =>
              isNavGroup(item) ? (
                <details key={item.label} className="group">
                  <summary className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <div className="flex flex-col gap-1 py-1 pl-4">
                    {item.items.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 block rounded-md px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {item.label}
                </Link>
              ),
            )}
          </Container>
        </nav>
      )}
    </header>
  );
}
