import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { siteContact } from "@/lib/navigation";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Hubungi Kami — AKMI Untirta",
  description: "Formulir kontak dan informasi kontak AKMI Untirta.",
};

export default function HubungiKamiPage() {
  return (
    <Container className="flex flex-1 flex-col gap-8 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Hubungi Kami
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Punya pertanyaan atau masukan? Kirimkan pesan Anda melalui formulir di
          bawah ini.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <a
            href={`mailto:${siteContact.email}`}
            className="text-brand-700 dark:text-brand-300 inline-flex w-fit items-center gap-2 text-base hover:underline"
          >
            <Mail aria-hidden="true" className="size-5" />
            {siteContact.email}
          </a>
        </div>

        <ContactForm />
      </div>
    </Container>
  );
}
