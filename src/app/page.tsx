import Link from "next/link";
import Image from "next/image";
import { Cookie, Heart, CakeSlice, Gift, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const revalidate = 0;

const CATEGORY_ICONS: Record<string, typeof Cookie> = {
  "cookies-classiques": Cookie,
  "cookies-gourmands": Heart,
  patisseries: CakeSlice,
  "coffrets-cadeaux": Gift,
};

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, featured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100 via-[#fffaf0] to-[#fffaf0]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2">
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-amber-700 shadow-sm">
              Fait main, chaque jour, dans nos fournils
            </span>
            <h1 className="font-serif text-4xl font-bold leading-tight text-stone-900 sm:text-6xl">
              Des cookies artisanaux qui réchauffent les cœurs
            </h1>
            <p className="max-w-xl text-lg text-stone-600">
              Pâte moelleuse, pépites généreuses, recettes gourmandes
              imaginées par nos pâtissiers. Découvrez nos cookies et
              pâtisseries artisanales, à savourer sur place ou à offrir.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/produits"
                className="rounded-full bg-amber-700 px-7 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-amber-800"
              >
                Découvrir nos cookies
              </Link>
              <Link
                href="/coffrets"
                className="rounded-full border border-amber-300 bg-white px-7 py-3 text-base font-semibold text-amber-800 transition-colors hover:bg-amber-50"
              >
                Voir les coffrets cadeaux
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/hero.jpg"
              alt="Pile de cookies artisanaux moelleux"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Catégories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-serif text-3xl font-bold text-stone-900">
            Explorez nos univers gourmands
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] ?? Cookie;
              return (
                <Link
                  key={cat.id}
                  href={`/produits?categorie=${cat.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-transform group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="font-serif text-lg font-semibold text-stone-800">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Produits vedettes */}
      {featured.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Nos coups de cœur
              </h2>
              <Link
                href="/produits"
                className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline"
              >
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
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
          </div>
        </section>
      )}

      {/* Bannière histoire */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-stone-900 text-white md:grid-cols-2">
          <div className="px-8 py-12 sm:px-14">
            <h2 className="font-serif text-3xl font-bold">
              Une histoire de gourmandise et de partage
            </h2>
            <p className="mt-4 text-stone-300">
              Née dans un petit fournil, La Biscuiterie Dorée s&apos;est
              donnée pour mission de réinventer le cookie artisanal : des
              recettes travaillées, des ingrédients sélectionnés, et surtout
              beaucoup de gourmandise partagée.
            </p>
            <Link
              href="/notre-histoire"
              className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-400"
            >
              Découvrir notre histoire
            </Link>
          </div>
          <div className="relative h-64 md:h-full md:min-h-[320px]">
            <Image
              src="/images/notre-histoire.jpg"
              alt="Préparation artisanale des cookies"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Boutiques teaser */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="relative h-72 w-full">
            <Image
              src="/images/boutique.jpg"
              alt="Intérieur d'une boutique La Biscuiterie Dorée"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/60" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Retrouvez-nous en boutique
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-200">
              Venez sentir l&apos;odeur des cookies tout juste sortis du four
              dans l&apos;une de nos boutiques.
            </p>
            <Link
              href="/nos-boutiques"
              className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-400"
            >
              Trouver une boutique
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
