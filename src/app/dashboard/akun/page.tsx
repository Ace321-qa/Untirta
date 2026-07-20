import { Container } from "@/components/layout/Container";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default function DashboardAkunPage() {
  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Akun Saya
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Ubah kata sandi Anda.
        </p>
      </div>
      <ChangePasswordForm />
    </Container>
  );
}
