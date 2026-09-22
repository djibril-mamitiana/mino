import Image from "next/image";
import { Wheat, ChefHat, Heart } from "lucide-react";

export default function NotreHistoirePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-4xl font-bold text-stone-900">
        Notre histoire
      </h1>

      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl">
        <Image
          src="/images/notre-histoire.jpg"
          alt="Nos pâtissiers préparant les cookies à la main"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          priority
          className="object-cover"
        />
      </div>

      <div className="mt-8 space-y-6 leading-relaxed text-stone-700">
        <p>
          Tout a commencé dans un petit fournil, avec une conviction simple :
          un bon cookie doit être moelleux à cœur, croustillant sur les bords,
          et généreux en pépites. De recette en recette, de fournée en
          fournée, La Biscuiterie Dorée est née de cette passion pour la
          pâtisserie artisanale.
        </p>
        <p>
          Aujourd&apos;hui, nos pâtissiers travaillent chaque jour des
          ingrédients sélectionnés avec soin — farines locales, beurre fermier,
          chocolat et fruits secs de qualité — pour créer des cookies et des
          pâtisseries qui racontent une histoire de gourmandise et de partage.
        </p>
        <p>
          Nos boutiques sont pensées comme des lieux chaleureux, où l&apos;on
          vient autant pour l&apos;odeur irrésistible des cookies tout juste
          sortis du four que pour le sourire de l&apos;équipe qui vous
          accueille.
        </p>
        <p>
          Que vous soyez de passage ou fidèle habitué, merci de faire partie
          de cette aventure gourmande.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl bg-amber-50 p-6 text-center">
          <Wheat className="mx-auto h-8 w-8 text-amber-700" />
          <h3 className="mt-2 font-serif font-semibold">Ingrédients choisis</h3>
          <p className="mt-1 text-sm text-stone-600">
            Des produits sélectionnés pour leur qualité et leur fraîcheur.
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-6 text-center">
          <ChefHat className="mx-auto h-8 w-8 text-amber-700" />
          <h3 className="mt-2 font-serif font-semibold">Savoir-faire artisanal</h3>
          <p className="mt-1 text-sm text-stone-600">
            Chaque cookie est préparé et cuit à la main dans nos fournils.
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-6 text-center">
          <Heart className="mx-auto h-8 w-8 text-amber-700" />
          <h3 className="mt-2 font-serif font-semibold">Fait avec passion</h3>
          <p className="mt-1 text-sm text-stone-600">
            Une équipe passionnée, heureuse de partager sa gourmandise.
          </p>
        </div>
      </div>
    </div>
  );
}
