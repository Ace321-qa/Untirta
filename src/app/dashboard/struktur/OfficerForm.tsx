"use client";

import { useActionState } from "react";

import { addOfficerAction, type OfficerFormState } from "./actions";

export function OfficerForm({ divisionId }: { divisionId: string }) {
  const [state, formAction, pending] = useActionState<
    OfficerFormState,
    FormData
  >(addOfficerAction, undefined);

  const fieldError = (field: string) => state?.fieldErrors?.[field]?.[0];

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-zinc-200 p-4 dark:border-zinc-700"
    >
      <input type="hidden" name="divisionId" value={divisionId} />

      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Tambah Anggota
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`name-${divisionId}`}
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Nama
          </label>
          <input
            id={`name-${divisionId}`}
            name="name"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("name") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("name")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`position-${divisionId}`}
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            Jabatan
          </label>
          <input
            id={`position-${divisionId}`}
            name="position"
            required
            placeholder="mis. Ketua Umum"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("position") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("position")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`photo-${divisionId}`}
          className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >
          URL Foto (opsional)
        </label>
        <input
          id={`photo-${divisionId}`}
          name="photo"
          type="url"
          placeholder="https://..."
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("photo") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("photo")}
          </p>
        )}
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {pending ? "Menambahkan..." : "Tambah Anggota"}
      </button>
    </form>
  );
}
