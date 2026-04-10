"use client";

import { useEffect, useMemo, useState } from "react";
import { type ShopRecord } from "@/features/shops/types";

export default function HomeShops() {
  const [shops, setShops] = useState<ShopRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const response = await fetch("/api/public/shops", { method: "GET" });

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
          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            Discover stores from different categories in one place, compare options quickly,
            and shop with confidence.
          </p>
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shops.length > 0 ? (
          shops.map((shop) => (
            <article
              key={shop.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <h3 className="text-lg font-semibold text-white">{shop.name}</h3>
              <p className="mt-2 text-sm text-indigo-300">{shop.category}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                <span>{shop.city}</span>
                <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-indigo-200">
                  {shop.rating}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-gray-300">
            {isLoading ? "Loading shops..." : "No shops published yet."}
          </div>
        )}
      </div>
    </section>
  );
}
//