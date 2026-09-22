import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const revalidate = 0;

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(categorie ? { category: { slug: categorie } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-stone-900">
          Nos cookies &amp; pâtisseries
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">
          Toutes nos créations sont préparées avec des ingrédients
          sélectionnés et beaucoup de gourmandise.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <a
          href="/produits"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            !categorie
              ? "bg-amber-700 text-white"
              : "bg-white text-stone-600 hover:bg-amber-50"
          }`}
        >
          Tout voir
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/produits?categorie=${cat.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              categorie === cat.slug
                ? "bg-amber-700 text-white"
                : "bg-white text-stone-600 hover:bg-amber-50"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">
          Aucun produit disponible pour le moment dans cette catégorie.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                slug: p.slug,
                name: p.name,
                description: p.description,
                priceCents: p.priceCents,
                imageUrl: p.imageUrl,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
