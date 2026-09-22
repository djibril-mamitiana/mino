import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-amber-100 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl">🍪</span>
            <span className="font-serif text-lg font-bold">La Biscuiterie Dorée</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-400">
            Cookies et pâtisseries artisanales, préparés chaque jour dans nos
            fournils avec des ingrédients choisis avec soin.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Boutique
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/produits" className="hover:text-white">Nos cookies</Link></li>
            <li><Link href="/coffrets" className="hover:text-white">Coffrets cadeaux</Link></li>
            <li><Link href="/nos-boutiques" className="hover:text-white">Nos boutiques</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            À propos
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/notre-histoire" className="hover:text-white">Notre histoire</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/admin" className="hover:text-white">Espace équipe</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Nous écrire
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-stone-400">
            <li>bonjour@biscuiterie-doree.fr</li>
            <li>01 23 45 67 89</li>
            <li>Du mardi au dimanche, 9h – 19h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 px-4 py-4 text-center text-xs text-stone-500 sm:px-6">
        © {new Date().getFullYear()} La Biscuiterie Dorée — Site de démonstration, projet fictif.
      </div>
    </footer>
  );
}
