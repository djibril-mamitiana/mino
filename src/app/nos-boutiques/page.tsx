import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function NosBoutiquesPage() {
  const stores = await prisma.store.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-stone-900">
          Nos boutiques
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">
          Venez découvrir nos cookies fraîchement sortis du four dans l&apos;une
          de nos boutiques.
        </p>
      </div>

      {stores.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">
          Nos boutiques seront bientôt annoncées ici.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {stores.map((store) => (
            <div
              key={store.id}
              className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
            >
              <h2 className="font-serif text-xl font-bold text-stone-900">
                {store.name}
              </h2>
              <p className="mt-2 text-stone-600">
                {store.address}
                <br />
                {store.postalCode} {store.city}
              </p>
              <p className="mt-3 text-sm text-stone-500">📞 {store.phone}</p>
              <p className="mt-1 text-sm text-stone-500">🕒 {store.hours}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
