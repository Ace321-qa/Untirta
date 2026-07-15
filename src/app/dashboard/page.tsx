import { auth } from "@/auth";
import { Container } from "@/components/layout/Container";
import { logoutAction } from "./actions";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <Container className="flex flex-1 flex-col gap-4 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Selamat datang, {session?.user?.name}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Peran: {session?.user?.role}
      </p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-fit rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Keluar
        </button>
      </form>
    </Container>
  );
}
