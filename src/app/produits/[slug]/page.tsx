import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { ProductCard } from "@/components/product-card";

export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.active) notFound();

  const related = await prisma.product.findMany({
    where: {
      active: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-8 text-sm text-stone-500">
        <Link href="/produits" className="hover:text-amber-700">
          Nos cookies &amp; pâtisseries
        </Link>{" "}
        / <span className="text-stone-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {product.category.name}
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-amber-800">
            {formatPrice(product.priceCents)}
          </p>
          <p className="leading-relaxed text-stone-600">
            {product.description}
          </p>

          <ProductDetailActions
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
            }}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Vous aimerez aussi
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
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
        </section>
      )}
    </div>
  );
}
