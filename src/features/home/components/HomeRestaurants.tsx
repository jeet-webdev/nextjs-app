"use client";

import { useEffect, useMemo, useState } from "react";

import RestaurantGrid from "@/features/restaurants/components/RestaurantGrid";
import { type RestaurantRecord } from "@/features/restaurants/types";
type HomeRestaurantsProps = {
  onView?: (restaurant: RestaurantRecord) => void;
};
export default function HomeRestaurants( { onView }: HomeRestaurantsProps) {
  const [restaurants, setRestaurants] = useState<RestaurantRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response = await fetch("/api/restaurants?public=true", { method: "GET" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { restaurants: RestaurantRecord[] };
        setRestaurants(data.restaurants);
      } catch {
      
      } finally {
        setIsLoading(false);
      }
    };

    void loadRestaurants();
  }, []);



  const citiesCount = useMemo(
    () => new Set(restaurants.map((restaurant) => restaurant.city.toLowerCase())).size,
    [restaurants],
  );

  return (
    <section id="restaurants" className="mx-auto w-full max-w-7xl px-6 pb-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Marketplace</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            Multiple Restaurants, One Platform
          </h2>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-200">
          Live restaurants: <span className="font-semibold text-white">{restaurants.length}</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">Active Restaurants</p>
          <p className="mt-1 text-2xl font-black text-white">{restaurants.length}</p>
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

      <RestaurantGrid
        restaurants={restaurants}
        onView={onView}
        emptyMessage={isLoading ? "Loading restaurants..." : "No restaurants published yet."}
      />
    </section>
  );
}
