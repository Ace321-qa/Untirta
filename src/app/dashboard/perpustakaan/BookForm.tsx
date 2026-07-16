"use client";

import { useActionState } from "react";

import { saveBookAction, type BookFormState } from "./actions";

type Category = { id: string; name: string };

export function BookForm({
  categories,
  initialValues,
}: {
  categories: Category[];
  initialValues?: {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    fileUrl: string;
    categoryId: string;
    status: "DRAFT" | "PUBLISHED";
  };
}) {
  const [state, formAction, pending] = useActionState<BookFormState, FormData>(
    saveBookAction,
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
          Judul Buku
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
          htmlFor="author"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Penulis
        </label>
        <input
          id="author"
          name="author"
          required
          defaultValue={initialValues?.author}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("author") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("author")}
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
          rows={6}
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
          htmlFor="fileUrl"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          URL Berkas PDF (opsional)
        </label>
        <input
          id="fileUrl"
          name="fileUrl"
          type="url"
          placeholder="https://..."
          defaultValue={initialValues?.fileUrl}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Tanpa berkas, tombol &ldquo;Baca Buku&rdquo; tidak akan tampil di
          halaman publik.
        </p>
        {fieldError("fileUrl") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("fileUrl")}
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
