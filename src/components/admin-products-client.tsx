"use client";

import { useEffect, useState, FormEvent } from "react";
import { ImageOff } from "lucide-react";
import { formatPrice } from "@/lib/money";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  categoryId: string;
  category: { id: string; name: string };
};

type Category = { id: string; name: string };

const emptyForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  featured: false,
  active: true,
};

export function AdminProductsClient({ categories }: { categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: (p.priceCents / 100).toString(),
      imageUrl: p.imageUrl,
      categoryId: p.categoryId,
      featured: p.featured,
      active: p.active,
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

    const payload = {
      name: form.name,
      description: form.description,
      priceCents: Math.round(parseFloat(form.price) * 100),
      imageUrl: form.imageUrl,
      categoryId: form.categoryId,
      featured: form.featured,
      active: form.active,
    };

    const res = await fetch(
      editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
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
    loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
      <form
        onSubmit={handleSubmit}
        className="h-fit space-y-4 rounded-2xl border border-amber-100 bg-white p-6"
      >
        <h2 className="font-serif text-lg font-bold text-stone-900">
          {editingId ? "Modifier le produit" : "Ajouter un produit"}
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
          <label className="block text-sm font-semibold text-stone-700">
            Description
          </label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700">
            Prix (€)
          </label>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700">
            Photo (chemin ou URL)
          </label>
          <input
            required
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="/images/products/mon-produit.jpg"
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
            Catégorie
          </label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 focus:border-amber-500 focus:outline-none"
          >
            <option value="">Sélectionner…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Mis en avant
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Visible en boutique
          </label>
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
        ) : products.length === 0 ? (
          <p className="text-stone-500">Aucun produit pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">
                    {p.name}{" "}
                    {!p.active && (
                      <span className="ml-1 rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-600">
                        masqué
                      </span>
                    )}
                    {p.featured && (
                      <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                        vedette
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-stone-500">
                    {p.category.name} · {formatPrice(p.priceCents)}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(p)}
                  className="rounded-full border border-amber-200 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-50"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
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
