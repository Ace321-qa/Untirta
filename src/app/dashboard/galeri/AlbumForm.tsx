"use client";

import { useActionState } from "react";

import { saveAlbumAction, type AlbumFormState } from "./actions";

export function AlbumForm({
  initialValues,
}: {
  initialValues?: {
    id: string;
    title: string;
    description: string;
    eventDate: string;
    coverImage: string;
    videoUrl: string;
    status: "DRAFT" | "PUBLISHED";
  };
}) {
  const [state, formAction, pending] = useActionState<AlbumFormState, FormData>(
    saveAlbumAction,
    undefined,
  );

  const fieldError = (field: string) => state?.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {initialValues && (
        <input type="hidden" name="id" value={initialValues.id} />
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="title"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Judul Album
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initialValues?.title}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("title") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("title")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Deskripsi (opsional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialValues?.description}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("description") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("description")}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="eventDate"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tanggal Kegiatan (opsional)
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={initialValues?.eventDate}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("eventDate") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("eventDate")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="status"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initialValues?.status ?? "DRAFT"}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="DRAFT">Draf</option>
            <option value="PUBLISHED">Terbit</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="coverImage"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          URL Gambar Sampul (opsional)
        </label>
        <input
          id="coverImage"
          name="coverImage"
          type="url"
          placeholder="https://..."
          defaultValue={initialValues?.coverImage}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("coverImage") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("coverImage")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="videoUrl"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Tautan Video (opsional)
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          placeholder="https://youtube.com/..."
          defaultValue={initialValues?.videoUrl}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("videoUrl") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("videoUrl")}
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
        className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 w-fit rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
