"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/money";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  emoji: string;
  colorFrom: string;
  colorTo: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitCents: product.priceCents,
      emoji: product.emoji,
      colorFrom: product.colorFrom,
      colorTo: product.colorTo,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/produits/${product.slug}`}>
        <div
          className="flex aspect-square items-center justify-center text-6xl transition-transform group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${product.colorFrom}, ${product.colorTo})`,
          }}
        >
          {product.emoji}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-serif text-lg font-semibold text-stone-800 hover:text-amber-700">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 flex-1 text-sm text-stone-500">
          {product.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-amber-800">
            {formatPrice(product.priceCents)}
          </span>
          <button
            onClick={handleAdd}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              added
                ? "bg-green-600 text-white"
                : "bg-amber-700 text-white hover:bg-amber-800"
            }`}
          >
            {added ? "Ajouté ✓" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
