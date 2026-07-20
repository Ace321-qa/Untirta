import { z } from "zod";

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Masukkan kata sandi Anda saat ini."),
    newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter."),
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi baru."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
