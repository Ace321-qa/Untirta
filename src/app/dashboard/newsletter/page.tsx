import { Container } from "@/components/layout/Container";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { deleteSubscriberAction } from "./actions";

export default async function DashboardNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
    select: { id: true, email: true, subscribedAt: true },
  });

  return (
    <Container className="flex flex-1 flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Pelanggan Newsletter
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {subscribers.length} orang berlangganan kabar terbaru.
        </p>
      </div>

      {subscribers.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Belum ada yang berlangganan.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Berlangganan Sejak</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {subscriber.email}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatDateTime(subscriber.subscribedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteSubscriberAction}>
                      <input
                        type="hidden"
                        name="subscriberId"
                        value={subscriber.id}
                      />
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                      >
                        Hapus
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
