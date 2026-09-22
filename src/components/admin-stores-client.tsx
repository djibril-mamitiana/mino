"use client";

import { useEffect, useState, FormEvent } from "react";
import { ImageOff } from "lucide-react";

type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  hours: string;
  imageUrl: string;
  order: number;
};

const emptyForm = {
  name: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
  hours: "",
  imageUrl: "",
  order: "0",
};

export function AdminStoresClient() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadStores() {
    setLoading(true);
    const res = await fetch("/api/admin/stores");
    if (res.ok) {
      const data = await res.json();
      setStores(data.stores);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStores();
  }, []);

  function startEdit(s: Store) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      address: s.address,
      city: s.city,
      postalCode: s.postalCode,
      phone: s.phone,
      hours: s.hours,
      imageUrl: s.imageUrl,
      order: s.order.toString(),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { ...form, order: parseInt(form.order, 10) || 0 };

    const res = await fetch(
      editingId ? `/api/admin/stores/${editingId}` : "/api/admin/stores",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erreur lors de l'enregistrement.");
      setSaving(false);
      return;
    }

    cancelEdit();
    setSaving(false);
    loadStores();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement cette boutique ?")) return;
    await fetch(`/api/admin/stores/${id}`, { method: "DELETE" });
    loadStores();
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
      <form
        onSubmit={handleSubmit}
        className="h-fit space-y-4 rounded-2xl border border-amber-100 bg-white p-6"
      >
        <h2 className="font-serif text-lg font-bold text-stone-900">
          {editingId ? "Modifier la boutique" : "Ajouter une boutique"}
        </h2>

        <div>
          <label className="block text-sm font-semibold text-stone-700">Nom</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700">Adresse</label>
          <input
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700">
              Code postal
            </label>
            <input
              required
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700">Ville</label>
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700">
              Téléphone
            </label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700">
              Horaires
            </label>
            <input
              required
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700">
            Photo (chemin ou URL)
          </label>
          <input
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="/images/boutique.jpg"
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
          <div className="mt-2 flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-stone-300 bg-stone-50">
            {form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.imageUrl}
                alt="Aperçu"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <ImageOff className="h-6 w-6 text-stone-300" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700">
            Ordre d&apos;affichage
          </label>
          <input
            type="number"
            min="0"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-full bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : editingId ? "Mettre à jour" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-100"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div>
        {loading ? (
          <p className="text-stone-500">Chargement…</p>
        ) : stores.length === 0 ? (
          <p className="text-stone-500">Aucune boutique pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {stores.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">{s.name}</p>
                  <p className="text-sm text-stone-500">
                    {s.city} · {s.phone}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(s)}
                  className="rounded-full border border-amber-200 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-50"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
