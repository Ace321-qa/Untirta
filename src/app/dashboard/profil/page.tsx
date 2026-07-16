import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export default async function DashboardProfilPage() {
  const profile = await prisma.siteProfile.findUnique({
    where: { id: "singleton" },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Profil Organisasi
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Konten ini tampil di halaman publik &ldquo;Tentang Kami&rdquo;
          (/tentang).
        </p>
      </div>
      <ProfileForm
        initialValues={{
          description: profile?.description ?? "",
          vision: profile?.vision ?? "",
          mission: profile?.mission ?? "",
          values: profile?.values ?? "",
        }}
      />
    </Container>
  );
}
