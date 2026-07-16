"use client";

import { useActionState } from "react";

import { addDivisionAction, type DivisionFormState } from "./actions";

export function DivisionForm({ periodId }: { periodId: string }) {
  const [state, formAction, pending] = useActionState<
    DivisionFormState,
    FormData
  >(addDivisionAction, undefined);

  const fieldError = (field: string) => state?.fieldErrors?.[field]?.[0];

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
    >
      <input type="hidden" name="periodId" value={periodId} />

      <div className="flex min-w-48 flex-1 flex-col gap-1.5">
        <label
          htmlFor="division-name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Tambah Divisi
        </label>
        <input
          id="division-name"
          name="name"
          required
          placeholder="mis. Divisi Kaderisasi"
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("name") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("name")}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menambahkan..." : "Tambah"}
      </button>

      {state?.error && (
        <p
          role="alert"
          className="w-full text-sm text-red-600 dark:text-red-400"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
