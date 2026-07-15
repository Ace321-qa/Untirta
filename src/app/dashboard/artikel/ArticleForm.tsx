"use client";

import { useActionState } from "react";

import { saveArticleAction, type ArticleFormState } from "./actions";

type Category = { id: string; name: string };

export function ArticleForm({
  categories,
  initialValues,
}: {
  categories: Category[];
  initialValues?: {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    featuredImage: string;
    status: "DRAFT" | "PUBLISHED";
    categoryId: string;
    tags: string;
  };
}) {
  const [state, formAction, pending] = useActionState<
    ArticleFormState,
    FormData
  >(saveArticleAction, undefined);

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
          Isi Artikel (Markdown)
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
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Unggah berkas gambar langsung akan tersedia di pembaruan mendatang.
        </p>
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

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="tags"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Tag (pisahkan dengan koma, opsional)
        </label>
        <input
          id="tags"
          name="tags"
          placeholder="dakwah, kajian, mahasiswa"
          defaultValue={initialValues?.tags}
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
