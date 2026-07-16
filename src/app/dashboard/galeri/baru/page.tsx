import { Container } from "@/components/layout/Container";
import { AlbumForm } from "../AlbumForm";

export default function NewAlbumPage() {
  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Buat Album Baru
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Simpan detail album terlebih dahulu — Anda dapat menambahkan foto
        setelah album dibuat.
      </p>
      <AlbumForm />
    </Container>
  );
}
