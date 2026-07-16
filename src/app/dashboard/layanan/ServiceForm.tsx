"use client";

import { useActionState } from "react";

import { saveServiceAction, type ServiceFormState } from "./actions";

export function ServiceForm({
  initialValues,
}: {
  initialValues?: {
    id: string;
    name: string;
    description: string;
    link: string;
    status: "DRAFT" | "PUBLISHED";
  };
}) {
  const [state, formAction, pending] = useActionState<
    ServiceFormState,
    FormData
  >(saveServiceAction, undefined);

  const fieldError = (field: string) => state?.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {initialValues && (
        <input type="hidden" name="id" value={initialValues.id} />
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Nama Layanan
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initialValues?.name}
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
          htmlFor="description"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={initialValues?.description}
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
          htmlFor="link"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Tautan (opsional)
        </label>
        <input
          id="link"
          name="link"
          type="url"
          placeholder="https://..."
          defaultValue={initialValues?.link}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("link") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("link")}
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
          className="w-fit rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="DRAFT">Draf</option>
          <option value="PUBLISHED">Terbit</option>
        </select>
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
