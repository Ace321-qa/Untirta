import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { deleteMessageAction, markMessageReadAction } from "../actions";

export default async function PesanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const message = await prisma.contactMessage.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
  });

  if (!message) notFound();

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <Link
        href="/dashboard/pesan"
        className="text-brand-700 dark:text-brand-300 w-fit text-sm font-medium hover:underline"
      >
        &larr; Kembali ke Pesan Masuk
      </Link>

      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {message.subject || "(Tanpa subjek)"}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {message.name} &lt;{message.email}&gt;
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              {formatDateTime(message.createdAt)}
            </p>
          </div>
          {!message.isRead && (
            <form action={markMessageReadAction}>
              <input type="hidden" name="messageId" value={message.id} />
              <button
                type="submit"
                className="w-fit rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Tandai Sudah Dibaca
              </button>
            </form>
          )}
        </div>

        <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
          {message.message}
        </p>

        <div className="flex gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <a
            href={`mailto:${message.email}`}
            className="bg-brand-600 shadow-brand-sm hover:bg-brand-700 w-fit rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Balas via Email
          </a>
          <form action={deleteMessageAction}>
            <input type="hidden" name="messageId" value={message.id} />
            <button
              type="submit"
              className="w-fit rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-zinc-700 dark:hover:bg-red-950"
            >
              Hapus
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
