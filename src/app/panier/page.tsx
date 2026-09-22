"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/money";

export default function PanierPage() {
  const { items, setQuantity, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="text-5xl">🛍️</div>
        <h1 className="mt-4 font-serif text-3xl font-bold text-stone-900">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-stone-600">
          Parcourez nos cookies et pâtisseries pour commencer votre commande.
        </p>
        <Link
          href="/produits"
          className="mt-6 inline-block rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Votre panier
      </h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4"
          >
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl text-3xl"
              style={{
                background: `linear-gradient(135deg, ${item.colorFrom}, ${item.colorTo})`,
              }}
            >
              {item.emoji}
            </div>
            <div className="flex-1">
              <Link
                href={`/produits/${item.slug}`}
                className="font-serif font-semibold text-stone-800 hover:text-amber-700"
              >
                {item.name}
              </Link>
              <p className="text-sm text-stone-500">
                {formatPrice(item.unitCents)} / unité
              </p>
            </div>
            <div className="flex items-center rounded-full border border-amber-200">
              <button
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                className="px-3 py-1.5 text-stone-600 hover:text-amber-700"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                className="px-3 py-1.5 text-stone-600 hover:text-amber-700"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <div className="w-24 text-right font-semibold text-stone-800">
              {formatPrice(item.unitCents * item.quantity)}
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              aria-label="Retirer du panier"
              className="text-stone-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-end gap-2 border-t border-amber-100 pt-6">
        <div className="flex items-center gap-4 text-lg">
          <span className="text-stone-600">Total</span>
          <span className="font-bold text-amber-800">
            {formatPrice(totalCents)}
          </span>
        </div>
        <Link
          href="/commande"
          className="rounded-full bg-amber-700 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Passer commande
        </Link>
      </div>
    </div>
  );
}
