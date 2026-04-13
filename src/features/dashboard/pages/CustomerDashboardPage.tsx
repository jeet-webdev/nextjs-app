"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ShopGrid from "@/features/shops/components/ShopGrid";
import { type ShopRecord } from "@/features/shops/types";

export default function CustomerDashboardPage() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [shops, setShops] = useState<ShopRecord[]>([]);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const response = await fetch("/api/users/count", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.push("/login");
          router.refresh();
          return;
        }

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          setError(data.error ?? "Unable to load user count.");
          return;
        }

        const data = (await response.json()) as { totalUsers: number };
        setTotalUsers(data.totalUsers);
      } catch {
        setError("Unable to load user count.");
      }
    };

    void loadCounts();
  }, [router]);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const response = await fetch("/api/shops", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.push("/login");
          router.refresh();
          return;
        }

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { shops: ShopRecord[] };
        setShops(data.shops);
      } catch {
        // Keep the page visible even when shops are unavailable.
      }
    };

    void loadShops();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06131f] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.22),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(14,116,144,0.24),transparent_34%),linear-gradient(180deg,#06131f_0%,#071a27_100%)]" />

      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        <header className="mb-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Customer Space</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Discover Shops</h1>
          <p className="mt-3 max-w-2xl text-gray-300">
            Explore curated shops and view live community size.
          </p>

          <div className="mt-8 inline-flex min-w-[220px] flex-col rounded-2xl border border-sky-300/30 bg-sky-400/10 px-6 py-4">
            <span className="text-xs uppercase tracking-[0.2em] text-sky-200">Total Users</span>
            <span className="mt-2 text-4xl font-black leading-none text-white">
              {totalUsers ?? "..."}
            </span>
          </div>

          {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
        </header>

        <ShopGrid shops={shops} emptyMessage="No shops published yet." />
      </main>
    </div>
  );
}
