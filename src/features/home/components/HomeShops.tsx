"use client";

import { useEffect, useMemo, useState } from "react";
import { type ShopRecord } from "@/features/shops/types";
import ShopGrid from "@/features/shops/components/ShopGrid";

export default function HomeShops() {
  const [shops, setShops] = useState<ShopRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const response = await fetch("/api/shops?public=true", { method: "GET" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { shops: ShopRecord[] };
        setShops(data.shops);
      } catch {
        // Keep home page usable even if shops API is unavailable.
      } finally {
        setIsLoading(false);
      }
    };

    void loadShops();
  }, []);

  const categoriesCount = useMemo(
    () => new Set(shops.map((shop) => shop.category.toLowerCase())).size,
    [shops],
  );

  const citiesCount = useMemo(
    () => new Set(shops.map((shop) => shop.city.toLowerCase())).size,
    [shops],
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Marketplace</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            Multiple Shops, One Platform
          </h2>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-200">
          Live shops: <span className="font-semibold text-white">{shops.length}</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Active Shops</p>
          <p className="mt-1 text-2xl font-black text-white">{shops.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Categories</p>
          <p className="mt-1 text-2xl font-black text-white">{categoriesCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Cities</p>
          <p className="mt-1 text-2xl font-black text-white">{citiesCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Model</p>
          <p className="mt-1 text-2xl font-black text-white">Marketplace</p>
        </div>
      </div>

      <ShopGrid
        shops={shops}
        emptyMessage={isLoading ? "Loading shops..." : "No shops published yet."}
      />
    </section>
  );
}
//