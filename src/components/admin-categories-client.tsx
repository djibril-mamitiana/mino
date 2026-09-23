"use client";

import { useEffect, useState, FormEvent } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  _count: { products: number };
};

const emptyForm = { name: "", order: "0" };

export function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function startEdit(c: Category) {
    setEditingId(c.id);
    setForm({ name: c.name, order: c.order.toString() });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { name: form.name, order: parseInt(form.order, 10) || 0 };

    const res = await fetch(
      editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
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
    loadCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement cette catégorie ?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Impossible de supprimer cette catégorie.");
      return;
    }
    loadCategories();
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
      <form
        onSubmit={handleSubmit}
        className="h-fit space-y-4 rounded-2xl border border-amber-100 bg-white p-6"
      >
        <h2 className="font-serif text-lg font-bold text-stone-900">
          {editingId ? "Modifier la catégorie" : "Ajouter une catégorie"}
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
        ) : categories.length === 0 ? (
          <p className="text-stone-500">Aucune catégorie pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-stone-800">{c.name}</p>
                  <p className="text-sm text-stone-500">
                    {c._count.products} produit{c._count.products > 1 ? "s" : ""} ·
                    ordre {c.order}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(c)}
                  className="rounded-full border border-amber-200 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-50"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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
