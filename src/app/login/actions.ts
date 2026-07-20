"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import {
  isRateLimited,
  recordFailedAttempt,
  resetAttempts,
} from "@/lib/rate-limit";

export type LoginState = { error: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const rawEmail = formData.get("email");
  const email =
    typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (email && isRateLimited(email)) {
    return {
      error: "Terlalu banyak percobaan gagal. Coba lagi dalam 15 menit.",
    };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        if (email) recordFailedAttempt(email);
        return { error: "Email atau kata sandi salah." };
      }
      return { error: "Terjadi kesalahan saat masuk. Silakan coba lagi." };
    }
    // A successful sign-in throws Next.js's internal redirect signal here
    // (not an AuthError) — clear any prior failed attempts before it
    // propagates to actually perform the redirect.
    if (email) resetAttempts(email);
    throw error;
  }
}
