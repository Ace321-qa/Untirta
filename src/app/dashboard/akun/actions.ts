"use server";

import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordFormSchema } from "@/lib/validations/account";

export type ChangePasswordState =
  | { error: string; fieldErrors?: Record<string, string[]> }
  | { success: true }
  | undefined;

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Anda harus masuk untuk melakukan tindakan ini." };
  }

  const parsed = changePasswordFormSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: "Periksa kembali data yang Anda masukkan.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    return { error: "Akun tidak ditemukan." };
  }

  const currentPasswordValid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );

  if (!currentPasswordValid) {
    return {
      error: "Kata sandi saat ini salah.",
      fieldErrors: { currentPassword: ["Kata sandi saat ini salah."] },
    };
  }

  const newPasswordHash = await bcrypt.hash(parsed.data.newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newPasswordHash },
  });

  return { success: true };
}
