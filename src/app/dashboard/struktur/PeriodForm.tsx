"use client";

import { useActionState } from "react";

import { savePeriodAction, type PeriodFormState } from "./actions";

export function PeriodForm({
  initialValues,
}: {
  initialValues?: {
    id: string;
    label: string;
    startYear: string;
    endYear: string;
    isActive: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState<
    PeriodFormState,
    FormData
  >(savePeriodAction, undefined);

  const fieldError = (field: string) => state?.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {initialValues && (
        <input type="hidden" name="id" value={initialValues.id} />
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="label"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Label Periode
        </label>
        <input
          id="label"
          name="label"
          required
          placeholder="mis. 2025/2026"
          defaultValue={initialValues?.label}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("label") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("label")}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="startYear"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tahun Mulai
          </label>
          <input
            id="startYear"
            name="startYear"
            type="number"
            required
            defaultValue={initialValues?.startYear}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("startYear") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("startYear")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="endYear"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tahun Selesai
          </label>
          <input
            id="endYear"
            name="endYear"
            type="number"
            required
            defaultValue={initialValues?.endYear}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("endYear") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("endYear")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="isActive"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Status
        </label>
        <select
          id="isActive"
          name="isActive"
          defaultValue={initialValues?.isActive ? "true" : "false"}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="false">Non-aktif</option>
          <option value="true">Aktif (tampil sebagai periode utama)</option>
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
