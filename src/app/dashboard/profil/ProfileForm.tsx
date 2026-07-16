"use client";

import { useActionState } from "react";

import { saveSiteProfileAction, type SiteProfileFormState } from "./actions";

export function ProfileForm({
  initialValues,
}: {
  initialValues: {
    description: string;
    vision: string;
    mission: string;
    values: string;
  };
}) {
  const [state, formAction, pending] = useActionState<
    SiteProfileFormState,
    FormData
  >(saveSiteProfileAction, undefined);

  const fieldError = (field: string) =>
    state && "fieldErrors" in state
      ? state.fieldErrors?.[field]?.[0]
      : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Deskripsi Singkat
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={initialValues.description}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("description") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("description")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="vision"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Visi
        </label>
        <textarea
          id="vision"
          name="vision"
          rows={3}
          required
          defaultValue={initialValues.vision}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("vision") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("vision")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="mission"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Misi (Markdown, mis. daftar bernomor)
        </label>
        <textarea
          id="mission"
          name="mission"
          rows={6}
          required
          defaultValue={initialValues.mission}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("mission") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("mission")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="values"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Nilai-Nilai (Markdown, mis. daftar poin)
        </label>
        <textarea
          id="values"
          name="values"
          rows={5}
          required
          defaultValue={initialValues.values}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("values") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("values")}
          </p>
        )}
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p role="status" className="text-brand-700 dark:text-brand-300 text-sm">
          Perubahan berhasil disimpan.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 w-fit rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
