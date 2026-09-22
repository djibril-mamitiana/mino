import Image from "next/image";
import { Phone, Clock, MapPin } from "lucide-react";
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
              className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={store.imageUrl}
                  alt={store.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  {store.name}
                </h2>
                <p className="mt-2 flex items-start gap-2 text-stone-600">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
                  <span>
                    {store.address}
                    <br />
                    {store.postalCode} {store.city}
                  </span>
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-stone-500">
                  <Phone className="h-4 w-4 text-amber-700" /> {store.phone}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                  <Clock className="h-4 w-4 text-amber-700" /> {store.hours}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
