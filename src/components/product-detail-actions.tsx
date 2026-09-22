"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export function ProductDetailActions({
  product,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    emoji: string;
    colorFrom: string;
    colorTo: string;
  };
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        unitCents: product.priceCents,
        emoji: product.emoji,
        colorFrom: product.colorFrom,
        colorTo: product.colorTo,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-stone-600">
          Quantité
        </span>
        <div className="flex items-center rounded-full border border-amber-200">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-lg text-stone-600 hover:text-amber-700"
            aria-label="Diminuer la quantité"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1.5 text-lg text-stone-600 hover:text-amber-700"
            aria-label="Augmenter la quantité"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleAdd}
          className={`rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
            added
              ? "bg-green-600 text-white"
              : "bg-amber-700 text-white hover:bg-amber-800"
          }`}
        >
          {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
        </button>
        <button
          onClick={() => {
            handleAdd();
            router.push("/panier");
          }}
          className="rounded-full border border-amber-300 bg-white px-6 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-50"
        >
          Commander maintenant
        </button>
      </div>
    </div>
  );
}
