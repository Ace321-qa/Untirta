"use client";

import { useActionState } from "react";

import { submitContactFormAction, type ContactFormState } from "./actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactFormAction, undefined);

  const fieldError = (field: string) =>
    state && "fieldErrors" in state
      ? state.fieldErrors?.[field]?.[0]
      : undefined;

  if (state && "success" in state) {
    return (
      <p role="status" className="text-brand-700 dark:text-brand-300 text-sm">
        Terima kasih, pesan Anda telah terkirim. Kami akan menghubungi Anda
        melalui email sesegera mungkin.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
      {/* Honeypot — hidden from real visitors, only bots that auto-fill
          every field will populate it. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Situs Web</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Nama
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("name") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("name")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("email") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("email")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="subject"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Subjek (opsional)
        </label>
        <input
          id="subject"
          name="subject"
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("subject") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("subject")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Pesan
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("message") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("message")}
          </p>
        )}
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 w-fit rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}
