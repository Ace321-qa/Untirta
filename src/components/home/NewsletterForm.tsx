"use client";

import { useActionState } from "react";

import {
  subscribeNewsletterAction,
  type NewsletterFormState,
} from "@/app/newsletter-actions";

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState<
    NewsletterFormState,
    FormData
  >(subscribeNewsletterAction, undefined);

  const fieldError = (field: string) =>
    state && "fieldErrors" in state
      ? state.fieldErrors?.[field]?.[0]
      : undefined;

  if (state && "success" in state) {
    return (
      <p role="status" className="text-brand-700 dark:text-brand-300 text-sm">
        Terima kasih telah berlangganan! Anda akan mendapatkan kabar terbaru
        dari kami.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-2">
      {/* Honeypot — hidden from real visitors, same pattern as the contact
          form (see docs/DECISIONS.md). */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="newsletter-website">Situs Web</label>
        <input
          id="newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Alamat email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Alamat email Anda"
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Mengirim..." : "Berlangganan"}
        </button>
      </div>
      {state && "error" in state && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {fieldError("email") || state.error}
        </p>
      )}
    </form>
  );
}
