"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/money";

type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  status: string;
  totalCents: number;
  deliveryMethod: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  createdAt: string;
  items: { id: string; productName: string; quantity: number; unitCents: number }[];
};

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EN_PREPARATION: "En préparation",
  PRETE: "Prête",
  LIVREE: "Livrée",
  ANNULEE: "Annulée",
};

const STATUS_OPTIONS = Object.keys(STATUS_LABELS);

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (loading) {
    return <p className="mt-8 text-stone-500">Chargement…</p>;
  }

  if (orders.length === 0) {
    return <p className="mt-8 text-stone-500">Aucune commande pour le moment.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl border border-amber-100 bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-stone-800">
                {order.customerName}{" "}
                <span className="text-sm font-normal text-stone-500">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
              </p>
              <p className="text-sm text-stone-500">
                {order.email} · {order.phone}
              </p>
              <p className="mt-1 text-sm text-stone-500">
                {order.deliveryMethod === "RETRAIT_BOUTIQUE"
                  ? "Retrait en boutique"
                  : `Livraison : ${order.address}, ${order.postalCode} ${order.city}`}
              </p>
              <p className="text-xs text-stone-400">
                {new Date(order.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-amber-800">
                {formatPrice(order.totalCents)}
              </p>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="mt-2 rounded-lg border border-stone-200 px-2 py-1 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 border-t border-amber-50 pt-3 text-sm text-stone-600">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.quantity} × {item.productName}
                </span>
                <span>{formatPrice(item.unitCents * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
