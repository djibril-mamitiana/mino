import { prisma } from "@/lib/prisma";
import { AdminProductsClient } from "@/components/admin-products-client";

export const revalidate = 0;

export default async function AdminProduitsPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Gestion des produits
      </h1>
      <AdminProductsClient
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
