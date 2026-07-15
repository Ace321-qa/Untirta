import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Masuk — AKMI Untirta",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-16">
      <div className="shadow-brand-md w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-6 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Masuk
        </h1>
        <LoginForm />
      </div>
    </Container>
  );
}
