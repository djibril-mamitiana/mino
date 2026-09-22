"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Cookie, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/produits", label: "Nos cookies" },
  { href: "/coffrets", label: "Coffrets cadeaux" },
  { href: "/nos-boutiques", label: "Nos boutiques" },
  { href: "/notre-histoire", label: "Notre histoire" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100 bg-[#fffaf0]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-white">
            <Cookie className="h-5 w-5" />
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-stone-800 sm:text-xl">
            La Biscuiterie Dorée
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-amber-700 ${
                pathname === link.href ? "text-amber-700" : "text-stone-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/panier"
            className="relative flex items-center gap-2 rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
          >
            <ShoppingBag className="h-4 w-4" /> Panier
            {totalCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                {totalCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Ouvrir le menu"
            className="rounded-md border border-amber-200 p-2 text-stone-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-amber-100 bg-[#fffaf0] px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-2 py-2 text-sm font-medium ${
                pathname === link.href
                  ? "bg-amber-100 text-amber-800"
                  : "text-stone-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
