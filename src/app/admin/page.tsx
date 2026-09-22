import { cookies } from "next/headers";
import Link from "next/link";
import { Cookie, Package } from "lucide-react";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = token ? await verifyAdminSessionToken(token) : false;

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="text-center font-serif text-3xl font-bold text-stone-900">
          Espace équipe
        </h1>
        <p className="mt-2 text-center text-stone-600">
          Connectez-vous pour gérer les produits et les commandes.
        </p>
        <AdminLoginForm />
      </div>
    );
  }

  const [productCount, orderCount, pendingCount, revenueAgg] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "EN_ATTENTE" } }),
    prisma.order.aggregate({ _sum: { totalCents: true } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Tableau de bord
        </h1>
        <AdminLogoutButton />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-amber-100 bg-white p-5">
          <p className="text-sm text-stone-500">Produits</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{productCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-5">
          <p className="text-sm text-stone-500">Commandes</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{orderCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-5">
          <p className="text-sm text-stone-500">En attente</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-white p-5">
          <p className="text-sm text-stone-500">Chiffre d&apos;affaires</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">
            {((revenueAgg._sum.totalCents ?? 0) / 100).toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/produits"
          className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-stone-900">
            <Cookie className="h-5 w-5 text-amber-700" /> Gérer les produits
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Ajouter, modifier ou retirer des cookies et pâtisseries.
          </p>
        </Link>
        <Link
          href="/admin/commandes"
          className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm hover:shadow-md"
        >
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-stone-900">
            <Package className="h-5 w-5 text-amber-700" /> Gérer les commandes
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Suivre et mettre à jour le statut des commandes clients.
          </p>
        </Link>
      </div>
    </div>
  );
}
