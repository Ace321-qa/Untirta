"use client";

import { useActionState } from "react";

import { saveNewsAction, type NewsFormState } from "./actions";

type Option = { id: string; name: string };

export function NewsForm({
  categories,
  users,
  currentUserId,
  initialValues,
}: {
  categories: Option[];
  users: Option[];
  currentUserId: string;
  initialValues?: {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    featuredImage: string;
    status: "DRAFT" | "PUBLISHED";
    categoryId: string;
    reporterId: string;
    editorId: string;
    eventDate: string;
    location: string;
    sourceAttribution: string;
  };
}) {
  const [state, formAction, pending] = useActionState<NewsFormState, FormData>(
    saveNewsAction,
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
          Judul
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
          htmlFor="excerpt"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Ringkasan (opsional)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={initialValues?.excerpt}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("excerpt") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("excerpt")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="body"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Isi Berita (Markdown)
        </label>
        <textarea
          id="body"
          name="body"
          rows={14}
          required
          defaultValue={initialValues?.body}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("body") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("body")}
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
            htmlFor="categoryId"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Kategori (opsional)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={initialValues?.categoryId ?? ""}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">Tanpa kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reporterId"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Reporter
          </label>
          <select
            id="reporterId"
            name="reporterId"
            defaultValue={initialValues?.reporterId ?? currentUserId}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="editorId"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Editor (opsional)
          </label>
          <select
            id="editorId"
            name="editorId"
            defaultValue={initialValues?.editorId ?? ""}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">Tidak ada</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="eventDate"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Tanggal Kejadian (opsional)
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={initialValues?.eventDate}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
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
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="sourceAttribution"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Sumber (opsional)
        </label>
        <input
          id="sourceAttribution"
          name="sourceAttribution"
          placeholder="mis. Humas Untirta"
          defaultValue={initialValues?.sourceAttribution}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
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
