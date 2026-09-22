"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/money";

export default function CommandePage() {
  const { items, totalCents, clear } = useCart();
  const router = useRouter();
  const [deliveryMethod, setDeliveryMethod] = useState<
    "RETRAIT_BOUTIQUE" | "LIVRAISON"
  >("RETRAIT_BOUTIQUE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Votre panier est vide
        </h1>
        <Link
          href="/produits"
          className="mt-6 inline-block rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.get("customerName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          deliveryMethod,
          address: formData.get("address") || undefined,
          city: formData.get("city") || undefined,
          postalCode: formData.get("postalCode") || undefined,
          notes: formData.get("notes") || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      clear();
      router.push(`/commande/confirmation?id=${data.orderId}`);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-stone-900">
        Finaliser la commande
      </h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700">
              Nom complet
            </label>
            <input
              name="customerName"
              required
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-stone-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700">
                Téléphone
              </label>
              <input
                name="phone"
                required
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700">
              Mode de récupération
            </label>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod("RETRAIT_BOUTIQUE")}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold ${
                  deliveryMethod === "RETRAIT_BOUTIQUE"
                    ? "border-amber-600 bg-amber-50 text-amber-800"
                    : "border-stone-200 text-stone-600"
                }`}
              >
                Retrait en boutique
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod("LIVRAISON")}
                className={`flex-1 rounded-lg border px-4 py-3 text-sm font-semibold ${
                  deliveryMethod === "LIVRAISON"
                    ? "border-amber-600 bg-amber-50 text-amber-800"
                    : "border-stone-200 text-stone-600"
                }`}
              >
                Livraison à domicile
              </button>
            </div>
          </div>

          {deliveryMethod === "LIVRAISON" && (
            <div className="space-y-4 rounded-lg bg-amber-50 p-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700">
                  Adresse
                </label>
                <input
                  name="address"
                  required
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-stone-700">
                    Code postal
                  </label>
                  <input
                    name="postalCode"
                    required
                    className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700">
                    Ville
                  </label>
                  <input
                    name="city"
                    required
                    className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-stone-700">
              Note pour la commande (optionnel)
            </label>
            <textarea
              name="notes"
              rows={3}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <p className="text-xs text-stone-500">
            Démonstration : aucun paiement réel n&apos;est effectué. La
            commande est enregistrée et pourra être réglée en boutique ou à
            la livraison.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {loading ? "Envoi en cours…" : "Confirmer la commande"}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-amber-100 bg-white p-6">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            Récapitulatif
          </h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm text-stone-600"
              >
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span className="font-semibold text-stone-800">
                  {formatPrice(item.unitCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-amber-100 pt-4 font-bold">
            <span>Total</span>
            <span className="text-amber-800">{formatPrice(totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
