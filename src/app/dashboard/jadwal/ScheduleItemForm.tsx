"use client";

import { useActionState } from "react";

import { dayOfWeekLabels, dayOfWeekValues } from "@/lib/validations/schedule";
import { saveScheduleItemAction, type ScheduleItemFormState } from "./actions";

export function ScheduleItemForm({
  initialValues,
}: {
  initialValues?: {
    id: string;
    title: string;
    dayOfWeek: (typeof dayOfWeekValues)[number];
    startTime: string;
    endTime: string;
    location: string;
    description: string;
    status: "DRAFT" | "PUBLISHED";
  };
}) {
  const [state, formAction, pending] = useActionState<
    ScheduleItemFormState,
    FormData
  >(saveScheduleItemAction, undefined);

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

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="dayOfWeek"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Hari
          </label>
          <select
            id="dayOfWeek"
            name="dayOfWeek"
            defaultValue={initialValues?.dayOfWeek ?? "SENIN"}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {dayOfWeekValues.map((day) => (
              <option key={day} value={day}>
                {dayOfWeekLabels[day]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="startTime"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Mulai
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            defaultValue={initialValues?.startTime}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("startTime") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("startTime")}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="endTime"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Selesai (opsional)
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            defaultValue={initialValues?.endTime}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          {fieldError("endTime") && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {fieldError("endTime")}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="location"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Lokasi (opsional)
        </label>
        <input
          id="location"
          name="location"
          defaultValue={initialValues?.location}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
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
          rows={3}
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
