"use client";

import { useActionState } from "react";

import { changePasswordAction, type ChangePasswordState } from "./actions";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<
    ChangePasswordState,
    FormData
  >(changePasswordAction, undefined);

  const fieldError = (field: string) =>
    state && "fieldErrors" in state
      ? state.fieldErrors?.[field]?.[0]
      : undefined;

  if (state && "success" in state) {
    return (
      <p role="status" className="text-brand-700 dark:text-brand-300 text-sm">
        Kata sandi berhasil diubah.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="currentPassword"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Kata Sandi Saat Ini
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("currentPassword") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("currentPassword")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="newPassword"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Kata Sandi Baru
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("newPassword") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("newPassword")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Konfirmasi Kata Sandi Baru
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldError("confirmPassword") && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldError("confirmPassword")}
          </p>
        )}
      </div>

      {state && "error" in state && !fieldError("currentPassword") && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 w-fit rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Ubah Kata Sandi"}
      </button>
    </form>
  );
}
