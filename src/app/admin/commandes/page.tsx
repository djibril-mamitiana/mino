import { AdminOrdersClient } from "@/components/admin-orders-client";

export const revalidate = 0;

export default function AdminCommandesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Gestion des commandes
      </h1>
      <AdminOrdersClient />
    </div>
  );
}
