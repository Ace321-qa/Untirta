"use client";

import { useActionState } from "react";

import { addPhotoAction, type PhotoFormState } from "./actions";

export function PhotoForm({ albumId }: { albumId: string }) {
  const [state, formAction, pending] = useActionState<PhotoFormState, FormData>(
    addPhotoAction,
    undefined,
  );

  const fieldError = (field: string) => state?.fieldErrors?.[field]?.[0];

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
    >
      <input type="hidden" name="albumId" value={albumId} />

      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Tambah Foto
      </h3>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="url"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          URL Gambar
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://..."
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("url") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("url")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="altText"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Teks Alternatif (wajib, untuk aksesibilitas)
        </label>
        <input
          id="altText"
          name="altText"
          required
          placeholder="Deskripsi singkat isi gambar"
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("altText") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("altText")}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="caption"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Keterangan (opsional)
          </label>
          <input
            id="caption"
            name="caption"
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="photographerCredit"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Kredit Fotografer (opsional)
          </label>
          <input
            id="photographerCredit"
            name="photographerCredit"
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 w-fit rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menambahkan..." : "Tambah Foto"}
      </button>
    </form>
  );
}
