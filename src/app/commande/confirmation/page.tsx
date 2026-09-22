import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

export const revalidate = 0;

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  const order = id
    ? await prisma.order.findUnique({
        where: { id },
        include: { items: true },
      })
    : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Commande introuvable
        </h1>
        <Link
          href="/produits"
          className="mt-6 inline-block rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="text-5xl">🎉</div>
      <h1 className="mt-4 font-serif text-3xl font-bold text-stone-900">
        Merci {order.customerName.split(" ")[0]} !
      </h1>
      <p className="mt-2 text-stone-600">
        Votre commande n°{order.id.slice(-8).toUpperCase()} a bien été
        enregistrée. Un email de confirmation vous sera envoyé à{" "}
        {order.email}.
      </p>

      <div className="mt-8 rounded-2xl border border-amber-100 bg-white p-6 text-left">
        <h2 className="font-serif text-lg font-bold text-stone-900">
          Récapitulatif
        </h2>
        <div className="mt-4 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-stone-600">
                {item.quantity} × {item.productName}
              </span>
              <span className="font-semibold text-stone-800">
                {formatPrice(item.unitCents * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-amber-100 pt-4 font-bold">
          <span>Total</span>
          <span className="text-amber-800">{formatPrice(order.totalCents)}</span>
        </div>
        <p className="mt-4 text-sm text-stone-500">
          {order.deliveryMethod === "RETRAIT_BOUTIQUE"
            ? "Retrait en boutique"
            : `Livraison à ${order.address}, ${order.postalCode} ${order.city}`}
        </p>
      </div>

      <Link
        href="/produits"
        className="mt-8 inline-block rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-800"
      >
        Continuer mes achats
      </Link>
    </div>
  );
}
