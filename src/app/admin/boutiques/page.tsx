import { AdminStoresClient } from "@/components/admin-stores-client";

export default function AdminBoutiquesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Gestion des boutiques
      </h1>
      <AdminStoresClient />
    </div>
  );
}
