"use client";

import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-stone-900">
          Contactez-nous
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">
          Une question, une envie de coffret sur-mesure, une remarque ? Notre
          équipe vous répond avec plaisir.
        </p>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-amber-100 bg-white p-6">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Nos coordonnées
          </h2>
          <p className="text-stone-600">✉️ bonjour@biscuiterie-doree.fr</p>
          <p className="text-stone-600">📞 01 23 45 67 89</p>
          <p className="text-stone-600">🕒 Du mardi au dimanche, 9h – 19h</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-amber-100 bg-white p-6"
        >
          {sent ? (
            <p className="rounded-lg bg-green-50 p-4 text-green-700">
              Merci pour votre message ! Notre équipe vous répondra dans les
              meilleurs délais.
            </p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-stone-700">
                  Nom
                </label>
                <input
                  required
                  type="text"
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Envoyer le message
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
