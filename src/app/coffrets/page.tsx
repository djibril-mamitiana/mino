import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const revalidate = 0;

export default async function CoffretsPage() {
  const category = await prisma.category.findUnique({
    where: { slug: "coffrets-cadeaux" },
    include: {
      products: { where: { active: true }, orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <div>
      <section className="bg-gradient-to-b from-amber-100 to-[#fffaf0] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-serif text-4xl font-bold text-stone-900">
            Coffrets cadeaux
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-stone-600">
            Offrez une expérience gourmande. Nos coffrets réunissent nos
            meilleurs cookies et pâtisseries dans un écrin soigné, prêts à
            être offerts en toute occasion.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {!category || category.products.length === 0 ? (
          <p className="text-center text-stone-500">
            Nos coffrets arrivent très bientôt. Retrouvez en attendant{" "}
            <Link href="/produits" className="text-amber-700 hover:underline">
              tous nos produits
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((p) => (
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
    </div>
  );
}
