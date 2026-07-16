"use client";

import { useActionState } from "react";

import { saveEventAction, type EventFormState } from "./actions";

export function EventForm({
  initialValues,
}: {
  initialValues?: {
    id: string;
    title: string;
    description: string;
    featuredImage: string;
    status: "DRAFT" | "PUBLISHED";
    startAt: string;
    endAt: string;
    venue: string;
    mapsUrl: string;
    organizer: string;
    registrationLink: string;
    registrationDeadline: string;
    participantQuota: string;
    documentUrl: string;
  };
}) {
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    saveEventAction,
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
          Judul Kegiatan
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
          Deskripsi (Markdown)
        </label>
        <textarea
          id="description"
          name="description"
          rows={10}
          required
          defaultValue={initialValues?.description}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("description") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("description")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="featuredImage"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          URL Gambar Utama (opsional)
        </label>
        <input
          id="featuredImage"
          name="featuredImage"
          type="url"
          placeholder="https://..."
          defaultValue={initialValues?.featuredImage}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("featuredImage") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("featuredImage")}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="startAt"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Mulai
          </label>
          <input
            id="startAt"
            name="startAt"
            type="datetime-local"
            required
            defaultValue={initialValues?.startAt}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("startAt") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("startAt")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="endAt"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Selesai (opsional)
          </label>
          <input
            id="endAt"
            name="endAt"
            type="datetime-local"
            defaultValue={initialValues?.endAt}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="venue"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tempat (opsional)
          </label>
          <input
            id="venue"
            name="venue"
            defaultValue={initialValues?.venue}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="mapsUrl"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tautan Google Maps (opsional)
          </label>
          <input
            id="mapsUrl"
            name="mapsUrl"
            type="url"
            placeholder="https://maps.google.com/..."
            defaultValue={initialValues?.mapsUrl}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("mapsUrl") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("mapsUrl")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="organizer"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Penyelenggara (opsional)
        </label>
        <input
          id="organizer"
          name="organizer"
          placeholder="mis. Divisi Kaderisasi AKMI Untirta"
          defaultValue={initialValues?.organizer}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="registrationLink"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tautan Pendaftaran (opsional)
          </label>
          <input
            id="registrationLink"
            name="registrationLink"
            type="url"
            placeholder="https://forms.gle/..."
            defaultValue={initialValues?.registrationLink}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("registrationLink") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("registrationLink")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="registrationDeadline"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Batas Pendaftaran (opsional)
          </label>
          <input
            id="registrationDeadline"
            name="registrationDeadline"
            type="datetime-local"
            defaultValue={initialValues?.registrationDeadline}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="participantQuota"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Kuota Peserta (opsional)
          </label>
          <input
            id="participantQuota"
            name="participantQuota"
            type="number"
            min={1}
            defaultValue={initialValues?.participantQuota}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("participantQuota") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("participantQuota")}
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
          htmlFor="documentUrl"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Tautan Dokumen (opsional)
        </label>
        <input
          id="documentUrl"
          name="documentUrl"
          type="url"
          placeholder="https://..."
          defaultValue={initialValues?.documentUrl}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("documentUrl") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("documentUrl")}
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
