"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export type LoginState = { error: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Email atau kata sandi salah." };
      }
      return { error: "Terjadi kesalahan saat masuk. Silakan coba lagi." };
    }
    throw error;
  }
}
