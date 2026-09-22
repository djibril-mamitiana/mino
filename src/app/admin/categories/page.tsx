import { AdminCategoriesClient } from "@/components/admin-categories-client";

export default function AdminCategoriesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Gestion des catégories
      </h1>
      <AdminCategoriesClient />
    </div>
  );
}
