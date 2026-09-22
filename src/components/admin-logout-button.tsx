"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100"
    >
      Se déconnecter
    </button>
  );
}
